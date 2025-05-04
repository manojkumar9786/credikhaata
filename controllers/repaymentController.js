const asyncHandler = require('express-async-handler');
const Repayment = require('../models/Repayment');
const Loan = require('../models/Loan');
const PDFDocument = require('pdfkit');

// @desc    Get all repayments for a loan
// @route   GET /api/loans/:loanId/repayments
// @access  Private
const getRepayments = asyncHandler(async (req, res) => {
  const repayments = await Repayment.find({
    loan: req.params.loanId,
    user: req.user._id
  }).sort('-paymentDate');

  res.json(repayments);
});

// @desc    Create new repayment
// @route   POST /api/loans/:loanId/repayments
// @access  Private
const createRepayment = asyncHandler(async (req, res) => {
  const { amount, paymentMethod, notes } = req.body;

  const loan = await Loan.findOne({
    _id: req.params.loanId,
    user: req.user._id
  });

  if (!loan) {
    res.status(404);
    throw new Error('Loan not found');
  }

  const repayment = await Repayment.create({
    user: req.user._id,
    loan: loan._id,
    customer: loan.customer,
    amount,
    paymentMethod,
    notes
  });

  // Update loan balance
  loan.remainingAmount -= amount;
  if (loan.remainingAmount <= 0) {
    loan.remainingAmount = 0;
    loan.status = 'paid';
    loan.isActive = false;
  }
  await loan.save();

  res.status(201).json(repayment);
});

// @desc    Generate PDF receipt
// @route   GET /api/repayments/:id/receipt
// @access  Private
const generateReceipt = asyncHandler(async (req, res) => {
  const repayment = await Repayment.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate('loan customer');

  if (!repayment) {
    res.status(404);
    throw new Error('Repayment not found');
  }

  // Create PDF
  const doc = new PDFDocument();
  const filename = `receipt-${repayment._id.toString().slice(-6)}.pdf`;

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  // Build PDF
  doc.pipe(res);
  
  // Header
  doc.fontSize(20).text(req.user.shopName || 'CrediKhaata', { align: 'center' });
  doc.fontSize(14).text('Payment Receipt', { align: 'center' });
  doc.moveDown();

  // Receipt details
  doc.fontSize(12).text(`Receipt #: ${repayment._id.toString().slice(-6).toUpperCase()}`);
  doc.text(`Date: ${repayment.paymentDate.toLocaleDateString()}`);
  doc.text(`Customer: ${repayment.customer.name}`);
  doc.moveDown();

  // Payment info
  doc.font('Helvetica-Bold').text('Amount Paid:', { continued: true });
  doc.font('Helvetica').text(` ₹${repayment.amount.toFixed(2)}`);
  doc.font('Helvetica-Bold').text('Payment Method:', { continued: true });
  doc.font('Helvetica').text(` ${repayment.paymentMethod}`);
  doc.font('Helvetica-Bold').text('Remaining Balance:', { continued: true });
  doc.font('Helvetica').text(` ₹${repayment.loan.remainingAmount.toFixed(2)}`);
  doc.moveDown();

  // Footer
  doc.fontSize(10).text('Thank you for your payment!', { align: 'center' });

  doc.end();
});

module.exports = {
  getRepayments,
  createRepayment,
  generateReceipt
};