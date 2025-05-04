const Loan = require('../models/Loan');
const moment = require('moment');

// Check for overdue loans and update their status
const checkOverdueLoans = async () => {
  const today = moment().startOf('day');
  const overdueLoans = await Loan.find({
    dueDate: { $lt: today.toDate() },
    status: { $ne: 'paid' },
    isActive: true,
  });

  for (const loan of overdueLoans) {
    loan.status = 'overdue';
    await loan.save();
  }

  console.log(`Updated ${overdueLoans.length} loans to overdue status`);
};

// Get customers with overdue loans for a specific user
const getCustomerOverdueAlerts = async (userId) => {
  const today = moment().startOf('day');
  const overdueLoans = await Loan.find({
    user: userId,
    dueDate: { $lt: today.toDate() },
    status: 'overdue',
    isActive: true,
  }).populate('customer', 'name phone');

  return overdueLoans;
};

// Mock SMS/WhatsApp notification
const sendPaymentReminder = async (customer, loan) => {
  // In a real app, this would integrate with an SMS/WhatsApp API
  console.log(`Sending reminder to ${customer.name} (${customer.phone})`);
  console.log(`About loan: ${loan.description}, Amount: ${loan.remainingAmount}, Due: ${loan.dueDate}`);
  return true;
};

module.exports = {
  checkOverdueLoans,
  getCustomerOverdueAlerts,
  sendPaymentReminder,
};