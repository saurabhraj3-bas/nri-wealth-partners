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
