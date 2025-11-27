/**
 * Cloud Functions for NRI Wealth Partners Newsletter System
 *
 * Functions:
 * 1. collectRSSFeeds - Daily RSS collection from all content sources
 * 2. filterArticles - AI-powered article filtering and relevance scoring
 * 3. summarizeArticles - AI-powered article summarization
 * 4. compileNewsletter - Weekly newsletter compilation
 * 5. sendNewsletterBatch - Batch email sending
 * 6. trackEmailEvents - Email open/click tracking webhook
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

// Import function modules
const { collectRSSFeeds } = require('./src/rss-collector');
const { filterArticles } = require('./src/ai-filter');
const { summarizeArticles } = require('./src/ai-summarizer');
const { compileNewsletter } = require('./src/newsletter-compiler');
const { sendNewsletterBatch } = require('./src/email-sender');
const { trackEmailEvents } = require('./src/email-tracker');

// ============================================================================
// SCHEDULED FUNCTIONS (Cloud Scheduler)
// ============================================================================

/**
 * Collect RSS feeds daily at 2 AM IST (8:30 PM UTC previous day)
 * Cloud Scheduler cron: "30 20 * * *"
 */
exports.scheduledRSSCollection = functions
  .runWith({
    timeoutSeconds: 540, // 9 minutes
    memory: '512MB'
  })
  .pubsub.schedule('30 20 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    console.log('🕐 Scheduled RSS collection started');
    try {
      const result = await collectRSSFeeds();
      console.log('✅ RSS collection completed:', result);
      return result;
    } catch (error) {
      console.error('❌ RSS collection failed:', error);
      throw error;
    }
  });

/**
 * Filter collected articles with AI at 3 AM IST
 * Cloud Scheduler cron: "0 21 * * *"
 */
exports.scheduledArticleFiltering = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '1GB'
  })
  .pubsub.schedule('0 21 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    console.log('🕐 Scheduled article filtering started');
    try {
      const result = await filterArticles();
      console.log('✅ Article filtering completed:', result);
      return result;
    } catch (error) {
      console.error('❌ Article filtering failed:', error);
      throw error;
    }
  });

/**
 * Summarize filtered articles with AI at 4 AM IST
 * Cloud Scheduler cron: "0 22 * * *"
 */
exports.scheduledArticleSummarization = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '1GB'
  })
  .pubsub.schedule('0 22 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    console.log('🕐 Scheduled article summarization started');
    try {
      const result = await summarizeArticles();
      console.log('✅ Article summarization completed:', result);
      return result;
    } catch (error) {
      console.error('❌ Article summarization failed:', error);
      throw error;
    }
  });

/**
 * Compile weekly newsletter draft every Monday at 9 AM IST
 * Cloud Scheduler cron: "0 3 * * 1"
 */
exports.scheduledNewsletterCompilation = functions
  .runWith({
    timeoutSeconds: 300,
    memory: '512MB'
  })
  .pubsub.schedule('0 3 * * 1')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    console.log('🕐 Scheduled newsletter compilation started');
    try {
      const result = await compileNewsletter();
      console.log('✅ Newsletter compilation completed:', result);
      return result;
    } catch (error) {
      console.error('❌ Newsletter compilation failed:', error);
      throw error;
    }
  });

// ============================================================================
// HTTP FUNCTIONS (Callable from Next.js)
// ============================================================================

/**
 * Manual RSS collection trigger
 */
exports.triggerRSSCollection = functions
  .runWith({ timeoutSeconds: 540, memory: '512MB' })
  .https.onCall(async (data, context) => {
    // Verify admin authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const adminDoc = await db.collection('admins').doc(context.auth.token.email).get();
    if (!adminDoc.exists || adminDoc.data().status !== 'active') {
      throw new functions.https.HttpsError('permission-denied', 'User is not an active admin');
    }

    console.log(`📞 Manual RSS collection triggered by ${context.auth.token.email}`);

    try {
      const result = await collectRSSFeeds();
      return { success: true, ...result };
    } catch (error) {
      console.error('Error in manual RSS collection:', error);
      throw new functions.https.HttpsError('internal', error.message);
    }
  });

/**
 * Manual article filtering trigger
 */
exports.triggerArticleFiltering = functions
  .runWith({ timeoutSeconds: 540, memory: '1GB' })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const adminDoc = await db.collection('admins').doc(context.auth.token.email).get();
    if (!adminDoc.exists || adminDoc.data().status !== 'active') {
      throw new functions.https.HttpsError('permission-denied', 'User is not an active admin');
    }

    console.log(`📞 Manual article filtering triggered by ${context.auth.token.email}`);

    try {
      const result = await filterArticles();
      return { success: true, ...result };
    } catch (error) {
      console.error('Error in manual article filtering:', error);
      throw new functions.https.HttpsError('internal', error.message);
    }
  });

/**
 * Send newsletter batch (called when admin approves newsletter)
 */
exports.sendNewsletter = functions
  .runWith({ timeoutSeconds: 540, memory: '1GB' })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { newsletterId } = data;
    if (!newsletterId) {
      throw new functions.https.HttpsError('invalid-argument', 'newsletterId is required');
    }

    const adminDoc = await db.collection('admins').doc(context.auth.token.email).get();
    if (!adminDoc.exists || !adminDoc.data().permissions?.publishNewsletter) {
      throw new functions.https.HttpsError('permission-denied', 'User does not have publish permission');
    }

    console.log(`📧 Newsletter send triggered by ${context.auth.token.email} for ${newsletterId}`);

    try {
      const result = await sendNewsletterBatch(newsletterId);
      return { success: true, ...result };
    } catch (error) {
      console.error('Error sending newsletter:', error);
      throw new functions.https.HttpsError('internal', error.message);
    }
  });

/**
 * Email tracking webhook (for open/click tracking)
 */
exports.trackEmail = functions
  .https.onRequest(async (req, res) => {
    try {
      await trackEmailEvents(req, res);
    } catch (error) {
      console.error('Error tracking email event:', error);
      res.status(500).send('Error tracking event');
    }
  });

// ============================================================================
// FIRESTORE TRIGGERS
// ============================================================================

/**
 * Auto-process new raw articles after collection
 */
exports.onRawArticleCreated = functions
  .firestore.document('raw_articles/{articleId}')
  .onCreate(async (snap, context) => {
    const article = snap.data();

    // Skip if already processed
    if (article.processed) {
      return null;
    }

    console.log(`🆕 New raw article: ${article.title}`);

    // Auto-trigger filtering for this article
    // (In production, this would be batched, but for real-time this works)
    try {
      // Import and use AI filter for single article
      const { filterSingleArticle } = require('./src/ai-filter');
      await filterSingleArticle(snap.id, article);

      console.log(`✅ Processed article: ${article.title}`);
    } catch (error) {
      console.error(`❌ Error processing article ${snap.id}:`, error);
    }

    return null;
  });

/**
 * Update newsletter stats when analytics are added
 */
exports.onNewsletterAnalyticsCreated = functions
  .firestore.document('newsletter_analytics/{analyticsId}')
  .onCreate(async (snap, context) => {
    const analytics = snap.data();
    const { newsletterId, opened, clicked } = analytics;

    if (!newsletterId) {
      return null;
    }

    // Update newsletter stats
    const newsletterRef = db.collection('newsletters').doc(newsletterId);

    await newsletterRef.update({
      'stats.delivered': admin.firestore.FieldValue.increment(1),
      ...(opened && { 'stats.opened': admin.firestore.FieldValue.increment(1) }),
      ...(clicked && { 'stats.clicked': admin.firestore.FieldValue.increment(1) })
    });

    return null;
  });
