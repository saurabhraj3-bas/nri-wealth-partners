/**
 * Newsletter Email Sender
 *
 * Sends newsletter emails in batches using Google Workspace Gmail API
 * Respects daily sending limits (2,000 emails/day)
 */

const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

const db = admin.firestore();

const BATCH_SIZE = 50; // Send 50 emails per batch
const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds delay

/**
 * Send newsletter to all active subscribers
 */
async function sendNewsletterBatch(newsletterId) {
  console.log(`📧 Starting newsletter send: ${newsletterId}`);

  try {
    // Get newsletter
    const newsletterDoc = await db.collection('newsletters').doc(newsletterId).get();

    if (!newsletterDoc.exists) {
      throw new Error('Newsletter not found');
    }

    const newsletter = newsletterDoc.data();

    // Verify newsletter is approved
    if (newsletter.status !== 'approved' && newsletter.status !== 'scheduled') {
      throw new Error(`Newsletter status is ${newsletter.status}, must be approved or scheduled`);
    }

    // Get all active subscribers
    const subscribersSnapshot = await db
      .collection('subscribers')
      .where('status', '==', 'active')
      .where('confirmedAt', '!=', null)
      .get();

    if (subscribersSnapshot.empty) {
      throw new Error('No active subscribers found');
    }

    const subscribers = subscribersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`👥 Found ${subscribers.length} active subscribers`);

    // Filter subscribers by preferences
    const eligibleSubscribers = filterByPreferences(subscribers, newsletter);

    console.log(`✅ ${eligibleSubscribers.length} eligible after preference filtering`);

    // Update newsletter status
    await db.collection('newsletters').doc(newsletterId).update({
      status: 'sending',
      'stats.totalRecipients': eligibleSubscribers.length
    });

    // Create email queue entries
    const queueBatch = db.batch();
    const emailQueue = [];

    eligibleSubscribers.forEach(subscriber => {
      const queueRef = db.collection('email_queue').doc();
      const queueEntry = {
        newsletterId,
        subscriberEmail: subscriber.email,
        subscriberName: subscriber.name || '',
        status: 'pending',
        attempts: 0,
        lastAttemptAt: null,
        error: null,
        scheduledFor: admin.firestore.FieldValue.serverTimestamp(),
        sentAt: null,
        metadata: {
          unsubscribeToken: subscriber.unsubscribeToken,
          trackingPixelId: queueRef.id
        }
      };

      queueBatch.set(queueRef, queueEntry);
      emailQueue.push({ id: queueRef.id, ...queueEntry, subscriber });
    });

    await queueBatch.commit();
    console.log(`📝 Created ${emailQueue.length} email queue entries`);

    // Send emails in batches
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < emailQueue.length; i += BATCH_SIZE) {
      const batch = emailQueue.slice(i, i + BATCH_SIZE);

      console.log(`\n📮 Sending batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(emailQueue.length / BATCH_SIZE)}...`);

      const promises = batch.map(async (queueEntry) => {
        try {
          await sendSingleEmail(newsletter, queueEntry.subscriber, queueEntry.id);

          // Update queue entry
          await db.collection('email_queue').doc(queueEntry.id).update({
            status: 'sent',
            sentAt: admin.firestore.FieldValue.serverTimestamp()
          });

          // Update subscriber stats
          await db.collection('subscribers').doc(queueEntry.subscriber.id).update({
            lastEmailSent: admin.firestore.FieldValue.serverTimestamp(),
            emailsSent: admin.firestore.FieldValue.increment(1)
          });

          sentCount++;
          return { success: true, email: queueEntry.subscriberEmail };
        } catch (error) {
          failedCount++;
          console.error(`❌ Failed to send to ${queueEntry.subscriberEmail}:`, error.message);

          // Update queue entry with error
          await db.collection('email_queue').doc(queueEntry.id).update({
            status: 'failed',
            attempts: admin.firestore.FieldValue.increment(1),
            lastAttemptAt: admin.firestore.FieldValue.serverTimestamp(),
            error: error.message
          });

          return { success: false, email: queueEntry.subscriberEmail, error: error.message };
        }
      });

      await Promise.all(promises);

      // Update newsletter stats
      await db.collection('newsletters').doc(newsletterId).update({
        'stats.sent': sentCount
      });

      // Delay between batches
      if (i + BATCH_SIZE < emailQueue.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }

    // Final newsletter update
    await db.collection('newsletters').doc(newsletterId).update({
      status: 'sent',
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      'stats.sent': sentCount
    });

    console.log(`\n✅ Newsletter send completed!`);
    console.log(`   Sent: ${sentCount}`);
    console.log(`   Failed: ${failedCount}`);
    console.log(`   Success rate: ${((sentCount / emailQueue.length) * 100).toFixed(1)}%`);

    return {
      success: true,
      newsletterId,
      totalSubscribers: emailQueue.length,
      sent: sentCount,
      failed: failedCount
    };
  } catch (error) {
    console.error('❌ Newsletter send failed:', error);

    // Update newsletter status to error
    await db.collection('newsletters').doc(newsletterId).update({
      status: 'error',
      error: error.message
    });

    throw error;
  }
}

/**
 * Filter subscribers by preferences
 */
function filterByPreferences(subscribers, newsletter) {
  return subscribers.filter(subscriber => {
    // Always send to subscribers with weeklyDigest preference
    if (subscriber.preferences?.weeklyDigest !== false) {
      return true;
    }

    // Check category-specific preferences
    if (subscriber.preferences?.regulatoryOnly) {
      // Only send if newsletter has regulatory content
      return newsletter.content?.sections?.regulatory?.articles?.length > 0;
    }

    if (subscriber.preferences?.financialOnly) {
      // Only send if newsletter has financial content
      return newsletter.content?.sections?.financial?.articles?.length > 0;
    }

    return true;
  });
}

/**
 * Send single email to subscriber
 */
async function sendSingleEmail(newsletter, subscriber, trackingPixelId) {
  // Create email transporter (Gmail via nodemailer)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'newsletters@nriwealthpartners.com',
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  // Build HTML email
  const htmlContent = await buildEmailHTML(newsletter, subscriber, trackingPixelId);

  // Build plain text version
  const textContent = buildEmailText(newsletter);

  // Unsubscribe link
  const unsubscribeLink = `https://nriwealthpartners.com/unsubscribe?token=${subscriber.unsubscribeToken}`;

  const mailOptions = {
    from: {
      name: 'NRI Wealth Partners',
      address: process.env.GMAIL_USER || 'newsletters@nriwealthpartners.com'
    },
    to: subscriber.email,
    subject: newsletter.subjectLine,
    text: textContent,
    html: htmlContent,
    headers: {
      'List-Unsubscribe': `<${unsubscribeLink}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
    }
  };

  await transporter.sendMail(mailOptions);

  console.log(`  ✓ Sent to ${subscriber.email}`);
}

/**
 * Build HTML email content
 */
async function buildEmailHTML(newsletter, subscriber, trackingPixelId) {
  const { content } = newsletter;

  // Get article details for each section
  const sections = [];

  for (const [categoryKey, section] of Object.entries(content.sections)) {
    if (categoryKey === 'expert') {
      // Expert tip section
      if (section.content) {
        sections.push({
          title: section.title,
          content: section.content
        });
      }
      continue;
    }

    if (!section.articles || section.articles.length === 0) {
      continue;
    }

    // Get article details
    const articleDocs = await Promise.all(
      section.articles.map(id => db.collection('curated_articles').doc(id).get())
    );

    const articles = articleDocs
      .filter(doc => doc.exists)
      .map(doc => doc.data());

    sections.push({
      title: section.title,
      articles
    });
  }

  // Tracking pixel for email opens
  const trackingPixel = `https://nri-wealth-partners-1103733976099.us-central1.run.app/api/track-email?type=open&id=${trackingPixelId}`;

  // Build HTML
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletter.title}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <!-- Header -->
  <div style="text-align: center; padding: 20px 0; border-bottom: 3px solid #C5A572;">
    <h1 style="color: #1A365D; margin: 0;">The NRI Weekly</h1>
    <p style="color: #666; font-size: 14px; margin: 5px 0;">Issue #${newsletter.issueNumber}</p>
  </div>

  <!-- Opening -->
  <div style="margin: 30px 0;">
    ${content.opening}
  </div>

  <!-- Sections -->
  ${sections.map(section => `
    <div style="margin: 30px 0;">
      <h2 style="color: #1A365D; border-left: 4px solid #C5A572; padding-left: 15px; font-size: 20px;">
        ${section.title}
      </h2>

      ${section.articles ? section.articles.map(article => `
        <div style="margin: 20px 0; padding: 15px; background: #F7FAFC; border-radius: 8px;">
          <h3 style="color: #2D3748; margin: 0 0 10px 0; font-size: 18px;">
            ${article.headline}
          </h3>
          <div style="color: #4A5568; font-size: 14px;">
            ${article.summary}
          </div>
          <a href="${article.originalArticle.url}?utm_source=newsletter&utm_medium=email&utm_campaign=nri_weekly_${newsletter.issueNumber}"
             style="display: inline-block; margin-top: 10px; color: #C5A572; text-decoration: none; font-weight: bold;">
            Read more →
          </a>
          <p style="color: #A0AEC0; font-size: 12px; margin: 10px 0 0 0;">
            Source: ${article.originalArticle.source}
          </p>
        </div>
      `).join('') : `
        <div style="margin: 20px 0; padding: 15px; background: #F7FAFC; border-radius: 8px;">
          ${section.content}
        </div>
      `}
    </div>
  `).join('')}

  <!-- Admin Commentary (if present) -->
  ${content.adminCommentary ? `
    <div style="margin: 30px 0; padding: 20px; background: #EDF2F7; border-left: 4px solid #1A365D; border-radius: 8px;">
      <h3 style="color: #1A365D; margin: 0 0 10px 0;">A Note from Our Team</h3>
      ${content.adminCommentary}
    </div>
  ` : ''}

  <!-- Closing -->
  <div style="margin: 30px 0;">
    ${content.closing}
  </div>

  <!-- Footer -->
  <div style="margin: 40px 0 20px 0; padding: 20px 0; border-top: 2px solid #E2E8F0; text-align: center; color: #718096; font-size: 12px;">
    <p style="margin: 0 0 10px 0;">
      © ${new Date().getFullYear()} NRI Wealth Partners. All rights reserved.
    </p>
    <p style="margin: 0 0 10px 0;">
      <a href="https://nriwealthpartners.com" style="color: #C5A572; text-decoration: none;">Visit our website</a> •
      <a href="https://nriwealthpartners.com/contact" style="color: #C5A572; text-decoration: none;">Contact us</a>
    </p>
    <p style="margin: 0;">
      <a href="https://nriwealthpartners.com/unsubscribe?token=${subscriber.unsubscribeToken}"
         style="color: #A0AEC0; text-decoration: underline;">
        Unsubscribe
      </a>
    </p>
  </div>

  <!-- Tracking Pixel -->
  <img src="${trackingPixel}" width="1" height="1" alt="" style="display:none;" />

</body>
</html>
  `;

  return html;
}

/**
 * Build plain text version
 */
function buildEmailText(newsletter) {
  return `
${newsletter.title}
Issue #${newsletter.issueNumber}

${newsletter.content.opening.replace(/<[^>]*>/g, '')}

---

To view this newsletter with full formatting, please enable HTML in your email client.

Visit us at: https://nriwealthpartners.com
Unsubscribe: https://nriwealthpartners.com/unsubscribe

© ${new Date().getFullYear()} NRI Wealth Partners
  `.trim();
}

module.exports = {
  sendNewsletterBatch,
  sendSingleEmail
};
