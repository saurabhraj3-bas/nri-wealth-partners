#!/usr/bin/env node

/**
 * Seed Super Admin User to Firestore
 *
 * Usage:
 *   1. Ensure FIREBASE_ADMIN_KEY is set in .env.local
 *   2. Run: node scripts/seed-super-admin.js
 *
 * This creates the initial super admin user with full permissions.
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
if (!process.env.FIREBASE_ADMIN_KEY) {
  console.error('❌ Error: FIREBASE_ADMIN_KEY environment variable is required');
  console.error('Please add it to .env.local');
  process.exit(1);
}

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  process.exit(1);
}

const db = admin.firestore();

async function seedSuperAdmin() {
  console.log('\n🌱 Seeding super admin user...\n');

  const adminEmail = 'saurabh@nriwealthpartners.com';
  const adminRef = db.collection('admins').doc(adminEmail);

  try {
    // Check if admin already exists
    const existingAdmin = await adminRef.get();

    if (existingAdmin.exists) {
      console.log(`⚠️  Admin user ${adminEmail} already exists`);
      console.log('Current data:', existingAdmin.data());

      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        readline.question('\nDo you want to overwrite? (yes/no): ', resolve);
      });

      readline.close();

      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Aborted. No changes made.');
        process.exit(0);
      }
    }

    // Create or update super admin
    await adminRef.set({
      email: adminEmail,
      name: 'Saurabh',
      role: 'super_admin',
      permissions: {
        manageAdmins: true,
        manageWebinars: true,
        deleteContent: true,
        draftNewsletter: true,
        publishNewsletter: true,
        manageSubscribers: true,
        viewAnalytics: true,
        exportData: true
      },
      status: 'active',
      invitedBy: 'system',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: null,
      metadata: {
        ipAddress: '',
        userAgent: ''
      }
    });

    console.log('\n✅ Super admin created successfully!');
    console.log('\n📧 Admin Details:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Role: super_admin`);
    console.log(`   Status: active`);
    console.log(`   Permissions: All granted ✓`);
    console.log('\n✨ You can now log in to the admin dashboard\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding super admin:', error.message);
    process.exit(1);
  }
}

seedSuperAdmin();
