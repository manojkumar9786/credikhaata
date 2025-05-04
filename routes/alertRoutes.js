const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  sendOverdueReminder,
  getOverdueLoans
} = require('../controllers/alertController');

// @desc    Send reminder for overdue loan
// @route   POST /api/alerts/loans/:loanId/remind
// @access  Private
router.post('/loans/:loanId/remind', protect, sendOverdueReminder);

// @desc    Get all overdue loans
// @route   GET /api/alerts/overdue
// @access  Private
router.get('/overdue', protect, getOverdueLoans);

module.exports = router;