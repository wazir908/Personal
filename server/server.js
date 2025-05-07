import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import employeeRoutes from './routes/employees.js';
import http from 'http';  // Import the http module
import { Server } from 'socket.io'; // Import socket.io server
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const app = express();

// Create an HTTP server to work with Socket.io
const server = http.createServer(app);

// Set up Socket.io
export const io = new Server(server, {
  cors: {
    origin: '*',  // Allow connections from any origin (you can restrict this for production)
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use('/api/employees', employeeRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.set('io', io); // ✅ so req.app.get('io') works inside route files

app.use('/api/notifications', notificationRoutes);
// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});