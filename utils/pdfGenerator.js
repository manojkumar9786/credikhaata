// Mock PDF generator - in a real app, use a library like pdfkit or puppeteer
const generateReceiptPDF = (data) => {
    return {
      filename: `receipt_${data.receiptNumber}.pdf`,
      content: `Receipt for ${data.customerName}\nAmount: ${data.amount}\nDate: ${data.date}`,
    };
  };
  
  module.exports = {
    generateReceiptPDF,
  };