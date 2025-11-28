/**
 * Admin User Types
 *
 * Shared types for admin authentication and authorization.
 * Separated from firebase-admin.ts to avoid bundling Firebase Admin in Edge Runtime.
 */

export interface AdminUser {
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor' | 'content_writer' | 'viewer';
  permissions: {
    manageAdmins: boolean;
    manageWebinars: boolean;
    deleteContent: boolean;
    draftNewsletter: boolean;
    publishNewsletter: boolean;
    manageSubscribers: boolean;
    viewAnalytics: boolean;
    exportData: boolean;
  };
  status: 'active' | 'pending' | 'suspended';
  invitedBy: string;
  createdAt: any;
  lastLoginAt: any;
  passwordHash?: string; // Hashed password (bcrypt)
  passwordResetToken?: string; // One-time reset token
  passwordResetExpires?: any; // Reset token expiration timestamp
  passwordChangedAt?: any; // Last password change timestamp
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
  };
}
