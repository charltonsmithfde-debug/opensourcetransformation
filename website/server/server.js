const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static website files directly if accessing via this server
app.use(express.static(path.join(__dirname, '..')));

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Server Ready to send inquiries to:', process.env.NOTIFICATION_RECIPIENT);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'charlton-smith-inquiry-engine', timestamp: new Date().toISOString() });
});

// Audit Inquiry Submission Endpoint
app.post('/api/audit-inquiry', async (req, res) => {
  try {
    const { name, email, company, issue } = req.body;

    // Validate required fields
    if (!name || !email || !issue) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and the operational problem you need help with.'
      });
    }

    const recipient = process.env.NOTIFICATION_RECIPIENT || 'charltonsmithfde@gmail.com';
    const timestamp = new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' });

    // 1. Email to Charlton Smith (New Lead Notification)
    const adminMailOptions = {
      from: process.env.SMTP_FROM || `"Website Inquiry" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: email,
      subject: `🚨 New 48-Hour Stack Audit Request: ${name} (${company || 'Mid-Market Co.'})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #071A36; color: #FFFFFF; border-radius: 12px; padding: 32px; border: 1px solid #00A3E0;">
          <div style="border-bottom: 1px solid rgba(0, 163, 224, 0.3); padding-bottom: 16px; margin-bottom: 24px;">
            <span style="background: #0075C9; color: #fff; font-size: 11px; font-weight: 800; letter-spacing: 1px; padding: 4px 10px; border-radius: 12px; text-transform: uppercase;">New Audit Request</span>
            <h2 style="margin: 12px 0 4px 0; font-size: 24px; color: #FFFFFF;">48-Hour Stack & Efficiency Audit</h2>
            <p style="margin: 0; color: #94A3B8; font-size: 13px;">Received via charltonearlsmith.co.za on ${timestamp}</p>
          </div>

          <div style="margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #00A3E0; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Prospect Details</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #94A3B8; width: 140px;">Contact Name:</td>
                <td style="padding: 6px 0; color: #FFFFFF; font-weight: 700;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94A3B8;">Work Email:</td>
                <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #00A3E0; text-decoration: none; font-weight: 600;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94A3B8;">Company & Size:</td>
                <td style="padding: 6px 0; color: #FFFFFF; font-weight: 600;">${company || 'Not specified'}</td>
              </tr>
            </table>
          </div>

          <div style="background: rgba(1, 10, 23, 0.8); border: 1px solid rgba(0, 163, 224, 0.2); border-radius: 8px; padding: 20px; margin-bottom: 28px;">
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #00A3E0; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Operational Problem / Urgent Friction:</p>
            <p style="margin: 0; font-size: 15px; color: #F1F5F9; line-height: 1.6; white-space: pre-wrap;">${issue}</p>
          </div>

          <div style="text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px;">
            <a href="mailto:${email}?subject=Your%2048-Hour%20Stack%20Audit%20%E2%80%94%20Charlton%20Smith" style="background: #0075C9; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: 700; border-radius: 6px; font-size: 14px; display: inline-block;">
              Reply Directly to ${name} &rarr;
            </a>
          </div>
        </div>
      `
    };

    // 2. Confirmation Email to the Prospect
    const userConfirmationOptions = {
      from: `"Charlton Smith" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Received: Your 48-Hour Stack & Efficiency Audit Request`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #071A36; color: #FFFFFF; border-radius: 12px; padding: 32px; border: 1px solid #00A3E0;">
          <h2 style="margin: 0 0 16px 0; color: #FFFFFF; font-size: 22px;">Thank you for requesting an audit, ${name}.</h2>
          <p style="font-size: 15px; color: #CBD5E1; line-height: 1.6; margin-bottom: 18px;">
            I have received your request regarding <strong>${company || 'your business'}</strong> and the operational challenge you shared:
          </p>
          <div style="background: rgba(1, 10, 23, 0.8); border-left: 3px solid #00A3E0; padding: 14px 16px; margin-bottom: 20px; font-style: italic; color: #94A3B8;">
            "${issue}"
          </div>
          <p style="font-size: 15px; color: #CBD5E1; line-height: 1.6; margin-bottom: 24px;">
            I will personally review your software setup and follow up with you within 24 hours to schedule a 25-minute strategy call and share our initial findings.
          </p>
          <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 18px; font-size: 13px; color: #94A3B8;">
            <p style="margin: 0 0 4px 0; color: #FFFFFF; font-weight: 700;">Charlton Smith</p>
            <p style="margin: 0;">Enterprise Open Source Transformation Partner &bull; <a href="https://charltonearlsmith.co.za" style="color: #00A3E0; text-decoration: none;">charltonearlsmith.co.za</a></p>
          </div>
        </div>
      `
    };

    // Send admin notification
    await transporter.sendMail(adminMailOptions);
    console.log(`✅ Audit notification dispatched to ${recipient} for prospect ${name} (${email})`);

    // Attempt sending prospect confirmation (fail-safe)
    try {
      await transporter.sendMail(userConfirmationOptions);
      console.log(`✅ Confirmation receipt sent to prospect at ${email}`);
    } catch (confirmErr) {
      console.warn('⚠️ Could not send confirmation receipt to prospect:', confirmErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your audit request has been sent to Charlton Smith. We will reach out within 24 hours.'
    });

  } catch (error) {
    console.error('❌ Failed to process audit inquiry:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while sending your request. Please try again or email charltonsmithfde@gmail.com directly.'
    });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Charlton Smith API & Funnel Server running at http://localhost:${PORT}`);
});
