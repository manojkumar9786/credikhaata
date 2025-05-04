# CrediKhaata - Loan Tracker for Shopkeepers

![CrediKhaata Logo](https://via.placeholder.com/150x50?text=CrediKhaata) 
*(Replace with your actual logo)*

A RESTful backend service that helps small business owners manage customer credit accounts, track loans, and monitor repayments.

## Features

- **User Authentication**
  - Shopkeeper registration/login
  - JWT-based secure sessions
- **Customer Management**
  - Add/edit/delete customer profiles
  - Track trust scores (0-10) and credit limits
- **Loan Tracking**
  - Record credit sales as loans
  - Set due dates and payment frequencies
  - Automatic overdue status detection
- **Repayment System**
  - Record partial/full payments
  - Auto-update loan balances
  - Generate PDF receipts
- **Alerts & Reporting**
  - Overdue payment reminders
  - Shopkeeper dashboard with key metrics
  - Webhook for payment notifications

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT
- **PDF Generation**: PDFKit
- **Date Handling**: Moment.js

## API Documentation

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new shopkeeper |
| `/api/auth/login` | POST | Login existing user |
| `/api/auth/profile` | GET | Get user profile |

### Customers
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/customers` | GET | Get all customers |
| `/api/customers` | POST | Create new customer |
| `/api/customers/:id` | GET | Get single customer |
| `/api/customers/:id` | PUT | Update customer |
| `/api/customers/:id` | DELETE | Delete customer |

### Loans
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/loans` | GET | Get all loans |
| `/api/loans` | POST | Create new loan |
| `/api/loans/:id` | GET | Get single loan |
| `/api/loans/:id/status` | PUT | Update loan status |
| `/api/loans/overdue` | GET | Get overdue loans |

### Repayments
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/loans/:loanId/repayments` | GET | Get all repayments |
| `/api/loans/:loanId/repayments` | POST | Record new repayment |
| `/api/repayments/:id/receipt` | GET | Generate PDF receipt |

### Reports
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/summary` | GET | Get shopkeeper summary |
| `/api/overdue` | GET | Get overdue alerts |

### Webhooks
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/webhook/repayment` | POST | Payment notification webhook |

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/credikhaata.git
   cd credikhaata