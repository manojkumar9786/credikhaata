const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const repaymentController = require('../controllers/repaymentController');
const { protect } = require('../middlewares/auth');

router.route('/')
  .get(protect, loanController.getLoans)
  .post(protect, loanController.createLoan);

router.route('/overdue')
  .get(protect, loanController.getOverdueLoans);

router.route('/:id')
  .get(protect, loanController.getLoan);

router.route('/:id/status')
  .put(protect, loanController.updateLoanStatus);

// Repayment routes
router.route('/:loanId/repayments')
  .get(protect, repaymentController.getRepayments)
  .post(protect, repaymentController.createRepayment);

module.exports = router;