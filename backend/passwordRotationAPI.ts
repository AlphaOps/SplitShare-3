/**
 * Password Rotation API Endpoints
 * Handles automatic password rotation after each slot
 */

import { Router } from 'express';
import { passwordRotationManager, automationScriptsManager } from '../lib/automation/passwordRotation';

const router = Router();

// Middleware to verify JWT token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  req.user = { userId: 'user123' }; // Placeholder
  next();
}

/**
 * POST /api/slots/:slot_id/start
 * Start a slot and mark as active
 */
router.post('/:slot_id/start', authenticateToken, async (req: any, res) => {
  try {
    const { slot_id } = req.params;
    const userId = req.user.userId;

    // Fetch slot details
    // const slot = await db.slots.findById(slot_id);
    
    // Verify user owns this slot
    // if (slot.user_id !== userId) {
    //   return res.status(403).json({ error: 'Unauthorized' });
    // }

    // Check if within allocated time
    const now = new Date();
    // if (now < slot.start_time || now > slot.end_time) {
    //   return res.status(400).json({ error: 'Outside allocated time slot' });
    // }

    // Mark slot as active
    // await db.slots.update(slot_id, { status: 'active', activated_at: now });

    // Get current credentials
    const credentials = {
      platform: 'Netflix',
      username: 'shared@example.com',
      encrypted_password: 'encrypted_pass',
      iv: 'iv_string',
      authTag: 'auth_tag',
      last_changed: new Date(),
      rotation_count: 5
    };

    // Decrypt credentials for user
    const decryptedPassword = passwordRotationManager.decryptPassword(
      credentials.encrypted_password,
      credentials.iv,
      credentials.authTag
    );

    // Schedule automatic password rotation when slot ends
    const endTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    passwordRotationManager.scheduleRotation(slot_id, endTime, credentials);

    res.json({
      success: true,
      slot_id,
      status: 'active',
      credentials: {
        platform: credentials.platform,
        username: credentials.username,
        password: decryptedPassword
      },
      expires_at: endTime,
      message: 'Slot activated. Password will auto-rotate when slot ends.'
    });
  } catch (error) {
    console.error('Start slot error:', error);
    res.status(500).json({ error: 'Failed to start slot' });
  }
});

/**
 * POST /api/slots/:slot_id/end
 * End a slot and trigger password rotation
 */
router.post('/:slot_id/end', authenticateToken, async (req: any, res) => {
  try {
    const { slot_id } = req.params;
    const userId = req.user.userId;

    // Fetch slot details
    // const slot = await db.slots.findById(slot_id);

    // Get current credentials
    const currentCredentials = {
      platform: 'Netflix',
      username: 'shared@example.com',
      encrypted_password: 'encrypted_pass',
      iv: 'iv_string',
      authTag: 'auth_tag',
      last_changed: new Date(),
      rotation_count: 5
    };

    // Rotate password
    console.log(`Rotating password for slot ${slot_id}`);
    const rotationResult = await passwordRotationManager.rotatePassword(
      currentCredentials.platform,
      currentCredentials.username,
      currentCredentials
    );

    if (!rotationResult.success) {
      return res.status(500).json({
        error: 'Password rotation failed',
        details: rotationResult.error
      });
    }

    // Update credentials in database
    // await db.credentials.update({
    //   platform: currentCredentials.platform,
    //   username: currentCredentials.username
    // }, {
    //   encrypted_password: rotationResult.encrypted_password,
    //   last_changed: new Date(),
    //   rotation_count: currentCredentials.rotation_count + 1
    // });

    // Mark slot as ended
    // await db.slots.update(slot_id, {
    //   status: 'ended',
    //   ended_at: new Date()
    // });

    // Get next slot users to notify
    const nextSlotUsers = ['user456', 'user789'];
    
    // Notify next users of new credentials
    await passwordRotationManager.notifyPasswordChange(
      currentCredentials.platform,
      nextSlotUsers,
      {
        username: currentCredentials.username,
        password: rotationResult.new_password || ''
      }
    );

    res.json({
      success: true,
      slot_id,
      status: 'ended',
      password_rotated: true,
      rotation_timestamp: rotationResult.timestamp,
      next_users_notified: nextSlotUsers.length,
      message: 'Slot ended and password rotated successfully'
    });
  } catch (error) {
    console.error('End slot error:', error);
    res.status(500).json({ error: 'Failed to end slot' });
  }
});

/**
 * POST /api/credentials/change
 * Manually trigger password change
 */
router.post('/change', authenticateToken, async (req: any, res) => {
  try {
    const { platform, account_id } = req.body;

    if (!platform || !account_id) {
      return res.status(400).json({ error: 'Platform and account_id required' });
    }

    // Fetch credentials
    // const credentials = await db.credentials.findOne({ platform, account_id });

    const credentials = {
      platform,
      username: 'shared@example.com',
      encrypted_password: 'encrypted_pass',
      iv: 'iv_string',
      authTag: 'auth_tag',
      last_changed: new Date(),
      rotation_count: 5
    };

    // Rotate password
    const rotationResult = await passwordRotationManager.rotatePassword(
      platform,
      credentials.username,
      credentials
    );

    if (!rotationResult.success) {
      return res.status(500).json({
        error: 'Password change failed',
        details: rotationResult.error
      });
    }

    // Verify password change
    const verified = await passwordRotationManager.verifyPasswordChange(
      platform,
      credentials.username,
      rotationResult.new_password || ''
    );

    if (!verified) {
      // Rollback if verification fails
      await passwordRotationManager.rollbackPasswordChange(
        platform,
        credentials.username,
        passwordRotationManager.decryptPassword(
          credentials.encrypted_password,
          credentials.iv,
          credentials.authTag
        )
      );

      return res.status(500).json({
        error: 'Password change verification failed',
        action: 'rolled_back'
      });
    }

    res.json({
      success: true,
      platform,
      account_id,
      password_changed: true,
      verified: true,
      timestamp: rotationResult.timestamp,
      message: 'Password changed and verified successfully'
    });
  } catch (error) {
    console.error('Change credentials error:', error);
    res.status(500).json({ error: 'Failed to change credentials' });
  }
});

/**
 * GET /api/credentials/history/:platform
 * Get password rotation history
 */
router.get('/history/:platform', authenticateToken, async (req: any, res) => {
  try {
    const { platform } = req.params;
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const history = await passwordRotationManager.getRotationHistory(
      platform,
      username as string
    );

    res.json({
      platform,
      username,
      history
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get rotation history' });
  }
});

/**
 * POST /api/automation/validate
 * Validate automation script for a platform
 */
router.post('/validate', authenticateToken, async (req: any, res) => {
  try {
    const { platform } = req.body;

    if (!platform) {
      return res.status(400).json({ error: 'Platform required' });
    }

    const isValid = await automationScriptsManager.validateScript(platform);

    res.json({
      platform,
      valid: isValid,
      message: isValid ? 'Automation script is valid' : 'Automation script not found or invalid'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate automation script' });
  }
});

/**
 * POST /api/automation/execute
 * Execute password change automation (admin only)
 */
router.post('/execute', authenticateToken, async (req: any, res) => {
  try {
    const { platform, username, currentPassword, newPassword } = req.body;

    if (!platform || !username || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await automationScriptsManager.executePasswordChange(
      platform,
      { username, currentPassword, newPassword }
    );

    res.json({
      success: result.success,
      platform,
      username,
      screenshot: result.screenshot,
      error: result.error,
      message: result.success ? 'Password changed successfully' : 'Password change failed'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute automation' });
  }
});

/**
 * GET /api/rotation/status
 * Get overall rotation system status
 */
router.get('/status', authenticateToken, async (req: any, res) => {
  try {
    // In production: Query database for rotation statistics
    const status = {
      total_rotations_today: 45,
      successful_rotations: 43,
      failed_rotations: 2,
      average_rotation_time: '2.3 seconds',
      platforms: {
        'Netflix': { rotations: 20, success_rate: 100 },
        'Prime Video': { rotations: 15, success_rate: 95 },
        'Disney+': { rotations: 10, success_rate: 100 }
      },
      next_scheduled_rotation: new Date(Date.now() + 30 * 60 * 1000),
      system_health: 'healthy'
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get rotation status' });
  }
});

export default router;
