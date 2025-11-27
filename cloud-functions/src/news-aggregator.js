/**
 * News Aggregation Cloud Function
 *
 * Automatically collects news from RSS feeds and APIs, then stores in Firestore.
 * Runs daily to populate the news section with updates from the last 7 days.
 *
 * News Sources:
 * - Immigration: USCIS, UK Home Office, IRCC Canada, Department of Home Affairs Australia
 * - Tax: IRS, HMRC, Indian Tax Updates
 * - Investment: Economic Times, Reuters India, Bloomberg
 */

const Parser = require('rss-parser')
const admin = require('firebase-admin')

const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure']
  }
})

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
}

/**
 * Fetch and parse RSS feed
 */
async function fetchRSSFeed(source) {
  try {
    const feed = await parser.parseURL(source.url)
    const articles = []

    // Process each item in the feed
    for (const item of feed.items) {
      // Filter for articles from the last 7 days
      const publishedDate = item.pubDate ? new Date(item.pubDate) : new Date()
      const daysAgo = (new Date() - publishedDate) / (1000 * 60 * 60 * 24)

      if (daysAgo <= 7) {
        // Extract image URL
        let imageUrl = null
        if (item['media:content']) {
          imageUrl = item['media:content'].$.url
        } else if (item['media:thumbnail']) {
          imageUrl = item['media:thumbnail'].$.url
        } else if (item.enclosure && item.enclosure.type && item.enclosure.type.startsWith('image')) {
          imageUrl = item.enclosure.url
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
        })
      }
    }

    console.log(`✅ Fetched ${articles.length} articles from ${source.name}`)
    return articles

  } catch (error) {
    console.error(`❌ Error fetching ${source.name}:`, error.message)
    return []
  }
}

/**
 * Store articles in Firestore (avoiding duplicates)
 */
async function storeArticles(db, articles) {
  let newCount = 0
  let duplicateCount = 0

  for (const article of articles) {
    try {
      // Check for duplicates by URL
      const existingQuery = await db
        .collection('news')
        .where('url', '==', article.url)
        .limit(1)
        .get()

      if (existingQuery.empty) {
        // Create new article
        await db.collection('news').add(article)
        newCount++
      } else {
        duplicateCount++
      }
    } catch (error) {
      console.error(`❌ Error storing article:`, error.message)
    }
  }

  console.log(`📰 Stored ${newCount} new articles, skipped ${duplicateCount} duplicates`)
  return { newCount, duplicateCount }
}

/**
 * Main aggregation function
 */
async function aggregateNews(db) {
  console.log('🔄 Starting news aggregation...')

  const allArticles = []

  // Fetch from all sources
  for (const [category, sources] of Object.entries(NEWS_SOURCES)) {
    console.log(`\n📡 Fetching ${category} news...`)

    for (const source of sources) {
      const articles = await fetchRSSFeed(source)
      allArticles.push(...articles)

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  // Store all articles
  const stats = await storeArticles(db, allArticles)

  console.log(`\n✅ News aggregation complete!`)
  console.log(`📊 Total fetched: ${allArticles.length}`)
  console.log(`📊 New articles: ${stats.newCount}`)
  console.log(`📊 Duplicates skipped: ${stats.duplicateCount}`)

  return stats
}

/**
 * Cloud Function entry point
 * Scheduled to run daily at 6 AM UTC
 */
exports.aggregateNews = async (event, context) => {
  const db = admin.firestore()

  try {
    const stats = await aggregateNews(db)

    return {
      success: true,
      message: 'News aggregation completed',
      stats
    }
  } catch (error) {
    console.error('❌ News aggregation failed:', error)
    throw error
  }
}

/**
 * HTTP trigger for manual execution
 */
exports.aggregateNewsManual = async (req, res) => {
  const db = admin.firestore()

  try {
    const stats = await aggregateNews(db)

    res.status(200).json({
      success: true,
      message: 'News aggregation completed',
      stats
    })
  } catch (error) {
    console.error('❌ News aggregation failed:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// For local testing
if (require.main === module) {
  // Initialize Firebase Admin
  if (!admin.apps.length) {
    admin.initializeApp()
  }

  const db = admin.firestore()
  aggregateNews(db)
    .then(() => {
      console.log('✅ Done')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}
