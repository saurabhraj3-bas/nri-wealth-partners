/**
 * Email Event Tracker
 *
 * Tracks email opens and clicks via tracking pixels and redirects
 */

const admin = require('firebase-admin');

const db = admin.firestore();

/**
 * Track email events (opens and clicks)
 */
async function trackEmailEvents(req, res) {
  const { type, id, url } = req.query;

  if (!type || !id) {
    res.status(400).send('Missing parameters');
    return;
  }

  try {
    if (type === 'open') {
      await trackEmailOpen(id);

      // Return 1x1 transparent pixel
      const pixel = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': pixel.length,
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        'Expires': '0'
      });
      res.end(pixel);
    } else if (type === 'click') {
      await trackEmailClick(id, url);

      // Redirect to the actual URL
      res.redirect(url || 'https://nriwealthpartners.com');
    } else {
      res.status(400).send('Invalid type');
    }
  } catch (error) {
    console.error('Error tracking email event:', error);
    res.status(500).send('Error tracking event');
  }
}

/**
 * Track email open
 */
async function trackEmailOpen(trackingPixelId) {
  try {
    // Get email queue entry
    const queueDoc = await db.collection('email_queue').doc(trackingPixelId).get();

    if (!queueDoc.exists) {
      console.error('Email queue entry not found:', trackingPixelId);
      return;
    }

    const queueData = queueDoc.data();
    const { newsletterId, subscriberEmail } = queueData;

    // Check if analytics entry already exists
    const analyticsQuery = await db
      .collection('newsletter_analytics')
      .where('newsletterId', '==', newsletterId)
      .where('subscriberEmail', '==', subscriberEmail)
      .limit(1)
      .get();

    if (analyticsQuery.empty) {
      // Create new analytics entry
      await db.collection('newsletter_analytics').add({
        newsletterId,
        subscriberEmail,
        sentAt: queueData.sentAt,
        delivered: true,
        opened: true,
        openedAt: admin.firestore.FieldValue.serverTimestamp(),
        openCount: 1,
        clicked: false,
        clickedLinks: [],
        clickCount: 0,
        bounced: false,
        bounceReason: null,
        unsubscribed: false,
        unsubscribedAt: null,
        metadata: {
          device: 'unknown',
          location: 'unknown',
          userAgent: 'unknown'
        }
      });

      // Update subscriber stats
      await db
        .collection('subscribers')
        .where('email', '==', subscriberEmail)
        .limit(1)
        .get()
        .then(snapshot => {
          if (!snapshot.empty) {
            snapshot.docs[0].ref.update({
              emailsOpened: admin.firestore.FieldValue.increment(1)
            });
          }
        });

      console.log(`📭 Email opened: ${subscriberEmail} (Newsletter: ${newsletterId})`);
    } else {
      // Update existing analytics entry (increment open count)
      const analyticsDoc = analyticsQuery.docs[0];
      await analyticsDoc.ref.update({
        openCount: admin.firestore.FieldValue.increment(1)
      });

      console.log(`📭 Email re-opened: ${subscriberEmail}`);
    }
  } catch (error) {
    console.error('Error tracking email open:', error);
  }
}

/**
 * Track email click
 */
async function trackEmailClick(trackingPixelId, clickedUrl) {
  try {
    // Get email queue entry
    const queueDoc = await db.collection('email_queue').doc(trackingPixelId).get();

    if (!queueDoc.exists) {
      console.error('Email queue entry not found:', trackingPixelId);
      return;
    }

    const queueData = queueDoc.data();
    const { newsletterId, subscriberEmail } = queueData;

    // Get or create analytics entry
    const analyticsQuery = await db
      .collection('newsletter_analytics')
      .where('newsletterId', '==', newsletterId)
      .where('subscriberEmail', '==', subscriberEmail)
      .limit(1)
      .get();

    if (analyticsQuery.empty) {
      // Create new analytics entry
      await db.collection('newsletter_analytics').add({
        newsletterId,
        subscriberEmail,
        sentAt: queueData.sentAt,
        delivered: true,
        opened: true,
        openedAt: admin.firestore.FieldValue.serverTimestamp(),
        openCount: 1,
        clicked: true,
        clickedLinks: [
          {
            url: clickedUrl,
            clickedAt: admin.firestore.FieldValue.serverTimestamp()
          }
        ],
        clickCount: 1,
        bounced: false,
        bounceReason: null,
        unsubscribed: false,
        unsubscribedAt: null,
        metadata: {
          device: 'unknown',
          location: 'unknown',
          userAgent: 'unknown'
        }
      });

      // Update subscriber stats
      await db
        .collection('subscribers')
        .where('email', '==', subscriberEmail)
        .limit(1)
        .get()
        .then(snapshot => {
          if (!snapshot.empty) {
            snapshot.docs[0].ref.update({
              emailsOpened: admin.firestore.FieldValue.increment(1),
              linksClicked: admin.firestore.FieldValue.increment(1)
            });
          }
        });
    } else {
      // Update existing analytics entry
      const analyticsDoc = analyticsQuery.docs[0];
      await analyticsDoc.ref.update({
        clicked: true,
        clickedLinks: admin.firestore.FieldValue.arrayUnion({
          url: clickedUrl,
          clickedAt: admin.firestore.FieldValue.serverTimestamp()
        }),
        clickCount: admin.firestore.FieldValue.increment(1)
      });

      // Update subscriber stats
      await db
        .collection('subscribers')
        .where('email', '==', subscriberEmail)
        .limit(1)
        .get()
        .then(snapshot => {
          if (!snapshot.empty) {
            snapshot.docs[0].ref.update({
              linksClicked: admin.firestore.FieldValue.increment(1)
            });
          }
        });
    }

    console.log(`🔗 Link clicked: ${subscriberEmail} → ${clickedUrl}`);
  } catch (error) {
    console.error('Error tracking email click:', error);
  }
}

module.exports = {
  trackEmailEvents,
  trackEmailOpen,
  trackEmailClick
};
