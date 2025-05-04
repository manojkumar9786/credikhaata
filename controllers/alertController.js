const asyncHandler = require('express-async-handler');
const Loan = require('../models/Loan');

// @route   POST /api/loans/:loanId/remind
const sendOverdueReminder = asyncHandler(async (req, res) => {
  const loan = await Loan.findOne({
    _id: req.params.loanId,
    user: req.user._id
  }).populate('customer');

  if (!loan) {
    res.status(404);
    throw new Error('Loan not found');
  }

  // Mock SMS/WhatsApp integration
  const message = `Dear ${loan.customer.name},\n\n` +
    `This is a reminder that your payment of ₹${loan.remainingAmount} ` +
    `for "${loan.description}" is overdue.\n` +
    `Due date: ${loan.dueDate.toLocaleDateString()}\n\n` +
    `Please make the payment at your earliest convenience.\n\n` +
    `Thank you,\n${req.user.shopName || 'CrediKhaata'}`;

  console.log('=== MOCK NOTIFICATION ===');
  console.log(`To: ${loan.customer.phone}`);
  console.log(`Message:\n${message}`);
  console.log('=========================');

  res.json({
    success: true,
    message: 'Reminder sent successfully',
    customer: {
      name: loan.customer.name,
      phone: loan.customer.phone
    },
    amountDue: loan.remainingAmount,
    dueDate: loan.dueDate
  });
});

// @route   GET /api/alerts/overdue
const getOverdueLoans = asyncHandler(async (req, res) => {
  const today = new Date();
  const overdueLoans = await Loan.find({
    user: req.user._id,
    dueDate: { $lt: today },
    status: { $ne: 'paid' },
    isActive: true
  }).populate('customer', 'name phone');

  res.json({
    count: overdueLoans.length,
    overdueLoans: overdueLoans.map(loan => ({
      id: loan._id,
      customer: loan.customer.name,
      phone: loan.customer.phone,
      amount: loan.remainingAmount,
      dueDate: loan.dueDate,
      description: loan.description
    }))
  });
});

module.exports = {
  sendOverdueReminder,
  getOverdueLoans
};