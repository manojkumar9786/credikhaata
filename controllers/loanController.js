const Loan = require('../models/Loan');
const Customer = require('../models/Customer');
const asyncHandler = require('express-async-handler');
const moment = require('moment');

// @desc    Get all loans for a user
// @route   GET /api/loans
// @access  Private
const getLoans = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = { user: req.user._id };

  if (status) {
    query.status = status;
  }

  const loans = await Loan.find(query)
    .populate('customer', 'name phone')
    .sort('-issueDate');
  res.json(loans);
});

// @desc    Create a new loan
// @route   POST /api/loans
// @access  Private
const createLoan = asyncHandler(async (req, res) => {
  const {
    customerId,
    description,
    amount,
    dueDate,
    frequency,
    interestRate,
    graceDays,
  } = req.body;

  // Check if customer exists and belongs to the user
  const customer = await Customer.findOne({
    _id: customerId,
    user: req.user._id,
  });

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Check if loan amount exceeds customer's credit limit
  if (customer.creditLimit > 0 && amount > customer.creditLimit) {
    res.status(400);
    throw new Error('Loan amount exceeds customer credit limit');
  }

  const loan = await Loan.create({
    user: req.user._id,
    customer: customerId,
    description,
    amount,
    remainingAmount: amount,
    dueDate,
    frequency,
    interestRate,
    graceDays,
  });

  res.status(201).json(loan);
});

// @desc    Get a single loan
// @route   GET /api/loans/:id
// @access  Private
const getLoan = asyncHandler(async (req, res) => {
  const loan = await Loan.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate('customer', 'name phone');

  if (!loan) {
    res.status(404);
    throw new Error('Loan not found');
  }

  res.json(loan);
});

// @desc    Update loan status (mark as paid)
// @route   PUT /api/loans/:id/status
// @access  Private
const updateLoanStatus = asyncHandler(async (req, res) => {
  const loan = await Loan.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!loan) {
    res.status(404);
    throw new Error('Loan not found');
  }

  loan.status = req.body.status || loan.status;
  loan.isActive = req.body.isActive !== undefined ? req.body.isActive : loan.isActive;

  const updatedLoan = await loan.save();
  res.json(updatedLoan);
});

// @desc    Check for overdue loans
// @route   GET /api/loans/overdue
// @access  Private
const getOverdueLoans = asyncHandler(async (req, res) => {
  const today = moment().startOf('day');
  const overdueLoans = await Loan.find({
    user: req.user._id,
    dueDate: { $lt: today.toDate() },
    status: { $ne: 'paid' },
    isActive: true,
  }).populate('customer', 'name phone');

  res.json(overdueLoans);
});

module.exports = {
  getLoans,
  createLoan,
  getLoan,
  updateLoanStatus,
  getOverdueLoans,
};