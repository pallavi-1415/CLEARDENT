const nodemailer = require('nodemailer');

// Helper to configure SMTP transport
const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port) || 465,
    secure: parseInt(port) === 465, // true for 465, false for other ports (like 587)
    auth: {
      user,
      pass
    }
  });
};

// Main function to send notification email
const sendContactNotification = async (contact) => {
  const transporter = createTransporter();
  const toEmail = process.env.EMAIL_TO || process.env.EMAIL_USER;

  if (!transporter) {
    console.warn('⚠️ SMTP settings not configured in .env. Falling back to log print:');
    console.log(`-----------------------------------------`);
    console.log(`[SIMULATED EMAIL NOTIFICATION]`);
    console.log(`To: ${toEmail}`);
    console.log(`From: ${contact.email}`);
    console.log(`Subject: New Clinic Request - ${contact.service}`);
    console.log(`Name: ${contact.firstName} ${contact.lastName}`);
    console.log(`Phone: ${contact.phone || 'N/A'}`);
    console.log(`Message: ${contact.message}`);
    console.log(`-----------------------------------------`);
    return { success: true, simulated: true };
  }

  // Render modern HTML email template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Dental Inquiry</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
          border: 1px solid #e2e8f0;
        }
        .header {
          background-color: #1e3a8a;
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        .logo-text {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .logo-text span {
          font-weight: 300;
          opacity: 0.8;
        }
        .tagline {
          font-size: 13px;
          color: #93c5fd;
          margin-top: 5px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        .content {
          padding: 40px 30px;
        }
        .badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 5px 12px;
          border-radius: 999px;
          background-color: #eff6ff;
          color: #1e53e0;
          margin-bottom: 25px;
        }
        .badge.emergency {
          background-color: #fef2f2;
          color: #dc2626;
        }
        .title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 25px 0;
          letter-spacing: -0.3px;
        }
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .details-table td {
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .label {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          width: 130px;
        }
        .value {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }
        .message-box {
          background-color: #f8fafc;
          border-radius: 14px;
          padding: 20px;
          border-left: 4px solid #1653e0;
          margin-top: 10px;
        }
        .message-box.emergency {
          border-left-color: #dc2626;
        }
        .message-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .message-text {
          font-size: 14px;
          line-height: 1.6;
          color: #334155;
          margin: 0;
        }
        .footer {
          background-color: #f8fafc;
          padding: 24px 30px;
          text-align: center;
          border-top: 1px solid #f1f5f9;
        }
        .footer-text {
          font-size: 12px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-text">Clear<span>Dent</span></div>
          <div class="tagline">CONCIERGE CARE CENTER</div>
        </div>
        <div class="content">
          <div class="badge ${contact.service.includes('🚨') ? 'emergency' : ''}">
            ${contact.service.replace('🚨 ', '')}
          </div>
          <div class="title">New Inquiry Received</div>
          
          <table class="details-table">
            <tr>
              <td class="label">Patient Name</td>
              <td class="value">${contact.firstName} ${contact.lastName}</td>
            </tr>
            <tr>
              <td class="label">Email Address</td>
              <td class="value"><a href="mailto:${contact.email}" style="color: #1653e0; text-decoration: none;">${contact.email}</a></td>
            </tr>
            <tr>
              <td class="label">Phone Number</td>
              <td class="value">${contact.phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td class="label">Service Category</td>
              <td class="value">${contact.service}</td>
            </tr>
          </table>

          <div class="message-title">Patient Note</div>
          <div class="message-box ${contact.service.includes('🚨') ? 'emergency' : ''}">
            <p class="message-text">${contact.message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        <div class="footer">
          <p class="footer-text">
            This is an automated request notification sent from the ClearDent website.<br>
            Please reply directly to this email or follow up with the patient details provided.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"ClearDent Concierge" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${contact.service.includes('🚨') ? '🚨 EMERGENCY REQUEST: ' : 'New Inquiry: '}${contact.firstName} ${contact.lastName} - ${contact.service.replace('🚨 ', '')}`,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email notification dispatched successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('❌ Failed to dispatch email notification:', err);
    throw err;
  }
};

module.exports = {
  sendContactNotification
};
