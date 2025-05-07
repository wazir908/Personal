import express from 'express';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';

const router = express.Router();

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
  req.session.otp = otp;
  req.session.email = email;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`,
    });
    res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { otp } = req.body;
  if (otp === req.session.otp) {
    req.session.isAuth = true;
    res.json({ success: true, message: 'OTP verified' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid OTP' });
  }
});

// Protected test route
router.get('/protected', (req, res) => {
  if (req.session.isAuth) {
    res.json({ message: 'You are authorized 🎉' });
  } else {
    res.status(401).json({ message: 'Unauthorized access' });
  }
});

export default router;