/**
 * OTP Authentication API
 * Handles email OTP verification with MongoDB storage and SendGrid
 */

import { Router } from 'express';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import { MongoClient, Db } from 'mongodb';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const router = Router();

// MongoDB connection
let db: Db;
const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/splitshare');
    await client.connect();
    db = client.db('splitshare');
    console.log('[OTP] Connected to MongoDB');
  } catch (error) {
    console.error('[OTP] MongoDB connection error:', error);
  }
};

connectDB();

// OTP Collection Schema
interface OTPRecord {
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

/**
 * Generate 6-digit OTP
 */
function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Send OTP via email using SendGrid
 */
async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    console.log(`[OTP] Sending OTP to ${email}: ${otp}`);
    
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@splitshare.com',
      subject: 'Verify Your Email - SplitShare',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Email Verification</h1>
            </div>
            <div class="content">
              <p>Hello!</p>
              <p>Thank you for signing up with SplitShare. To complete your registration, please use the following One-Time Password (OTP):</p>
              <div class="otp-box">${otp}</div>
              <p><strong>⏰ This code will expire in 2 minutes.</strong></p>
              <p>If you didn't request this verification, please ignore this email.</p>
              <p>Best regards,<br>The SplitShare Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await sgMail.send(msg);
    console.log(`[OTP] Email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('[OTP] Failed to send email:', error);
    return false;
  }
}

/**
 * POST /api/auth/send-otp
 * Send OTP to user's email during registration
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Store OTP in MongoDB
    const otps = db.collection('otps');
    await otps.updateOne(
      { email },
      {
        $set: {
          email,
          otp,
          expiresAt,
          attempts: 0,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    // Send OTP via email
    const sent = await sendOTPEmail(email, otp);

    if (!sent) {
      return res.status(500).json({ error: 'Failed to send OTP' });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: 120 // seconds
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP entered by user
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Get stored OTP from MongoDB
    const otps = db.collection('otps');
    const record = await otps.findOne({ email });

    if (!record) {
      return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
    }

    // Check if expired
    if (new Date() > record.expiresAt) {
      await otps.deleteOne({ email });
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Check attempts
    if (record.attempts >= 3) {
      await otps.deleteOne({ email });
      return res.status(400).json({ error: 'Too many failed attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (record.otp !== otp) {
      await otps.updateOne({ email }, { $inc: { attempts: 1 } });
      return res.status(400).json({ 
        error: 'Invalid OTP. Please try again.',
        attemptsLeft: 3 - (record.attempts + 1)
      });
    }

    // OTP verified successfully
    await otps.deleteOne({ email });

    // In production: Update user's emailVerified status in database
    // await db.users.update({ email }, { emailVerified: true });

    // Generate JWT token
    const token = 'jwt_token_here'; // Use actual JWT generation

    res.json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        email,
        emailVerified: true
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

/**
 * POST /api/auth/resend-otp
 * Resend OTP to user's email
 */
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Store new OTP in MongoDB
    const otps = db.collection('otps');
    await otps.updateOne(
      { email },
      {
        $set: {
          email,
          otp,
          expiresAt,
          attempts: 0,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    // Send OTP via email
    const sent = await sendOTPEmail(email, otp);

    if (!sent) {
      return res.status(500).json({ error: 'Failed to resend OTP' });
    }

    res.json({
      success: true,
      message: 'OTP resent successfully',
      expiresIn: 120 // seconds
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
});

/**
 * Cleanup expired OTPs (run periodically)
 */
async function cleanupExpiredOTPs() {
  try {
    const now = new Date();
    const otps = db.collection('otps');
    const result = await otps.deleteMany({ expiresAt: { $lt: now } });
    
    if (result.deletedCount > 0) {
      console.log(`[OTP] Cleaned up ${result.deletedCount} expired OTPs`);
    }
  } catch (error) {
    console.error('[OTP] Cleanup error:', error);
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);

export default router;
