/**
 * Cloud Run News Aggregation Service
 * Triggered by Pub/Sub to collect news from RSS feeds
 */

const express = require('express');
const Parser = require('rss-parser');
const admin = require('firebase-admin');

const app = express();
const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure']
  }
});

// Initialize Firebase Admin
admin.initializeApp({
  projectId: process.env.GOOGLE_CLOUD_PROJECT || 'nri-wealth-partners'
});

const db = admin.firestore();

// News source configurations
const NEWS_SOURCES = {
  immigration: [
    {
      name: 'USCIS News',
      url: 'https://www.uscis.gov/rss/news-releases.xml',
      category: 'immigration',
      tags: ['USA', 'USCIS', 'immigration'],
    },
    {
      name: 'UK Visas and Immigration',
      url: 'https://www.gov.uk/government/organisations/uk-visas-and-immigration.atom',
      category: 'immigration',
      tags: ['UK', 'immigration', 'visa'],
    },
    {
      name: 'IRCC Canada',
      url: 'https://www.canada.ca/en/immigration-refugees-citizenship.atom.xml',
      category: 'immigration',
      tags: ['Canada', 'immigration', 'PR'],
    },
  ],
  tax: [
    {
      name: 'IRS Tax News',
      url: 'https://www.irs.gov/rss/rss-news-releases.xml',
      category: 'tax',
      tags: ['USA', 'tax', 'IRS'],
    },
    {
      name: 'India Tax Updates',
      url: 'https://economictimes.indiatimes.com/news/economy/policy/rssfeeds/1373380680.cms',
      category: 'tax',
      tags: ['India', 'tax', 'policy'],
    },
  ],
  investment: [
    {
      name: 'Economic Times - Markets',
      url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
      category: 'market',
      tags: ['India', 'market', 'investment'],
    },
    {
      name: 'Reuters India Business',
      url: 'https://www.reuters.com/business/india/feed',
      category: 'market',
      tags: ['India', 'business', 'market'],
    },
  ],
};

/**
 * Fetch and parse RSS feed
 */
async function fetchRSSFeed(source) {
  try {
    const feed = await parser.parseURL(source.url);
    const articles = [];

    for (const item of feed.items) {
      const publishedDate = item.pubDate ? new Date(item.pubDate) : new Date();
      const daysAgo = (new Date() - publishedDate) / (1000 * 60 * 60 * 24);

      if (daysAgo <= 7) {
        let imageUrl = null;
        if (item['media:content']) {
          imageUrl = item['media:content'].$.url;
        } else if (item['media:thumbnail']) {
          imageUrl = item['media:thumbnail'].$.url;
        } else if (item.enclosure && item.enclosure.type && item.enclosure.type.startsWith('image')) {
          imageUrl = item.enclosure.url;
        }

        articles.push({
          title: item.title || 'Untitled',
          description: item.contentSnippet || item.summary || item.description || '',
          category: source.category,
          source: source.name,
          url: item.link || '',
          publishedAt: publishedDate,
          imageUrl,
          tags: source.tags,
          status: 'published',
          createdAt: new Date(),
          createdBy: 'news-aggregator',
        });
      }
    }

    console.log(`✅ Fetched ${articles.length} articles from ${source.name}`);
    return articles;

  } catch (error) {
    console.error(`❌ Error fetching ${source.name}:`, error.message);
    return [];
  }
}

/**
 * Store articles in Firestore (avoiding duplicates)
 */
async function storeArticles(articles) {
  let newCount = 0;
  let duplicateCount = 0;

  for (const article of articles) {
    try {
      const existingQuery = await db
        .collection('news')
        .where('url', '==', article.url)
        .limit(1)
        .get();

      if (existingQuery.empty) {
        await db.collection('news').add(article);
        newCount++;
      } else {
        duplicateCount++;
      }
    } catch (error) {
      console.error(`❌ Error storing article:`, error.message);
    }
  }

  console.log(`📰 Stored ${newCount} new articles, skipped ${duplicateCount} duplicates`);
  return { newCount, duplicateCount };
}

/**
 * Main aggregation function
 */
async function aggregateNews() {
  console.log('🔄 Starting news aggregation...');

  const allArticles = [];

  for (const [category, sources] of Object.entries(NEWS_SOURCES)) {
    console.log(`\n📡 Fetching ${category} news...`);

    for (const source of sources) {
      const articles = await fetchRSSFeed(source);
      allArticles.push(...articles);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const stats = await storeArticles(allArticles);

  console.log(`\n✅ News aggregation complete!`);
  console.log(`📊 Total fetched: ${allArticles.length}`);
  console.log(`📊 New articles: ${stats.newCount}`);
  console.log(`📊 Duplicates skipped: ${stats.duplicateCount}`);

  return stats;
}

// HTTP endpoint for Pub/Sub trigger
app.post('/', async (req, res) => {
  try {
    console.log('📨 Pub/Sub trigger received');
    const stats = await aggregateNews();

    res.status(200).json({
      success: true,
      message: 'News aggregation completed',
      stats
    });
  } catch (error) {
    console.error('❌ News aggregation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('News Aggregation Service is running');
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 News aggregation service listening on port ${PORT}`);
});
