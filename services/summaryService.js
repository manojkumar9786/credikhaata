const Loan = require('../models/Loan');
const Repayment = require('../models/Repayment');
const moment = require('moment');

const getShopkeeperSummary = async (userId) => {
  // Get all active loans
  const loans = await Loan.find({ user: userId, isActive: true });
  
  // Get all repayments
  const repayments = await Repayment.find({ user: userId });

  // Calculate totals
  const totalLoaned = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalCollected = repayments.reduce((sum, repayment) => sum + repayment.amount, 0);
  
  // Calculate overdue amount
  const today = moment().startOf('day');
  const overdueLoans = loans.filter(loan => 
    loan.dueDate < today.toDate() && loan.status !== 'paid'
  );
  const overdueAmount = overdueLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);

  // Calculate average repayment time (in days)
  let avgRepaymentTime = 0;
  if (repayments.length > 0) {
    const totalDays = repayments.reduce((sum, repayment) => {
      const loan = loans.find(l => l._id.equals(repayment.loan));
      if (loan) {
        const daysDiff = moment(repayment.paymentDate).diff(moment(loan.issueDate), 'days');
        return sum + daysDiff;
      }
      return sum;
    }, 0);
    avgRepaymentTime = totalDays / repayments.length;
  }

  return {
    totalLoaned,
    totalCollected,
    overdueAmount,
    avgRepaymentTime: avgRepaymentTime.toFixed(1),
    activeLoans: loans.length,
    overdueLoans: overdueLoans.length,
  };
};

module.exports = {
  getShopkeeperSummary,
};