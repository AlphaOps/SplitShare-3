/**
 * OTP Authentication API
 * Handles email OTP verification with MongoDB storage
 */

import { Router } from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { MongoClient, Db } from 'mongodb';

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
 * Send OTP via email (placeholder - integrate with nodemailer/SendGrid)
 */
async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    console.log(`[OTP] Sending OTP to ${email}: ${otp}`);
    
    // In production, use nodemailer or SendGrid:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: 'noreply@splitshare.com',
      to: email,
      subject: 'Verify Your Email - SplitShare',
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP code is: <strong>${otp}</strong></p>
        <p>This code will expire in 2 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });
    */

    return true;
  } catch (error) {
    console.error('Failed to send OTP:', error);
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

    // Store OTP
    otpStore.set(email, {
      email,
      otp,
      expiresAt,
      attempts: 0
    });

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

    // Get stored OTP
    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
    }

    // Check if expired
    if (new Date() > record.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Check attempts
    if (record.attempts >= 3) {
      otpStore.delete(email);
      return res.status(400).json({ error: 'Too many failed attempts. Please request a new OTP.' });
    }

    // Verify OTP
    if (record.otp !== otp) {
      record.attempts++;
      return res.status(400).json({ 
        error: 'Invalid OTP. Please try again.',
        attemptsLeft: 3 - record.attempts
      });
    }

    // OTP verified successfully
    otpStore.delete(email);

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

    // Store new OTP
    otpStore.set(email, {
      email,
      otp,
      expiresAt,
      attempts: 0
    });

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
 * Cleanup expired OTPs (run as cron job)
 */
export function cleanupExpiredOTPs() {
  const now = new Date();
  let cleanedCount = 0;

  for (const [email, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(email);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`[OTP] Cleaned up ${cleanedCount} expired OTPs`);
  }
}

// Run cleanup every minute
setInterval(cleanupExpiredOTPs, 60 * 1000);

export default router;
