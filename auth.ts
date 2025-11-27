/**
 * NextAuth Configuration for Admin Authentication
 *
 * Uses Firebase Admin SDK to authenticate admin users with proper error handling.
 */

import NextAuth, { DefaultSession, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { AdminUser } from '@/types/admin';

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      email: string;
      name: string;
      role: AdminUser['role'];
      permissions: AdminUser['permissions'];
    } & DefaultSession['user'];
  }

  interface User {
    email: string;
    name: string;
    role: AdminUser['role'];
    permissions: AdminUser['permissions'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'admin@nriwealthpartners.com'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          const email = credentials.email as string;
          const password = credentials.password as string;

          // For MVP: Simple password check
          // TODO: Replace with proper Firebase Authentication or secure password hash
          const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';

          if (password !== adminPassword) {
            console.warn(`⚠️ Failed login attempt for ${email}`);
            throw new Error('Invalid credentials');
          }

          // Dynamically import Firebase Admin functions (avoid bundling in Edge Runtime)
          const { getAdminUser, updateAdminLastLogin } = await import('@/lib/firebase-admin');

          // Get admin user from Firestore
          const admin = await getAdminUser(email);

          if (!admin) {
            console.warn(`⚠️ Login attempt for non-existent admin: ${email}`);
            throw new Error('Admin user not found');
          }

          // Check if admin is active
          if (admin.status !== 'active') {
            console.warn(`⚠️ Login attempt for ${admin.status} admin: ${email}`);
            throw new Error(`Account is ${admin.status}. Please contact support.`);
          }

          // Update last login timestamp (non-blocking)
          updateAdminLastLogin(email).catch(err => {
            console.error('Failed to update last login:', err);
          });

          console.log(`✅ Successful login: ${email} (${admin.role})`);

          // Return user object for session
          return {
            id: email,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            permissions: admin.permissions
          };
        } catch (error) {
          console.error('❌ Authorization error:', error);

          // Return null to indicate failed authentication
          // NextAuth will handle showing error to user
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      try {
        // Initial sign in
        if (user) {
          token.role = user.role;
          token.permissions = user.permissions;
          token.email = user.email;
          token.name = user.name;
        }

        // Refresh admin data on each request (optional, for fresh permissions)
        // Comment out if you want to cache permissions for session duration
        /*
        if (token.email) {
          const admin = await getAdminUser(token.email as string);
          if (admin && admin.status === 'active') {
            token.role = admin.role;
            token.permissions = admin.permissions;
          }
        }
        */

        return token;
      } catch (error) {
        console.error('❌ JWT callback error:', error);
        return token;
      }
    },

    async session({ session, token }) {
      try {
        if (token && session.user) {
          session.user.role = token.role as AdminUser['role'];
          session.user.permissions = token.permissions as AdminUser['permissions'];
          session.user.email = token.email as string;
          session.user.name = token.name as string;
        }

        return session;
      } catch (error) {
        console.error('❌ Session callback error:', error);
        return session;
      }
    },

    async redirect({ url, baseUrl }) {
      try {
        // After login, redirect to admin dashboard
        if (url.startsWith('/')) {
          return `${baseUrl}${url}`;
        } else if (url === baseUrl) {
          return `${baseUrl}/admin`;
        } else if (new URL(url).origin === baseUrl) {
          return url;
        }
        return `${baseUrl}/admin`;
      } catch (error) {
        console.error('❌ Redirect callback error:', error);
        return `${baseUrl}/admin`;
      }
    }
  },

  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',

  trustHost: true
});

/**
 * Helper function to check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await auth();
    return !!session?.user;
  } catch (error) {
    console.error('❌ Failed to check authentication:', error);
    return false;
  }
}

/**
 * Helper function to check if user has permission
 */
export async function checkPermission(
  permission: keyof AdminUser['permissions']
): Promise<boolean> {
  try {
    const session = await auth();

    if (!session?.user) {
      return false;
    }

    return session.user.permissions[permission] === true;
  } catch (error) {
    console.error(`❌ Failed to check permission ${permission}:`, error);
    return false;
  }
}

/**
 * Helper function to get current admin user
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return null;
    }

    // Dynamically import to avoid bundling Firebase Admin in Edge Runtime
    const { getAdminUser } = await import('@/lib/firebase-admin');
    return await getAdminUser(session.user.email);
  } catch (error) {
    console.error('❌ Failed to get current admin:', error);
    return null;
  }
}

/**
 * Require authentication - throw error if not authenticated
 */
export async function requireAuth(): Promise<void> {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Authentication required');
  }
}

/**
 * Require specific permission - throw error if not authorized
 */
export async function requirePermission(
  permission: keyof AdminUser['permissions']
): Promise<void> {
  const hasPermissionFlag = await checkPermission(permission);

  if (!hasPermissionFlag) {
    throw new Error(`Permission denied: ${permission} required`);
  }
}
