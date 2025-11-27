/**
 * RSS Feed Collector
 *
 * Fetches articles from all active content sources (RSS feeds, Google News)
 * and stores them in the raw_articles collection for AI processing.
 */

const admin = require('firebase-admin');
const Parser = require('rss-parser');
const axios = require('axios');

const db = admin.firestore();
const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'NRI-Wealth-Partners-Newsletter-Bot/1.0'
  },
  customFields: {
    item: [
      ['media:content', 'media'],
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
      ['summary', 'summary']
    ]
  }
});

/**
 * Main RSS collection function
 */
async function collectRSSFeeds() {
  console.log('🚀 Starting RSS feed collection');

  const startTime = Date.now();
  let totalArticles = 0;
  let successfulSources = 0;
  let failedSources = 0;

  try {
    // Get all active content sources
    const sourcesSnapshot = await db
      .collection('content_sources')
      .where('active', '==', true)
      .get();

    if (sourcesSnapshot.empty) {
      console.log('⚠️ No active content sources found');
      return {
        success: true,
        totalArticles: 0,
        successfulSources: 0,
        failedSources: 0,
        message: 'No active sources'
      };
    }

    console.log(`📰 Found ${sourcesSnapshot.size} active content sources`);

    // Process each source
    const promises = sourcesSnapshot.docs.map(async (doc) => {
      const source = { id: doc.id, ...doc.data() };

      try {
        console.log(`\n📡 Fetching: ${source.name}`);

        const articles = await fetchSourceArticles(source);

        if (articles.length > 0) {
          await storeArticles(articles, source);
          totalArticles += articles.length;
          successfulSources++;

          // Update source metadata
          await doc.ref.update({
            'metadata.lastFetchedAt': admin.firestore.FieldValue.serverTimestamp(),
            'metadata.lastSuccessAt': admin.firestore.FieldValue.serverTimestamp(),
            'metadata.articleCount': admin.firestore.FieldValue.increment(articles.length),
            'metadata.lastError': ''
          });

          console.log(`✅ ${source.name}: ${articles.length} articles collected`);
        } else {
          console.log(`⚠️ ${source.name}: No new articles found`);
        }

        return { success: true, source: source.name, count: articles.length };
      } catch (error) {
        failedSources++;
        console.error(`❌ ${source.name}: ${error.message}`);

        // Update source with error
        await doc.ref.update({
          'metadata.lastFetchedAt': admin.firestore.FieldValue.serverTimestamp(),
          'metadata.errorCount': admin.firestore.FieldValue.increment(1),
          'metadata.lastError': error.message
        });

        return { success: false, source: source.name, error: error.message };
      }
    });

    await Promise.all(promises);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    const summary = {
      success: true,
      totalArticles,
      successfulSources,
      failedSources,
      totalSources: sourcesSnapshot.size,
      durationSeconds: duration
    };

    console.log('\n✅ RSS collection completed!');
    console.log(`   Articles: ${totalArticles}`);
    console.log(`   Successful sources: ${successfulSources}`);
    console.log(`   Failed sources: ${failedSources}`);
    console.log(`   Duration: ${duration}s`);

    return summary;
  } catch (error) {
    console.error('❌ RSS collection failed:', error);
    throw error;
  }
}

/**
 * Fetch articles from a single source
 */
async function fetchSourceArticles(source) {
  const { url, type, config } = source;
  const maxArticles = config?.maxArticlesPerFetch || 10;

  if (type === 'rss' || type === 'google_news') {
    return await fetchRSSFeed(url, maxArticles);
  } else if (type === 'api') {
    return await fetchAPISource(url, config, maxArticles);
  } else {
    throw new Error(`Unknown source type: ${type}`);
  }
}

/**
 * Fetch RSS feed and parse articles
 */
async function fetchRSSFeed(url, maxArticles) {
  try {
    const feed = await parser.parseURL(url);

    if (!feed || !feed.items) {
      throw new Error('Invalid RSS feed format');
    }

    // Take only the most recent articles
    const recentItems = feed.items.slice(0, maxArticles);

    // Parse articles
    const articles = recentItems.map(item => ({
      title: item.title || '',
      description: cleanHTML(item.description || item.summary || item.contentSnippet || ''),
      content: cleanHTML(item.contentEncoded || item.content || item.description || ''),
      url: item.link || item.guid || '',
      author: item.creator || item.author || feed.title || '',
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      rawData: {
        guid: item.guid || item.link,
        categories: item.categories || []
      }
    }));

    return articles.filter(article => article.url && article.title);
  } catch (error) {
    console.error(`Error fetching RSS feed ${url}:`, error.message);
    throw error;
  }
}

/**
 * Fetch from custom API source (future enhancement)
 */
async function fetchAPISource(url, config, maxArticles) {
  // Placeholder for custom API integrations
  // Can be extended for specific news APIs
  throw new Error('API sources not yet implemented');
}

/**
 * Store articles in Firestore
 */
async function storeArticles(articles, source) {
  const batch = db.batch();
  const now = admin.firestore.FieldValue.serverTimestamp();
  let count = 0;

  for (const article of articles) {
    // Check if article already exists (by URL)
    const existingArticle = await db
      .collection('raw_articles')
      .where('url', '==', article.url)
      .limit(1)
      .get();

    if (!existingArticle.empty) {
      // Article already exists, skip
      continue;
    }

    // Create new article document
    const docRef = db.collection('raw_articles').doc();

    batch.set(docRef, {
      source: {
        name: source.name,
        url: source.url,
        category: source.category
      },
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      author: article.author,
      publishedAt: article.publishedAt,
      collectedAt: now,
      processed: false,
      processedAt: null,
      aiFilterResult: {
        relevanceScore: null,
        category: null,
        reasoning: null,
        rejected: false
      }
    });

    count++;

    // Firestore batch limit is 500
    if (count >= 500) {
      await batch.commit();
      console.log(`  💾 Committed batch of ${count} articles`);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
    console.log(`  💾 Committed final batch of ${count} articles`);
  }

  return articles.length;
}

/**
 * Clean HTML content and extract plain text
 */
function cleanHTML(html) {
  if (!html) return '';

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, ' ');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, '');

  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Limit length to 5000 characters
  if (text.length > 5000) {
    text = text.substring(0, 5000) + '...';
  }

  return text;
}

module.exports = {
  collectRSSFeeds,
  fetchSourceArticles,
  storeArticles
};
