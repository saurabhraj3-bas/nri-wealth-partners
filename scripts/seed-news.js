/**
 * Seed News Articles
 *
 * Populates the news collection with sample articles for immediate testing.
 * Run with: node scripts/seed-news.js
 */

const admin = require('firebase-admin')
const path = require('path')

// Initialize Firebase Admin
try {
  const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json')
  const serviceAccount = require(serviceAccountPath)

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })

  console.log('✅ Firebase Admin initialized')
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message)
  console.log('\n⚠️  Make sure firebase-service-account.json exists in the project root')
  process.exit(1)
}

const db = admin.firestore()

// Sample news articles (last 7 days)
const sampleNews = [
  // Immigration News
  {
    title: 'USCIS Announces H-1B Electronic Registration Process for FY 2026',
    description: 'U.S. Citizenship and Immigration Services announces the H-1B electronic registration period for fiscal year 2026 will open on March 1, 2025. The registration system helps manage the H-1B cap selection process.',
    category: 'immigration',
    source: 'USCIS',
    url: 'https://www.uscis.gov',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    imageUrl: null,
    tags: ['USA', 'H1B', 'visa', 'USCIS'],
    status: 'published',
    createdAt: new Date(),
    createdBy: 'seed-script',
  },
  {
    title: 'Canada Announces New Express Entry Draw with Lower CRS Score',
    description: 'Immigration, Refugees and Citizenship Canada (IRCC) conducted an Express Entry draw with a CRS cutoff of 486 points, inviting 4,750 candidates to apply for permanent residence.',
    category: 'immigration',
    source: 'IRCC',
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    imageUrl: null,
    tags: ['Canada', 'Express Entry', 'PR', 'immigration'],
    status: 'published',
    createdAt: new Date(),
    createdBy: 'seed-script',
  },
  {
    title: 'UK Announces Changes to Skilled Worker Visa Salary Thresholds',
    description: 'The UK Home Office announces revised minimum salary requirements for the Skilled Worker visa route, effective April 2025. The general threshold increases to £38,700 for most roles.',
    category: 'immigration',
    source: 'UK Home Office',
    url: 'https://www.gov.uk/government/organisations/uk-visas-and-immigration',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    imageUrl: null,
    tags: ['UK', 'Skilled Worker', 'visa', 'salary'],
    status: 'published',
    createdAt: new Date(),
    createdBy: 'seed-script',
  },

  // Tax News
  {
    title: 'IRS Extends Tax Filing Deadline for Disaster-Affected Areas',
    description: 'The Internal Revenue Service extends the tax filing and payment deadline to June 17, 2025, for individuals and businesses affected by recent natural disasters in California and Florida.',
    category: 'tax',
    source: 'IRS',
    url: 'https://www.irs.gov',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    imageUrl: null,
    tags: ['USA', 'IRS', 'tax', 'deadline'],
    status: 'published',
    createdAt: new Date(),
    createdBy: 'seed-script',
  },
  {
    title: 'India Updates TDS Rules for NRI Remittances',
    description: 'The Indian Income Tax Department clarifies Tax Deducted at Source (TDS) requirements for NRI remittances. New rules effective from April 1, 2025, require updated Form 15CA/15CB documentation.',
    category: 'tax',
    source: 'Economic Times',
    url: 'https://economictimes.indiatimes.com',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    imageUrl: null,
    tags: ['India', 'NRI', 'TDS', 'remittance', 'tax'],
    status: 'published',
    createdAt: new Date(),
    createdBy: 'seed-script',
  },
  {
    title: 'DTAA Benefits: India-US Tax Treaty Amendments Proposed',
    description: 'India and the United States propose amendments to the Double Taxation Avoidance Agreement (DTAA) to provide clearer guidance on remote work taxation and digital income for NRIs.',
    category: 'tax',
    source: 'Business Standard',
    url: 'https://www.business-standard.com',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    imageUrl: null,
    tags: ['India', 'USA', 'DTAA', 'tax treaty', 'NRI'],
    status: 'published',
    createdAt: new Date(),
    createdBy: 'seed-script',
  },

  // Investment/Market News
  {
    title: 'SEBI Simplifies Mutual Fund Investment Process for NRIs',
    description: 'The Securities and Exchange Board of India streamlines the KYC process for NRIs investing in Indian mutual funds. New guidelines allow digital verification and reduced documentation.',
    category: 'investment',
    source: 'SEBI',
    url: 'https://www.sebi.gov.in',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    imageUrl: null,
    tags: ['India', 'SEBI', 'mutual funds', 'NRI', 'investment'],
    status: 'published',
    createdAt: new Date(),
    createdBy: 'seed-script',
  },
  {
    title: 'Indian Stock Market Reaches All-Time High on FII Inflows',
    description: 'The BSE Sensex crosses 85,000 for the first time, driven by strong foreign institutional investor (FII) inflows. Banking and IT sectors lead the rally with robust Q4 earnings.',
    category: 'market',
    source: 'Economic Times',
    url: 'https://economictimes.indiatimes.com',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    imageUrl: null,
    tags: ['India', 'stock market', 'Sensex', 'FII'],
    status: 'published',
    createdAt: new Date(),
    createdBy: 'seed-script',
  },
  {
    title: 'RBI Announces New Guidelines for NRE Account Holders',
    description: 'The Reserve Bank of India issues fresh guidelines for Non-Resident External (NRE) account operations, including enhanced digital banking services and simplified repatriation processes.',
    category: 'investment',
    source: 'RBI',
    url: 'https://www.rbi.org.in',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    imageUrl: null,
    tags: ['India', 'RBI', 'NRE', 'NRI', 'banking'],
    status: 'published',
    createdAt: new Date(),
    createdBy: 'seed-script',
  },
  {
    title: 'GIFT City Launches New Tax Incentives for NRI Investors',
    description: 'Gujarat International Finance Tec-City (GIFT City) announces enhanced tax benefits for NRI investors, including 100% tax holiday on trading income for 10 years.',
    category: 'investment',
    source: 'Business Line',
    url: 'https://www.thehindubusinessline.com',
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    imageUrl: null,
    tags: ['India', 'GIFT City', 'NRI', 'tax benefits', 'investment'],
    status: 'published',
    createdAt: new Date(),
    createdBy: 'seed-script',
  },
]

async function seedNews() {
  console.log('🌱 Starting news seed...\n')

  let successCount = 0
  let errorCount = 0

  for (const article of sampleNews) {
    try {
      const docRef = await db.collection('news').add(article)
      console.log(`✅ Added: ${article.title.substring(0, 60)}...`)
      successCount++
    } catch (error) {
      console.error(`❌ Failed to add article: ${error.message}`)
      errorCount++
    }
  }

  console.log(`\n📊 Seed Summary:`)
  console.log(`   ✅ Successfully added: ${successCount}`)
  console.log(`   ❌ Failed: ${errorCount}`)
  console.log(`   📰 Total: ${sampleNews.length}`)

  console.log(`\n✅ News seed complete!`)
  console.log(`\n🌐 Visit https://nriwealthpartners.com/news to view the news section`)
}

// Run the seed
seedNews()
  .then(() => {
    console.log('\n✅ Done')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
