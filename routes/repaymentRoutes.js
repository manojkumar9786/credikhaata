const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  getRepayments,
  createRepayment,
  generateReceipt
} = require('../controllers/repaymentController');

// @desc    Get all repayments for a loan
// @route   GET /api/loans/:loanId/repayments
// @access  Private
router.route('/loans/:loanId/repayments')
  .get(protect, getRepayments)
  .post(protect, createRepayment);

// @desc    Generate PDF receipt
// @route   GET /api/repayments/:id/receipt
// @access  Private
router.get('/:id/receipt', protect, generateReceipt);

module.exports = router;