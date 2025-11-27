#!/usr/bin/env node

/**
 * Seed Content Sources (RSS Feeds) to Firestore
 *
 * Usage:
 *   1. Ensure FIREBASE_ADMIN_KEY is set in .env.local
 *   2. Run: node scripts/seed-content-sources.js
 *
 * This loads content sources from content-sources-seed-data.json
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
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

async function seedContentSources() {
  console.log('\n🌱 Seeding content sources...\n');

  // Load content sources from JSON file
  const dataPath = path.join(__dirname, '../docs/content-sources-seed-data.json');

  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Error: File not found: ${dataPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(dataPath, 'utf8');
  const { contentSources } = JSON.parse(rawData);

  console.log(`📁 Found ${contentSources.length} content sources to seed\n`);

  try {
    // Check if content sources already exist
    const existingSources = await db.collection('content_sources').get();

    if (!existingSources.empty) {
      console.log(`⚠️  Found ${existingSources.size} existing content sources`);

      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        readline.question('\nDo you want to delete and re-seed? (yes/no): ', resolve);
      });

      readline.close();

      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Aborted. No changes made.');
        process.exit(0);
      }

      // Delete existing sources
      console.log('\n🗑️  Deleting existing sources...');
      const batch = db.batch();
      existingSources.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log('✅ Deleted successfully');
    }

    // Seed new content sources
    console.log('\n✨ Creating new content sources...\n');

    const batch = db.batch();
    let count = 0;

    contentSources.forEach(source => {
      const docRef = db.collection('content_sources').doc();

      batch.set(docRef, {
        ...source,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: 'system',
        metadata: {
          lastFetchedAt: null,
          lastSuccessAt: null,
          articleCount: 0,
          errorCount: 0,
          lastError: ''
        }
      });

      count++;
      console.log(`  ${count}. ${source.name} (${source.category})`);
    });

    await batch.commit();

    console.log(`\n✅ Successfully seeded ${count} content sources!`);

    // Show summary by category
    const summary = contentSources.reduce((acc, source) => {
      acc[source.category] = (acc[source.category] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📊 Summary by category:');
    Object.entries(summary).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} sources`);
    });

    console.log('\n✨ Content sources are ready for RSS collection!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding content sources:', error.message);
    process.exit(1);
  }
}

seedContentSources();
