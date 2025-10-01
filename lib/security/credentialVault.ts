/**
 * Secure Credential Vault
 * Manages OTT credentials with encryption - users never see actual passwords
 */

import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.CREDENTIAL_ENCRYPTION_KEY || 'default-key-change-in-production';
const ALGORITHM = 'aes-256-gcm';

export interface SecureCredential {
  id: string;
  platform: string;
  email: string;
  encryptedPassword: string;
  iv: string; // Initialization vector
  authTag: string; // Authentication tag for GCM
  createdAt: Date;
  lastRotated: Date;
  rotationSchedule: number; // Days between rotations
}

export interface TemporaryAccess {
  userId: string;
  credentialId: string;
  sessionToken: string;
  expiresAt: Date;
  ipAddress: string;
  deviceId: string;
}

/**
 * Credential Vault Manager
 */
export class CredentialVault {
  /**
   * Encrypt password using AES-256-GCM
   */
  encryptPassword(password: string): {
    encryptedPassword: string;
    iv: string;
    authTag: string;
  } {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encryptedPassword: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  /**
   * Decrypt password (only for backend use, never exposed to frontend)
   */
  decryptPassword(
    encryptedPassword: string,
    iv: string,
    authTag: string
  ): string {
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Store credential securely
   */
  async storeCredential(
    platform: string,
    email: string,
    password: string
  ): Promise<SecureCredential> {
    const { encryptedPassword, iv, authTag } = this.encryptPassword(password);

    const credential: SecureCredential = {
      id: this.generateId(),
      platform,
      email,
      encryptedPassword,
      iv,
      authTag,
      createdAt: new Date(),
      lastRotated: new Date(),
      rotationSchedule: 90 // Rotate every 90 days
    };

    // In production, save to database
    // await db.credentials.insert(credential);

    return credential;
  }

  /**
   * Generate temporary access token
   * Users get a session token, not the actual password
   */
  generateTemporaryAccess(
    userId: string,
    credentialId: string,
    ipAddress: string,
    deviceId: string,
    durationMinutes: number = 120
  ): TemporaryAccess {
    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    const access: TemporaryAccess = {
      userId,
      credentialId,
      sessionToken,
      expiresAt,
      ipAddress,
      deviceId
    };

    // Store in Redis or database with TTL
    // await redis.setex(`access:${sessionToken}`, durationMinutes * 60, JSON.stringify(access));

    return access;
  }

  /**
   * Verify temporary access token
   */
  async verifyAccess(sessionToken: string): Promise<TemporaryAccess | null> {
    // In production, fetch from Redis/database
    // const access = await redis.get(`access:${sessionToken}`);
    // if (!access) return null;
    
    // const parsed = JSON.parse(access);
    // if (new Date() > new Date(parsed.expiresAt)) {
    //   await redis.del(`access:${sessionToken}`);
    //   return null;
    // }

    // return parsed;
    return null; // Placeholder
  }

  /**
   * Revoke access token
   */
  async revokeAccess(sessionToken: string): Promise<void> {
    // await redis.del(`access:${sessionToken}`);
    console.log(`Access revoked: ${sessionToken}`);
  }

  /**
   * Get credential for authorized access
   * This method is ONLY called by backend when user has valid session token
   */
  async getCredentialForAccess(
    sessionToken: string
  ): Promise<{ email: string; password: string } | null> {
    const access = await this.verifyAccess(sessionToken);
    if (!access) return null;

    // Fetch encrypted credential
    // const credential = await db.credentials.findById(access.credentialId);
    // if (!credential) return null;

    // Decrypt password (ONLY on backend, never sent to frontend)
    // const password = this.decryptPassword(
    //   credential.encryptedPassword,
    //   credential.iv,
    //   credential.authTag
    // );

    // return {
    //   email: credential.email,
    //   password
    // };

    return null; // Placeholder
  }

  /**
   * Rotate credentials (security best practice)
   */
  async rotateCredential(credentialId: string, newPassword: string): Promise<void> {
    const { encryptedPassword, iv, authTag } = this.encryptPassword(newPassword);

    // Update in database
    // await db.credentials.update(credentialId, {
    //   encryptedPassword,
    //   iv,
    //   authTag,
    //   lastRotated: new Date()
    // });

    // Notify all users of the slot
    // await this.notifyUsersOfRotation(credentialId);

    console.log(`Credential ${credentialId} rotated successfully`);
  }

  /**
   * Check if credential needs rotation
   */
  needsRotation(credential: SecureCredential): boolean {
    const daysSinceRotation = 
      (Date.now() - credential.lastRotated.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSinceRotation >= credential.rotationSchedule;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `cred_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  /**
   * Generate secure session token
   */
  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash credential ID for logging (never log actual credentials)
   */
  hashForLogging(credentialId: string): string {
    return crypto.createHash('sha256').update(credentialId).digest('hex').substring(0, 16);
  }

  /**
   * Audit log for credential access
   */
  async logAccess(
    userId: string,
    credentialId: string,
    action: 'granted' | 'denied' | 'revoked',
    ipAddress: string
  ): Promise<void> {
    const log = {
      timestamp: new Date(),
      userId,
      credentialId: this.hashForLogging(credentialId),
      action,
      ipAddress
    };

    // Store in audit log
    // await db.auditLogs.insert(log);
    console.log('Credential Access Log:', log);
  }
}

/**
 * Proxy Authentication System
 * Users authenticate through our proxy, never directly with OTT platform
 */
export class ProxyAuthenticator {
  private vault: CredentialVault;

  constructor() {
    this.vault = new CredentialVault();
  }

  /**
   * Request access to OTT platform
   * Returns a proxy session, not actual credentials
   */
  async requestAccess(
    userId: string,
    slotId: string,
    deviceInfo: any
  ): Promise<{
    success: boolean;
    proxySession?: string;
    expiresAt?: Date;
    error?: string;
  }> {
    try {
      // Verify user has allocated time slot
      const hasSlot = await this.verifyUserSlot(userId, slotId);
      if (!hasSlot) {
        return { success: false, error: 'No active slot allocation' };
      }

      // Check if within allocated time
      const isWithinTime = await this.checkTimeSlot(userId, slotId);
      if (!isWithinTime) {
        return { success: false, error: 'Outside allocated time slot' };
      }

      // Generate temporary access
      const access = this.vault.generateTemporaryAccess(
        userId,
        slotId,
        deviceInfo.ipAddress,
        deviceInfo.deviceId,
        120 // 2 hours
      );

      // Log access
      await this.vault.logAccess(userId, slotId, 'granted', deviceInfo.ipAddress);

      return {
        success: true,
        proxySession: access.sessionToken,
        expiresAt: access.expiresAt
      };
    } catch (error) {
      console.error('Access request failed:', error);
      return { success: false, error: 'Access request failed' };
    }
  }

  /**
   * Verify user has allocated slot
   */
  private async verifyUserSlot(userId: string, slotId: string): Promise<boolean> {
    // Check database for user's slot allocation
    // const allocation = await db.allocations.findOne({ userId, slotId, status: 'active' });
    // return !!allocation;
    return true; // Placeholder
  }

  /**
   * Check if current time is within user's allocated slot
   */
  private async checkTimeSlot(userId: string, slotId: string): Promise<boolean> {
    // Fetch user's time allocation
    // const allocation = await db.allocations.findOne({ userId, slotId });
    // const now = new Date();
    // const currentHour = now.getHours();
    // const currentDay = now.getDay();
    
    // return currentDay === allocation.dayOfWeek &&
    //        currentHour >= allocation.startHour &&
    //        currentHour <= allocation.endHour;
    return true; // Placeholder
  }

  /**
   * Revoke access (when time slot ends or user logs out)
   */
  async revokeAccess(proxySession: string): Promise<void> {
    await this.vault.revokeAccess(proxySession);
  }

  /**
   * Auto-revoke expired sessions (run as cron job)
   */
  async cleanupExpiredSessions(): Promise<void> {
    // In production, query all sessions and remove expired ones
    // const expired = await redis.keys('access:*');
    // for (const key of expired) {
    //   const session = await redis.get(key);
    //   if (session) {
    //     const parsed = JSON.parse(session);
    //     if (new Date() > new Date(parsed.expiresAt)) {
    //       await redis.del(key);
    //     }
    //   }
    // }
    console.log('Expired sessions cleaned up');
  }
}

// Export singleton instances
export const credentialVault = new CredentialVault();
export const proxyAuthenticator = new ProxyAuthenticator();
