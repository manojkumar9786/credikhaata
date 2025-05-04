const moment = require('moment');

const calculateDueDate = (issueDate, frequency) => {
  const date = moment(issueDate);
  
  switch (frequency) {
    case 'bi-weekly':
      return date.add(2, 'weeks').toDate();
    case 'monthly':
      return date.add(1, 'months').toDate();
    default:
      return date.add(1, 'months').toDate();
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

module.exports = {
  calculateDueDate,
  formatCurrency,
};