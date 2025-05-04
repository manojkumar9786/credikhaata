const Customer = require('../models/Customer');
const asyncHandler = require('express-async-handler');

// @desc    Get all customers for a user
// @route   GET /api/customers
// @access  Private
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ user: req.user._id }).sort('-createdAt');
  res.json(customers);
});

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = asyncHandler(async (req, res) => {
  const { name, phone, address, trustScore, creditLimit } = req.body;

  const customer = await Customer.create({
    user: req.user._id,
    name,
    phone,
    address,
    trustScore,
    creditLimit,
  });

  res.status(201).json(customer);
});

// @desc    Get a single customer
// @route   GET /api/customers/:id
// @access  Private
const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  res.json(customer);
});

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  customer.name = req.body.name || customer.name;
  customer.phone = req.body.phone || customer.phone;
  customer.address = req.body.address || customer.address;
  customer.trustScore = req.body.trustScore || customer.trustScore;
  customer.creditLimit = req.body.creditLimit || customer.creditLimit;

  const updatedCustomer = await customer.save();
  res.json(updatedCustomer);
});

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  await customer.remove();
  res.json({ message: 'Customer removed' });
});

module.exports = {
  getCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};