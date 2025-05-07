import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  promotionDate: {
    type: Date,
  },
  performanceRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  notes: [noteSchema],
}, {
  timestamps: true,
});

export const Employee = mongoose.model('Employee', employeeSchema);