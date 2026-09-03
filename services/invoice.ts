// services/invoice.ts
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { API_BASE_URL } from './api';

// ─── Types ──────────────────────────────────────────────────────────────────────
export interface InvoiceData {
  orderId: number;
  orderSource?: 'customer' | 'admin';
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  eventDate: string;
  eventTime?: string;
  eventType: string;
  venue: string;
  guestCount: number;
  specialInstructions?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  deliveryCharge: number;
  gst: number;
  couponDiscount: number;
  couponCode?: string;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  address: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

// ─── Invoice HTML Generator ──────────────────────────────────────────────────
export const generateInvoiceHTML = (data: InvoiceData): string => {
  const now = new Date();
  const invoiceDate = now.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  const invoiceTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const eventDateFormatted = data.eventDate ? new Date(data.eventDate).toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }) : 'N/A';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice #${data.orderNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: #ffffff;
          padding: 0;
          margin: 0;
          color: #1a1a2e;
        }
        .invoice-container {
          max-width: 900px;
          margin: 0 auto;
          background: #ffffff;
          overflow: hidden;
        }
        .invoice-header {
          background: linear-gradient(135deg, #0c2d67 0%, #1a4a8a 100%);
          padding: 40px 50px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .invoice-header h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
        .invoice-header .subtitle { font-size: 14px; opacity: 0.8; margin-top: 4px; }
        .invoice-number { text-align: right; }
        .invoice-number .number { font-size: 22px; font-weight: 700; letter-spacing: 1px; }
        .invoice-number .date { font-size: 13px; opacity: 0.8; margin-top: 4px; }
        .invoice-body { padding: 40px 50px; }
        .company-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }
        .company-info .company-name { font-size: 18px; font-weight: 700; color: #0c2d67; }
        .company-info .company-details { font-size: 13px; color: #666; line-height: 1.6; margin-top: 4px; }
        .customer-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
        }
        .customer-info .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #888; margin-bottom: 4px; }
        .customer-info .value { font-size: 15px; font-weight: 500; color: #1a1a2e; }
        .event-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 30px;
          padding: 16px 20px;
          background: #f8f9fa;
          border-radius: 12px;
        }
        .event-details .item .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #888; margin-bottom: 2px; }
        .event-details .item .value { font-size: 14px; font-weight: 500; color: #1a1a2e; }
        .event-details .item.span-full { grid-column: span 3; }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0 25px;
        }
        .items-table th {
          background: #f8f9fa;
          text-align: left;
          padding: 12px 16px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #666;
          border-bottom: 2px solid #e9ecef;
        }
        .items-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f0f0f0;
          font-size: 14px;
        }
        .items-table .item-name { font-weight: 500; }
        .items-table .item-total { font-weight: 600; color: #0c2d67; }
        .summary {
          margin-top: 25px;
          padding-top: 20px;
          border-top: 2px solid #f0f0f0;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 14px;
        }
        .summary-row .label { color: #666; }
        .summary-row .value { font-weight: 500; color: #1a1a2e; }
        .summary-row.total {
          margin-top: 10px;
          padding-top: 12px;
          border-top: 2px solid #0c2d67;
          font-size: 18px;
        }
        .summary-row.total .label { font-weight: 700; color: #0c2d67; }
        .summary-row.total .value { font-weight: 700; color: #0c2d67; }
        .coupon-info {
          margin-top: 12px;
          padding: 10px 16px;
          background: #e8f5e9;
          border-radius: 8px;
          font-size: 13px;
          color: #2e7d32;
        }
        .payment-info {
          display: flex;
          justify-content: space-between;
          margin-top: 25px;
          padding: 16px 20px;
          background: #f8f9fa;
          border-radius: 12px;
          font-size: 13px;
        }
        .payment-info .label { color: #666; }
        .payment-info .value { font-weight: 600; }
        .payment-info .status-paid { color: #2e7d32; }
        .payment-info .status-pending { color: #f57c00; }
        .payment-info .status-failed { color: #c62828; }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
        .footer .thankyou {
          font-size: 16px;
          font-weight: 600;
          color: #0c2d67;
          margin-bottom: 4px;
        }
        @media print {
          body { background: white; padding: 0; }
          .invoice-container { box-shadow: none; border-radius: 0; }
          .invoice-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .items-table th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        @media (max-width: 600px) {
          .invoice-header { flex-direction: column; text-align: center; padding: 30px 20px; }
          .invoice-number { text-align: center; margin-top: 12px; }
          .invoice-body { padding: 20px; }
          .company-info { flex-direction: column; text-align: center; }
          .customer-info { flex-direction: column; gap: 12px; }
          .event-details { grid-template-columns: 1fr; }
          .items-table { font-size: 12px; }
          .payment-info { flex-direction: column; gap: 8px; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div>
            <h1>INVOICE</h1>
            <div class="subtitle">Event Management Services</div>
          </div>
          <div class="invoice-number">
            <div class="number">#${data.orderNumber}</div>
            <div class="date">${invoiceDate} • ${invoiceTime}</div>
          </div>
        </div>
        <div class="invoice-body">
          <div class="company-info">
            <div>
              <div class="company-name">IIIQBETS EVENTS</div>
              <div class="company-details">
                Hyderabad, Telangana, India<br>
                Email: info@iiqbets.com<br>
                Phone: +91 93468 43156
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12px; color: #666;">Invoice Date</div>
              <div style="font-size: 14px; font-weight: 500;">${invoiceDate}</div>
            </div>
          </div>

          <div class="customer-info">
            <div>
              <div class="label">Customer</div>
              <div class="value">${data.customerName || 'N/A'}</div>
              <div style="font-size: 13px; color: #666; margin-top: 2px;">${data.customerEmail || 'N/A'}</div>
              <div style="font-size: 13px; color: #666;">${data.customerPhone || 'N/A'}</div>
            </div>
            <div>
              <div class="label">Delivery Address</div>
              <div class="value">${data.address.fullName || 'N/A'}</div>
              <div style="font-size: 13px; color: #666; margin-top: 2px;">${data.address.line1 || ''}</div>
              ${data.address.line2 ? `<div style="font-size: 13px; color: #666;">${data.address.line2}</div>` : ''}
              <div style="font-size: 13px; color: #666;">${data.address.city || ''}, ${data.address.state || ''} - ${data.address.pincode || ''}</div>
              <div style="font-size: 13px; color: #666;">${data.address.country || 'India'}</div>
            </div>
          </div>

          <div class="event-details">
            <div class="item">
              <div class="label">Event Type</div>
              <div class="value">${data.eventType || 'N/A'}</div>
            </div>
            <div class="item">
              <div class="label">Event Date</div>
              <div class="value">${eventDateFormatted}</div>
            </div>
            <div class="item">
              <div class="label">Guest Count</div>
              <div class="value">${data.guestCount || 0}</div>
            </div>
            <div class="item span-full">
              <div class="label">Venue</div>
              <div class="value">${data.venue || 'N/A'}</div>
            </div>
            ${data.eventTime ? `
            <div class="item span-full">
              <div class="label">Event Time</div>
              <div class="value">${data.eventTime}</div>
            </div>
            ` : ''}
            ${data.specialInstructions ? `
            <div class="item span-full">
              <div class="label">Special Instructions</div>
              <div class="value">${data.specialInstructions}</div>
            </div>
            ` : ''}
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 50%;">Item</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 20%; text-align: right;">Price</th>
                <th style="width: 15%; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map(item => `
                <tr>
                  <td class="item-name">${item.name}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
                  <td style="text-align: right; font-weight: 600;">₹${item.total.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span class="label">Subtotal</span>
              <span class="value">₹${data.subtotal.toLocaleString('en-IN')}</span>
            </div>
            ${data.couponDiscount > 0 ? `
              <div class="summary-row">
                <span class="label">Discount (${data.couponCode || 'Coupon'})</span>
                <span class="value" style="color: #2e7d32;">-₹${data.couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            ` : ''}
            <div class="summary-row">
              <span class="label">Delivery Charge</span>
              <span class="value">${data.deliveryCharge === 0 ? 'FREE' : `₹${data.deliveryCharge.toLocaleString('en-IN')}`}</span>
            </div>
            <div class="summary-row">
              <span class="label">GST (18%)</span>
              <span class="value">₹${data.gst.toLocaleString('en-IN')}</span>
            </div>
            <div class="summary-row total">
              <span class="label">Grand Total</span>
              <span class="value">₹${data.grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div class="payment-info">
            <div>
              <span class="label">Payment Method: </span>
              <span class="value">${data.paymentMethod?.toUpperCase() || 'N/A'}</span>
            </div>
            <div>
              <span class="label">Payment Status: </span>
              <span class="value">${data.paymentStatus?.toUpperCase() || 'PENDING'}</span>
            </div>
          </div>

          <div class="footer">
            <div class="thankyou">Thank You for Your Order!</div>
            <div>This is a system-generated invoice. For any queries, please contact our support team.</div>
            <div style="margin-top: 8px; font-size: 11px; color: #bbb;">www.iiqbets.com</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ─── Download Invoice - Mobile (Using Server API) ───────────────────────────
export const downloadInvoiceMobile = async (orderData: InvoiceData): Promise<boolean> => {
  try {
    // Send request to server to generate PDF
    const response = await fetch(`${API_BASE_URL}/invoice/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderData }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate PDF: ${response.status} - ${errorText}`);
    }

    // Get the PDF as blob
    const blob = await response.blob();
    const fileName = `Invoice_${orderData.orderNumber}_${Date.now()}.pdf`;
    
    // Convert blob to base64 using FileReader
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:application/pdf;base64, prefix
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read blob as base64'));
      };
      reader.readAsDataURL(blob);
    });

    // Save to device using expo-file-system legacy API
    const fileUri = FileSystem.documentDirectory + fileName;
    
    // Write the base64 string to file
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Share the PDF
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Download Invoice PDF',
        UTI: 'com.adobe.pdf',
      });
      return true;
    } else {
      console.log('PDF saved at:', fileUri);
      return true;
    }
  } catch (error) {
    console.error('Error downloading invoice on mobile:', error);
    throw error;
  }
};

// ─── Download Invoice - Web (Using Server API) ──────────────────────────────
export const downloadInvoiceWeb = async (orderData: InvoiceData): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/invoice/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderData }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate PDF: ${response.status} - ${errorText}`);
    }

    const blob = await response.blob();
    const fileName = `Invoice_${orderData.orderNumber}_${Date.now()}.pdf`;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading invoice on web:', error);
    throw error;
  }
};

// ─── Universal Download Invoice ──────────────────────────────────────────────
export const downloadInvoice = async (orderData: InvoiceData): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      return await downloadInvoiceWeb(orderData);
    } else {
      return await downloadInvoiceMobile(orderData);
    }
  } catch (error) {
    console.error('Error downloading invoice:', error);
    throw error;
  }
};