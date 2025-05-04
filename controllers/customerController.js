const Customer = require('../models/Customer');
const asyncHandler = require('express-async-handler');

// @route   GET /api/customers
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ user: req.user._id }).sort('-createdAt');
  res.json(customers);
});

// @route   POST /api/customers
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

// @route   GET /api/customers/:id
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

// @route   PUT /api/customers/:id
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

// @route   DELETE /api/customers/:id
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