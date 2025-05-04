const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  remainingAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  frequency: {
    type: String,
    enum: ['bi-weekly', 'monthly'],
    required: true,
  },
  interestRate: {
    type: Number,
    default: 0,
    min: 0,
  },
  graceDays: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

loanSchema.index({ dueDate: 1 });
loanSchema.index({ status: 1 });

module.exports = mongoose.model('Loan', loanSchema);