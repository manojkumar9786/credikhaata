const app = require('./app');
const http = require('http');
const { checkOverdueLoans } = require('./services/alertService');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  // Schedule overdue loan checks (every day at midnight)
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      checkOverdueLoans();
    }
  }, 60000); // Check every minute
});