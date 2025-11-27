# Firebase Setup Guide - Newsletter System

## Prerequisites

- Google Cloud Project: `nri-wealth-partners`
- Organization: `nriwealthpartners.com`
- Admin access to GCP Console

---

## Step 1: Enable Firebase in GCP Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Select existing project: **nri-wealth-partners**
4. Accept Firebase terms
5. Enable Google Analytics (optional, recommended for future insights)
6. Click "Continue" to finish setup

---

## Step 2: Enable Firestore Database

1. In Firebase Console, click "Firestore Database" in left menu
2. Click "Create database"
3. **IMPORTANT:** Select **"Start in production mode"** (we'll apply custom security rules)
4. Choose location: **us-central1** (or closest to your users)
5. Click "Enable"

**Note:** We use Firestore in **Native mode**, not Datastore mode. Native mode provides better real-time capabilities and mobile/web SDKs.

---

## Step 3: Create Firestore Collections

Firestore collections are created automatically when you add the first document. You have two options:

### Option A: Manual Setup (via Firebase Console)

1. Click "Start collection"
2. Enter collection ID: `admins`
3. Add first document:
   - Document ID: `saurabh@nriwealthpartners.com`
   - Fields:
     ```
     email: saurabh@nriwealthpartners.com (string)
     name: Saurabh (string)
     role: super_admin (string)
     status: active (string)
     invitedBy: system (string)
     createdAt: [Click "Add field" → Timestamp → "Now"]
     permissions: (map)
       manageAdmins: true (boolean)
       manageWebinars: true (boolean)
       deleteContent: true (boolean)
       draftNewsletter: true (boolean)
       publishNewsletter: true (boolean)
       manageSubscribers: true (boolean)
       viewAnalytics: true (boolean)
       exportData: true (boolean)
     ```

4. Repeat for other collections: `subscribers`, `raw_articles`, `curated_articles`, `newsletters`, `newsletter_analytics`, `content_sources`, `email_queue`
   - For now, you can create them empty (they'll be populated by Cloud Functions)

### Option B: Automated Setup (via Cloud Function - RECOMMENDED)

We'll create a Cloud Function to seed initial data automatically. See next steps.

---

## Step 4: Create Firestore Indexes

Required composite indexes for efficient queries:

1. In Firestore console, go to "Indexes" tab
2. Click "Create index"

**Index 1: raw_articles (processed + collectedAt)**
- Collection: `raw_articles`
- Fields:
  - `processed` (Ascending)
  - `collectedAt` (Descending)
- Query scope: Collection
- Status: Building → Enabled (takes 2-5 min)

**Index 2: curated_articles (status + createdAt)**
- Collection: `curated_articles`
- Fields:
  - `status` (Ascending)
  - `createdAt` (Descending)

**Index 3: curated_articles (category + status)**
- Collection: `curated_articles`
- Fields:
  - `category` (Ascending)
  - `status` (Ascending)

**Index 4: newsletters (status + scheduledFor)**
- Collection: `newsletters`
- Fields:
  - `status` (Ascending)
  - `scheduledFor` (Ascending)

**Index 5: newsletter_analytics (newsletterId + opened)**
- Collection: `newsletter_analytics`
- Fields:
  - `newsletterId` (Ascending)
  - `opened` (Ascending)

**Note:** Firestore will also auto-create single-field indexes. The above are composite indexes needed for complex queries.

---

## Step 5: Apply Security Rules

1. In Firestore console, click "Rules" tab
2. Replace default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAdmin() {
      return request.auth != null &&
             exists(/databases/$(database)/documents/admins/$(request.auth.token.email)) &&
             get(/databases/$(database)/documents/admins/$(request.auth.token.email)).data.status == 'active';
    }

    function isSuperAdmin() {
      return isAdmin() &&
             get(/databases/$(database)/documents/admins/$(request.auth.token.email)).data.role == 'super_admin';
    }

    function hasPermission(permission) {
      return isAdmin() &&
             get(/databases/$(database)/documents/admins/$(request.auth.token.email)).data.permissions[permission] == true;
    }

    // Admins collection - only super admin can write
    match /admins/{adminId} {
      allow read: if isAdmin();
      allow create, update, delete: if isSuperAdmin();
    }

    // Subscribers - admins can read/write, public can create (via API)
    match /subscribers/{subscriberId} {
      allow read: if isAdmin();
      allow create: if true; // Public subscription via API
      allow update, delete: if hasPermission('manageSubscribers');
    }

    // Raw articles - system only (Cloud Functions)
    match /raw_articles/{articleId} {
      allow read: if isAdmin();
      allow write: if false; // Only via Cloud Functions
    }

    // Curated articles - admins can read/write
    match /curated_articles/{articleId} {
      allow read: if isAdmin();
      allow create, update: if hasPermission('draftNewsletter');
      allow delete: if hasPermission('deleteContent');
    }

    // Newsletters - role-based permissions
    match /newsletters/{newsletterId} {
      allow read: if isAdmin();
      allow create, update: if hasPermission('draftNewsletter');
      allow delete: if hasPermission('deleteContent');
    }

    // Analytics - admins can read only
    match /newsletter_analytics/{analyticsId} {
      allow read: if hasPermission('viewAnalytics');
      allow write: if false; // Only via Cloud Functions
    }

    // Content sources - admins can manage
    match /content_sources/{sourceId} {
      allow read: if isAdmin();
      allow create, update, delete: if isSuperAdmin();
    }

    // Email queue - system only
    match /email_queue/{queueId} {
      allow read: if isAdmin();
      allow write: if false; // Only via Cloud Functions
    }
  }
}
```

3. Click "Publish"

---

## Step 6: Enable Firebase Authentication

We'll use Firebase Authentication for admin login:

1. In Firebase Console, click "Authentication" in left menu
2. Click "Get started"
3. Click "Sign-in method" tab
4. Enable these providers:
   - **Email/Password** (for admin login)
   - **Google** (optional, for easier admin login)

5. Add authorized domain:
   - Go to "Settings" → "Authorized domains"
   - Add: `nri-wealth-partners-1103733976099.us-central1.run.app`
   - Add: `nriwealthpartners.com` (for custom domain)

---

## Step 7: Set Up Cloud Storage (for file uploads)

1. In Firebase Console, click "Storage" in left menu
2. Click "Get started"
3. Start in **production mode** (we'll add custom rules)
4. Choose location: **us-central1**
5. Click "Done"

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /newsletter-images/{imageId} {
      allow read: if true; // Public read
      allow write: if request.auth != null; // Admins only
    }

    match /exports/{fileName} {
      allow read: if request.auth != null; // Admins only
      allow write: if request.auth != null;
    }
  }
}
```

---

## Step 8: Install Firebase Admin SDK

For Cloud Functions and backend operations:

```bash
cd /Users/jyotikumari/Projects/NRIWealthPartners
npm install firebase-admin
```

---

## Step 9: Generate Service Account Key

For server-side authentication:

1. Go to [GCP Console → IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=nri-wealth-partners)
2. Find service account: `nri-wealth-partners@appspot.gserviceaccount.com`
   - Or create new: "Firebase Admin SDK Service Account"
3. Click "Keys" tab → "Add Key" → "Create new key"
4. Choose **JSON** format
5. Download file (e.g., `firebase-admin-key.json`)
6. **IMPORTANT:** Store securely, NEVER commit to Git

**Add to .env.local:**
```env
FIREBASE_ADMIN_KEY={"type":"service_account",...}
```

**Add to Cloud Run:**
```bash
gcloud run services update nri-wealth-partners \
  --update-env-vars FIREBASE_ADMIN_KEY='{"type":"service_account",...}' \
  --region us-central1
```

---

## Step 10: Seed Initial Data

### A. Create Super Admin User

Run this Node.js script locally (or via Cloud Shell):

```javascript
// scripts/seed-super-admin.js
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(require('../firebase-admin-key.json'))
});

const db = admin.firestore();

async function seedSuperAdmin() {
  const adminRef = db.collection('admins').doc('saurabh@nriwealthpartners.com');

  await adminRef.set({
    email: 'saurabh@nriwealthpartners.com',
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

  console.log('✅ Super admin created successfully!');
}

seedSuperAdmin().catch(console.error);
```

Run:
```bash
node scripts/seed-super-admin.js
```

### B. Seed Content Sources

```javascript
// scripts/seed-content-sources.js
const admin = require('firebase-admin');
const contentSources = require('../docs/content-sources-seed-data.json');

admin.initializeApp({
  credential: admin.credential.cert(require('../firebase-admin-key.json'))
});

const db = admin.firestore();

async function seedContentSources() {
  const batch = db.batch();

  contentSources.contentSources.forEach(source => {
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
  });

  await batch.commit();
  console.log(`✅ Seeded ${contentSources.contentSources.length} content sources!`);
}

seedContentSources().catch(console.error);
```

Run:
```bash
node scripts/seed-content-sources.js
```

---

## Step 11: Verify Setup

1. Go to Firestore Console
2. Verify collections exist:
   - ✅ `admins` (1 document: saurabh@nriwealthpartners.com)
   - ✅ `content_sources` (19 documents)
   - ✅ Other collections (empty for now)

3. Go to Authentication Console
4. Verify Email/Password is enabled

5. Test security rules:
   - Try accessing Firestore from an unauthenticated client → Should fail
   - Try accessing as authenticated admin → Should succeed

---

## Step 12: Enable Required Google Cloud APIs

```bash
gcloud services enable \
  firestore.googleapis.com \
  firebase.googleapis.com \
  cloudfunctions.googleapis.com \
  cloudscheduler.googleapis.com \
  gmail.googleapis.com \
  --project=nri-wealth-partners
```

---

## Next Steps

✅ Firebase/Firestore setup complete!

Now we'll build:
1. **RSS feed collection Cloud Function** (daily automation)
2. **AI filtering & summarization** (Gemini integration)
3. **Admin dashboard UI** (Next.js app)
4. **Email sending system** (Google Workspace integration)
5. **Subscription management** (double opt-in, unsubscribe)

---

## Troubleshooting

### Error: "Missing or insufficient permissions"
- Check security rules are published
- Verify admin user exists in `admins` collection
- Ensure Firebase Auth token includes email claim

### Error: "Index not found"
- Wait 2-5 minutes for indexes to build
- Check "Indexes" tab for status
- Firestore will show specific index to create in error message

### Error: "Permission denied" in Cloud Functions
- Service account needs Firestore admin role
- Run: `gcloud projects add-iam-policy-binding nri-wealth-partners --member=serviceAccount:nri-wealth-partners@appspot.gserviceaccount.com --role=roles/datastore.user`

---

## Cost Monitoring

- **Firestore:** FREE tier covers 1GB storage, 50K reads/day, 20K writes/day
- **Authentication:** FREE tier covers 10K/month
- **Storage:** FREE tier covers 5GB storage, 1GB/day download
- **Cloud Functions:** FREE tier covers 2M invocations/month

**Expected monthly cost:** $0 (within FREE tier for first 6-12 months)

Set up billing alerts:
1. Go to [Billing → Budgets & alerts](https://console.cloud.google.com/billing/budgets)
2. Create budget: $10/month alert threshold
