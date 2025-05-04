const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const { protect } = require('./middlewares/auth');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const loanRoutes = require('./routes/loanRoutes');
const repaymentRoutes = require('./routes/repaymentRoutes');
const alertRoutes = require('./routes/alertRoutes');
const summaryService = require('./services/summaryService');
const alertService = require('./services/alertService');

const app = express();

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/repayments', repaymentRoutes);
app.use('/api/alerts', alertRoutes);

// Summary and reports routes
app.get('/api/summary', protect, async (req, res) => {
  try {
    const summary = await summaryService.getShopkeeperSummary(req.user._id);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/overdue', protect, async (req, res) => {
  try {
    const overdueLoans = await alertService.getCustomerOverdueAlerts(req.user._id);
    res.json(overdueLoans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Webhook endpoint (mock)
app.post('/api/webhook/repayment', (req, res) => {
  console.log('Webhook received:', req.body);
  
  // In a real implementation, you would:
  // 1. Verify the webhook signature
  // 2. Process the payment notification
  // 3. Update your database accordingly
  
  res.json({ 
    status: 'received',
    message: 'Webhook processed successfully',
    data: req.body 
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;