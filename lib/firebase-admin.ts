/**
 * Firebase Admin SDK Initialization
 *
 * Initializes Firebase Admin for server-side operations with proper error handling.
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import type { AdminUser } from '@/types/admin';

// Re-export AdminUser type from separate types file (to avoid bundling in Edge Runtime)
export type { AdminUser } from '@/types/admin';

let app: App | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

/**
 * Initialize Firebase Admin SDK
 */
export function initializeFirebaseAdmin(): App {
  try {
    // Check if already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
      return app;
    }

    // Get Firebase Admin credentials from environment
    const firebaseAdminKey = process.env.FIREBASE_ADMIN_KEY;

    if (!firebaseAdminKey) {
      throw new Error(
        'FIREBASE_ADMIN_KEY environment variable is not set. ' +
        'Please add your Firebase service account JSON to .env.local'
      );
    }

    let serviceAccount: any;

    try {
      serviceAccount = JSON.parse(firebaseAdminKey);
    } catch (parseError) {
      throw new Error(
        'Failed to parse FIREBASE_ADMIN_KEY. Ensure it is valid JSON. ' +
        `Error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
      );
    }

    // Validate required fields
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error(
        'Invalid Firebase service account JSON. Missing required fields: ' +
        'project_id, private_key, or client_email'
      );
    }

    // Initialize app
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id
    });

    console.log('✅ Firebase Admin initialized successfully');

    return app;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

/**
 * Get Firestore database instance
 */
export function getFirestoreDb(): Firestore {
  try {
    if (!db) {
      if (!app) {
        initializeFirebaseAdmin();
      }
      db = getFirestore();
    }
    return db;
  } catch (error) {
    console.error('❌ Failed to get Firestore instance:', error);
    throw new Error(
      `Failed to initialize Firestore: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth(): Auth {
  try {
    if (!auth) {
      if (!app) {
        initializeFirebaseAdmin();
      }
      auth = getAuth();
    }
    return auth;
  } catch (error) {
    console.error('❌ Failed to get Firebase Auth instance:', error);
    throw new Error(
      `Failed to initialize Firebase Auth: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Verify Firebase is configured
 */
export function isFirebaseConfigured(): boolean {
  return !!process.env.FIREBASE_ADMIN_KEY;
}

// AdminUser type is now imported from @/types/admin and re-exported above

/**
 * Get admin user from Firestore
 */
export async function getAdminUser(email: string): Promise<AdminUser | null> {
  try {
    const db = getFirestoreDb();
    const adminDoc = await db.collection('admins').doc(email).get();

    if (!adminDoc.exists) {
      return null;
    }

    return adminDoc.data() as AdminUser;
  } catch (error) {
    console.error(`❌ Failed to get admin user ${email}:`, error);
    throw new Error(
      `Failed to fetch admin user: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(
  email: string,
  permission: keyof AdminUser['permissions']
): Promise<boolean> {
  try {
    const admin = await getAdminUser(email);

    if (!admin) {
      return false;
    }

    if (admin.status !== 'active') {
      return false;
    }

    return admin.permissions[permission] === true;
  } catch (error) {
    console.error(`❌ Failed to check permission ${permission} for ${email}:`, error);
    return false;
  }
}

/**
 * Update admin last login timestamp
 */
export async function updateAdminLastLogin(email: string): Promise<void> {
  try {
    const db = getFirestoreDb();
    await db.collection('admins').doc(email).update({
      lastLoginAt: new Date()
    });
  } catch (error) {
    // Don't throw error for login timestamp update failure
    console.error(`⚠️ Failed to update last login for ${email}:`, error);
  }
}

/**
 * Verify admin is active
 */
export async function isAdminActive(email: string): Promise<boolean> {
  try {
    const admin = await getAdminUser(email);
    return admin?.status === 'active';
  } catch (error) {
    console.error(`❌ Failed to verify admin status for ${email}:`, error);
    return false;
  }
}

/**
 * Set admin password (hashed with bcrypt)
 */
export async function setAdminPassword(email: string, password: string): Promise<void> {
  try {
    const bcrypt = await import('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    const db = getFirestoreDb();
    await db.collection('admins').doc(email).update({
      passwordHash,
      passwordChangedAt: new Date(),
      passwordResetToken: null,
      passwordResetExpires: null
    });

    console.log(`✅ Password updated for ${email}`);
  } catch (error) {
    console.error(`❌ Failed to set password for ${email}:`, error);
    throw new Error(
      `Failed to set password: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Verify admin password
 */
export async function verifyAdminPassword(email: string, password: string): Promise<boolean> {
  try {
    const admin = await getAdminUser(email);

    if (!admin || !admin.passwordHash) {
      return false;
    }

    const bcrypt = await import('bcryptjs');
    return await bcrypt.compare(password, admin.passwordHash);
  } catch (error) {
    console.error(`❌ Failed to verify password for ${email}:`, error);
    return false;
  }
}

/**
 * Generate password reset token
 */
export async function generatePasswordResetToken(email: string): Promise<string> {
  try {
    const crypto = await import('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token valid for 1 hour

    const db = getFirestoreDb();
    await db.collection('admins').doc(email).update({
      passwordResetToken: token,
      passwordResetExpires: expiresAt
    });

    console.log(`✅ Password reset token generated for ${email}`);
    return token;
  } catch (error) {
    console.error(`❌ Failed to generate reset token for ${email}:`, error);
    throw new Error(
      `Failed to generate reset token: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Verify password reset token
 */
export async function verifyPasswordResetToken(email: string, token: string): Promise<boolean> {
  try {
    const admin = await getAdminUser(email);

    if (!admin || !admin.passwordResetToken || !admin.passwordResetExpires) {
      return false;
    }

    // Check if token matches
    if (admin.passwordResetToken !== token) {
      return false;
    }

    // Check if token is expired
    const expiresAt = admin.passwordResetExpires.toDate ? admin.passwordResetExpires.toDate() : new Date(admin.passwordResetExpires);
    if (expiresAt < new Date()) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(`❌ Failed to verify reset token for ${email}:`, error);
    return false;
  }
}

/**
 * Reset password using token
 */
export async function resetPasswordWithToken(
  email: string,
  token: string,
  newPassword: string
): Promise<boolean> {
  try {
    const isValid = await verifyPasswordResetToken(email, token);

    if (!isValid) {
      return false;
    }

    await setAdminPassword(email, newPassword);
    console.log(`✅ Password reset successful for ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to reset password for ${email}:`, error);
    return false;
  }
}
