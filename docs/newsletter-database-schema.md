# Newsletter System - Firestore Database Schema

## Collections Overview

```
/admins                    → Admin users with role-based permissions
/subscribers               → Newsletter subscribers
/raw_articles             → Daily collected articles (before AI filtering)
/curated_articles         → AI-filtered and summarized articles
/newsletters              → Weekly newsletter drafts and sent editions
/newsletter_analytics     → Email open/click tracking
/content_sources          → Configurable RSS feeds and sources
/email_queue              → Pending emails to send
```

---

## Collection: `admins`

**Purpose:** Store admin users with role-based access control

```typescript
{
  id: string (auto-generated doc ID)
  email: string (unique, indexed)
  name: string
  role: 'super_admin' | 'admin' | 'editor' | 'content_writer' | 'viewer'

  permissions: {
    manageAdmins: boolean
    manageWebinars: boolean
    deleteContent: boolean
    draftNewsletter: boolean
    publishNewsletter: boolean
    manageSubscribers: boolean
    viewAnalytics: boolean
    exportData: boolean
  }

  status: 'active' | 'pending' | 'suspended'
  invitedBy: string (admin email)
  createdAt: Timestamp
  lastLoginAt: Timestamp

  metadata: {
    ipAddress: string
    userAgent: string
  }
}
```

**Indexes:**
- email (unique)
- status
- role

---

## Collection: `subscribers`

**Purpose:** Newsletter subscribers with preferences

```typescript
{
  id: string (auto-generated)
  email: string (unique, indexed)
  name: string (optional)
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced'

  preferences: {
    weeklyDigest: boolean (default: true)
    regulatoryOnly: boolean (default: false)
    financialOnly: boolean (default: false)
  }

  source: 'website' | 'webinar' | 'import' | 'manual'

  subscribedAt: Timestamp
  confirmedAt: Timestamp (null until double opt-in confirmed)
  unsubscribedAt: Timestamp

  lastEmailSent: Timestamp
  emailsSent: number
  emailsOpened: number
  linksClicked: number

  metadata: {
    location: string (from IP geolocation)
    device: string
    referrer: string
  }

  unsubscribeToken: string (unique, for one-click unsubscribe)
}
```

**Indexes:**
- email (unique)
- status
- subscribedAt
- unsubscribeToken

---

## Collection: `raw_articles`

**Purpose:** Daily collected articles from RSS feeds (before AI processing)

```typescript
{
  id: string (auto-generated)

  source: {
    name: string (e.g., "Economic Times")
    url: string (RSS feed URL)
    category: 'success' | 'regulatory' | 'financial' | 'community'
  }

  title: string
  description: string
  content: string (full article text if available)
  url: string (original article URL)
  author: string
  publishedAt: Timestamp

  collectedAt: Timestamp
  processed: boolean (false initially, true after AI filtering)
  processedAt: Timestamp

  aiFilterResult: {
    relevanceScore: number (0-10, null if not processed)
    category: string
    reasoning: string
    rejected: boolean
  }
}
```

**Indexes:**
- processed
- collectedAt
- source.category

---

## Collection: `curated_articles`

**Purpose:** AI-filtered, summarized, and approved articles

```typescript
{
  id: string (auto-generated)
  rawArticleId: string (reference to raw_articles)

  category: 'success' | 'regulatory' | 'financial' | 'community' | 'expert'

  headline: string (AI-generated, max 60 chars)
  summary: string (AI-generated, 100-150 words, HTML)
  keyTakeaway: string (one sentence)

  originalArticle: {
    title: string
    url: string
    source: string
    publishedAt: Timestamp
  }

  aiMetadata: {
    relevanceScore: number (7-10)
    generatedAt: Timestamp
    model: string (e.g., "gemini-2.0-flash")
    promptVersion: string
  }

  status: 'draft' | 'approved' | 'published' | 'rejected'

  usedInNewsletters: string[] (array of newsletter IDs)

  createdAt: Timestamp
  approvedBy: string (admin email, if manually approved)
  approvedAt: Timestamp
}
```

**Indexes:**
- category
- status
- createdAt
- aiMetadata.relevanceScore

---

## Collection: `newsletters`

**Purpose:** Weekly newsletter drafts and sent editions

```typescript
{
  id: string (auto-generated)
  issueNumber: number (sequential, e.g., #47)

  title: string (e.g., "The NRI Weekly - Nov 24, 2024")
  status: 'draft' | 'pending_review' | 'approved' | 'scheduled' | 'sent'

  subjectLine: string (chosen from AI suggestions)
  subjectLineSuggestions: string[] (3 AI-generated options)
  previewText: string (email preview text, 100 chars)

  content: {
    opening: string (HTML, ~50 words)

    sections: {
      success: {
        title: string
        articles: string[] (array of curated_article IDs)
      },
      regulatory: {
        title: string
        articles: string[]
      },
      financial: {
        title: string
        articles: string[]
      },
      community: {
        title: string
        articles: string[]
      },
      expert: {
        title: string (optional)
        content: string (HTML, custom expert tip)
      }
    }

    closing: string (HTML, ~30 words)
    adminCommentary: string (HTML, optional personal note)
  }

  weekStartDate: Timestamp (Monday of the week)
  weekEndDate: Timestamp (Sunday of the week)

  createdAt: Timestamp
  createdBy: string (admin email or "ai_agent")

  reviewedBy: string (admin email)
  reviewedAt: Timestamp

  scheduledFor: Timestamp
  sentAt: Timestamp

  stats: {
    totalRecipients: number
    sent: number
    delivered: number
    opened: number
    clicked: number
    bounced: number
    unsubscribed: number

    openRate: number (percentage)
    clickRate: number (percentage)
  }

  aiGenerated: boolean
  aiMetadata: {
    model: string
    generatedAt: Timestamp
    promptVersion: string
  }
}
```

**Indexes:**
- status
- issueNumber
- scheduledFor
- sentAt

---

## Collection: `newsletter_analytics`

**Purpose:** Track individual subscriber interactions

```typescript
{
  id: string (auto-generated)
  newsletterId: string (reference to newsletters)
  subscriberEmail: string

  sentAt: Timestamp
  delivered: boolean

  opened: boolean
  openedAt: Timestamp
  openCount: number (can open multiple times)

  clicked: boolean
  clickedLinks: [{
    url: string
    clickedAt: Timestamp
  }]
  clickCount: number

  bounced: boolean
  bounceReason: string

  unsubscribed: boolean
  unsubscribedAt: Timestamp

  metadata: {
    device: string
    location: string
    userAgent: string
  }
}
```

**Indexes:**
- newsletterId
- subscriberEmail
- opened
- clicked

---

## Collection: `content_sources`

**Purpose:** Configurable RSS feeds and content sources

```typescript
{
  id: string (auto-generated)

  name: string (e.g., "Economic Times - NRI News")
  url: string (RSS feed URL or API endpoint)
  type: 'rss' | 'api' | 'google_news'

  category: 'success' | 'regulatory' | 'financial' | 'community'

  active: boolean

  metadata: {
    lastFetchedAt: Timestamp
    lastSuccessAt: Timestamp
    articleCount: number
    errorCount: number
    lastError: string
  }

  config: {
    fetchFrequency: 'daily' | 'hourly'
    maxArticlesPerFetch: number
    parseRules: object (custom parsing config)
  }

  createdAt: Timestamp
  createdBy: string (admin email)
}
```

**Indexes:**
- active
- category
- type

---

## Collection: `email_queue`

**Purpose:** Queue emails for batch sending

```typescript
{
  id: string (auto-generated)

  newsletterId: string
  subscriberEmail: string
  subscriberName: string

  status: 'pending' | 'sending' | 'sent' | 'failed'

  attempts: number
  lastAttemptAt: Timestamp

  error: string (if failed)

  scheduledFor: Timestamp
  sentAt: Timestamp

  metadata: {
    unsubscribeToken: string
    trackingPixelId: string
  }
}
```

**Indexes:**
- status
- scheduledFor
- newsletterId

---

## Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAdmin() {
      return request.auth != null &&
             get(/databases/$(database)/documents/admins/$(request.auth.token.email)).data.status == 'active';
    }

    function isSuperAdmin() {
      return isAdmin() &&
             get(/databases/$(database)/documents/admins/$(request.auth.token.email)).data.role == 'super_admin';
    }

    // Admins collection - only super admin can write
    match /admins/{adminId} {
      allow read: if isAdmin();
      allow write: if isSuperAdmin();
    }

    // Subscribers - admins can read/write, public can create (via API)
    match /subscribers/{subscriberId} {
      allow read: if isAdmin();
      allow create: if true; // Public subscription via API
      allow update, delete: if isAdmin();
    }

    // Raw articles - system only
    match /raw_articles/{articleId} {
      allow read: if isAdmin();
      allow write: if false; // Only via Cloud Functions
    }

    // Curated articles - admins can read/write
    match /curated_articles/{articleId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    // Newsletters - admins can read/write
    match /newsletters/{newsletterId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    // Analytics - admins can read only
    match /newsletter_analytics/{analyticsId} {
      allow read: if isAdmin();
      allow write: if false; // Only via Cloud Functions
    }

    // Content sources - admins can manage
    match /content_sources/{sourceId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    // Email queue - system only
    match /email_queue/{queueId} {
      allow read: if isAdmin();
      allow write: if false; // Only via Cloud Functions
    }
  }
}
```

---

## Initial Data Setup

### Super Admin User

```typescript
// Create first super admin
admins/saurabh@nriwealthpartners.com {
  email: "saurabh@nriwealthpartners.com",
  name: "Saurabh",
  role: "super_admin",
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
  status: "active",
  invitedBy: "system",
  createdAt: Timestamp.now(),
  lastLoginAt: null
}
```

### Content Sources (RSS Feeds)

See separate file: `content-sources-seed-data.json`

---

## Estimated Storage & Costs

### Storage Estimates (per month):

- **raw_articles**: ~3,000 articles/month × 5KB = 15MB
- **curated_articles**: ~500 articles/month × 2KB = 1MB
- **newsletters**: ~4/month × 50KB = 200KB
- **subscribers**: 1,000 × 1KB = 1MB
- **analytics**: 4,000 events/month × 0.5KB = 2MB

**Total:** ~20MB/month

### Firestore Costs (FREE tier covers):

- Storage: 1GB FREE (we use 20MB)
- Reads: 50K/day FREE (we use ~5K/day)
- Writes: 20K/day FREE (we use ~200/day)
- Deletes: 20K/day FREE (we use minimal)

**Cost: $0/month** (well within FREE tier)

---

## Next Steps

1. Set up Firebase project in GCP
2. Enable Firestore in Native mode
3. Create collections with indexes
4. Apply security rules
5. Seed initial admin user
6. Seed content sources
