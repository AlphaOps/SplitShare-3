/**
 * Two-Factor Authentication System
 * Implements SMS, Email, and Authenticator-based 2FA
 */

import crypto from 'crypto';

export interface TwoFactorAuth {
  userId: string;
  method: 'sms' | 'email' | 'authenticator';
  secret?: string; // For authenticator apps
  code: string;
  expiresAt: Date;
  verified: boolean;
  backupCodes?: string[];
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Generate backup codes for account recovery
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
  }
  return codes;
}

/**
 * Verify OTP code
 */
export function verifyOTP(inputCode: string, storedCode: string, expiresAt: Date): boolean {
  // Check if code has expired (5 minutes validity)
  if (new Date() > expiresAt) {
    return false;
  }
  
  // Compare codes
  return inputCode === storedCode;
}

/**
 * Generate secret for authenticator apps (Google Authenticator, Authy, etc.)
 */
export function generateAuthenticatorSecret(): string {
  return crypto.randomBytes(20).toString('base64');
}

/**
 * Verify authenticator code using TOTP algorithm
 * This is a simplified version - in production, use 'speakeasy' library
 */
export function verifyAuthenticatorCode(code: string, secret: string): boolean {
  // In production, use speakeasy.totp.verify()
  // This is a placeholder implementation
  const timestamp = Math.floor(Date.now() / 1000 / 30);
  const expectedCode = generateTOTP(secret, timestamp);
  return code === expectedCode;
}

/**
 * Generate Time-based One-Time Password (TOTP)
 * Simplified version - use 'speakeasy' in production
 */
function generateTOTP(secret: string, timestamp: number): string {
  const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base64'));
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32BE(timestamp, 4);
  hmac.update(buffer);
  
  const hash = hmac.digest();
  const offset = hash[hash.length - 1] & 0xf;
  const code = (hash.readUInt32BE(offset) & 0x7fffffff) % 1000000;
  
  return code.toString().padStart(6, '0');
}

/**
 * Send OTP via SMS (integration with Twilio)
 */
export async function sendSMSOTP(phoneNumber: string, code: string): Promise<boolean> {
  try {
    // In production, integrate with Twilio:
    // const client = require('twilio')(accountSid, authToken);
    // await client.messages.create({
    //   body: `Your SplitShare verification code is: ${code}`,
    //   from: twilioPhoneNumber,
    //   to: phoneNumber
    // });
    
    console.log(`SMS OTP sent to ${phoneNumber}: ${code}`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS OTP:', error);
    return false;
  }
}

/**
 * Send OTP via Email
 */
export async function sendEmailOTP(email: string, code: string): Promise<boolean> {
  try {
    // In production, integrate with SendGrid or similar:
    // const msg = {
    //   to: email,
    //   from: 'noreply@splitshare.com',
    //   subject: 'Your SplitShare Verification Code',
    //   text: `Your verification code is: ${code}`,
    //   html: `<p>Your verification code is: <strong>${code}</strong></p>`
    // };
    // await sgMail.send(msg);
    
    console.log(`Email OTP sent to ${email}: ${code}`);
    return true;
  } catch (error) {
    console.error('Failed to send email OTP:', error);
    return false;
  }
}

/**
 * Hash backup code for secure storage
 */
export function hashBackupCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

/**
 * Verify backup code
 */
export function verifyBackupCode(inputCode: string, hashedCodes: string[]): boolean {
  const hashedInput = hashBackupCode(inputCode);
  return hashedCodes.includes(hashedInput);
}

/**
 * Rate limiting for 2FA attempts
 */
export class TwoFactorRateLimiter {
  private attempts: Map<string, { count: number; resetAt: Date }> = new Map();
  private maxAttempts: number = 5;
  private windowMinutes: number = 15;

  checkAttempt(userId: string): { allowed: boolean; remaining: number } {
    const now = new Date();
    const record = this.attempts.get(userId);

    if (!record || now > record.resetAt) {
      // Reset or create new record
      this.attempts.set(userId, {
        count: 1,
        resetAt: new Date(now.getTime() + this.windowMinutes * 60 * 1000)
      });
      return { allowed: true, remaining: this.maxAttempts - 1 };
    }

    if (record.count >= this.maxAttempts) {
      return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: this.maxAttempts - record.count };
  }

  reset(userId: string): void {
    this.attempts.delete(userId);
  }
}

export const twoFactorRateLimiter = new TwoFactorRateLimiter();
