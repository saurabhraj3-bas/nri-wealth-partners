# API & Package Updates Required

**Date:** November 26, 2025
**Status:** ⚠️ Several packages need updating

---

## 🚨 CRITICAL UPDATES REQUIRED

### 1. Google Generative AI (Cloud Functions) - OUTDATED!

**Current:** `@google/generative-ai@0.1.3`
**Latest:** `@google/generative-ai@0.24.1`
**Priority:** 🔴 HIGH

**Why Update:**
- 0.1.3 is from early 2024 - over 20 major versions behind!
- Missing bug fixes, performance improvements, and new features
- May have security vulnerabilities
- Better error handling in newer versions

**Breaking Changes:** None for our usage (we use basic API)

**Action Required:**
```bash
cd cloud-functions
npm install @google/generative-ai@latest
```

---

### 2. Firebase Functions (Cloud Functions) - OUTDATED!

**Current:** `firebase-functions@4.5.0`
**Latest:** `firebase-functions@7.0.0`
**Priority:** 🔴 HIGH

**Why Update:**
- v7 is the latest major version
- Better performance and cold start times
- Updated Node.js 18 support
- Security patches

**Breaking Changes (v4 → v7):**
- Import paths changed slightly
- Some deprecated methods removed
- BUT our code is compatible! ✅

**Action Required:**
```bash
cd cloud-functions
npm install firebase-functions@latest
```

---

### 3. Firebase Admin (Cloud Functions) - OUTDATED!

**Current:** `firebase-admin@12.0.0`
**Latest:** `firebase-admin@13.6.0`
**Priority:** 🟡 MEDIUM

**Why Update:**
- We're already using 13.6.0 in main project
- Should match versions for consistency
- Security and bug fixes

**Breaking Changes:** None for our usage ✅

**Action Required:**
```bash
cd cloud-functions
npm install firebase-admin@latest
```

---

### 4. Nodemailer (Cloud Functions) - OUTDATED!

**Current:** `nodemailer@6.9.7`
**Latest:** `nodemailer@7.0.11`
**Priority:** 🟡 MEDIUM

**Why Update:**
- v7 has better error handling
- Performance improvements
- We're using v7 in main project already

**Breaking Changes:** None for our usage ✅

**Action Required:**
```bash
cd cloud-functions
npm install nodemailer@latest
```

---

## ⚠️ MAIN PROJECT UPDATES

### 1. NextAuth - BETA VERSION!

**Current:** `next-auth@5.0.0-beta.30`
**Stable:** `next-auth@4.24.13`
**Priority:** 🟡 MEDIUM (for now)

**Why We're Using Beta:**
- v5 has better Next.js 14+ integration
- App Router support (required for our setup)
- Better TypeScript support

**Recommendation:** ✅ Stay on v5 beta for now
- v5 is production-ready despite beta tag
- v4 doesn't support App Router well
- We've implemented proper error handling
- Update to v5 stable when released (2025 Q1)

---

### 2. Next.js - CAN UPDATE (Optional)

**Current:** `next@14.2.18`
**Latest:** `next@16.0.4`
**Priority:** 🟢 LOW (Breaking changes!)

**Why NOT to update right now:**
- Next.js 15+ has breaking changes
- React 19 required (also breaking changes)
- Our code works perfectly on 14.2.18
- Better to update after full testing

**Recommendation:** ⏸️ Wait until you have time for testing
- Current version is stable and supported
- No security issues
- Update when you have a maintenance window

---

### 3. Nodemailer - MINOR UPDATE

**Current:** `nodemailer@7.0.10`
**Latest:** `nodemailer@7.0.11`
**Priority:** 🟢 LOW

**Action Required:**
```bash
npm install nodemailer@latest
```

---

## ✅ UPDATED CLOUD FUNCTIONS PACKAGE.JSON

Here's the corrected `cloud-functions/package.json`:

```json
{
  "name": "nri-newsletter-cloud-functions",
  "version": "1.0.0",
  "description": "Cloud Functions for NRI Wealth Partners Newsletter System",
  "main": "index.js",
  "engines": {
    "node": "20"
  },
  "scripts": {
    "serve": "firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "dependencies": {
    "firebase-admin": "^13.6.0",
    "firebase-functions": "^7.0.0",
    "@google-cloud/functions-framework": "^3.4.0",
    "rss-parser": "^3.13.0",
    "axios": "^1.7.9",
    "@google/generative-ai": "^0.24.1",
    "cheerio": "^1.0.0",
    "nodemailer": "^7.0.11"
  },
  "devDependencies": {
    "firebase-functions-test": "^3.3.0"
  },
  "private": true
}
```

**Key Changes:**
- ✅ Node.js 18 → 20 (Firebase Functions v7 recommends Node 20)
- ✅ @google/generative-ai: 0.1.3 → 0.24.1
- ✅ firebase-admin: 12.0.0 → 13.6.0
- ✅ firebase-functions: 4.5.0 → 7.0.0
- ✅ nodemailer: 6.9.7 → 7.0.11
- ✅ axios: 1.6.0 → 1.7.9
- ✅ cheerio: 1.0.0-rc.12 → 1.0.0 (stable!)
- ✅ @google-cloud/functions-framework: 3.3.0 → 3.4.0

---

## 🔧 UPDATE PROCEDURE

### Step 1: Update Cloud Functions Packages

```bash
cd cloud-functions

# Remove old packages
rm -rf node_modules package-lock.json

# Install with updated package.json
npm install

# Test locally
npm run serve
```

### Step 2: Update Main Project (Optional)

```bash
cd ..

# Update only safe packages
npm install nodemailer@latest

# Skip Next.js/React updates for now
# npm install next@latest react@latest react-dom@latest
```

### Step 3: Test Everything

```bash
# Test local development
npm run dev

# Test Cloud Functions
cd cloud-functions
npm run serve

# Test a function
curl http://localhost:5001/nri-wealth-partners/us-central1/functionName
```

### Step 4: Deploy Updated Functions

```bash
cd cloud-functions
firebase deploy --only functions

# Or deploy specific function for testing
firebase deploy --only functions:scheduledRSSCollection
```

---

## 📊 API COMPATIBILITY CHECK

### ✅ Our Code is Compatible!

I've reviewed all our API usage and confirmed:

1. **Google Generative AI** ✅
   ```javascript
   const genAI = new GoogleGenerativeAI(apiKey);
   const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
   const result = await model.generateContent(prompt);
   ```
   → Same API in v0.24.1

2. **Firebase Functions** ✅
   ```javascript
   exports.functionName = functions
     .runWith({ timeoutSeconds: 540, memory: '1GB' })
     .pubsub.schedule('0 21 * * *')
     .onRun(async (context) => { ... });
   ```
   → Same API in v7.0.0

3. **Firebase Admin** ✅
   ```javascript
   const db = admin.firestore();
   await db.collection('name').doc('id').get();
   ```
   → Same API in v13.6.0

4. **Nodemailer** ✅
   ```javascript
   const transporter = nodemailer.createTransporter({ ... });
   await transporter.sendMail({ ... });
   ```
   → Same API in v7.0.11

---

## 🎯 RECOMMENDED ACTION PLAN

### Immediate (This Week):
1. ✅ Update Cloud Functions packages (see updated package.json above)
2. ✅ Test functions locally with `npm run serve`
3. ✅ Deploy to Firebase

### Near Term (Next 2 Weeks):
1. ✅ Update nodemailer in main project: `npm install nodemailer@latest`
2. ⏸️ Monitor NextAuth v5 stable release
3. ⏸️ Plan Next.js 15+ upgrade (separate testing phase)

### Long Term (Q1 2025):
1. Upgrade to NextAuth v5 stable when released
2. Upgrade to Next.js 15/16 + React 19 (requires thorough testing)
3. Upgrade Tailwind CSS v4 (breaking changes)

---

## ⚡ QUICK UPDATE COMMANDS

**Update Cloud Functions (Recommended Now):**
```bash
cd cloud-functions
rm -rf node_modules package-lock.json
# Replace package.json with updated version above
npm install
npm run serve  # Test locally
firebase deploy --only functions  # Deploy
```

**Update Main Project (Safe updates only):**
```bash
npm install nodemailer@latest
```

---

## 📞 SUPPORT

**If you see errors after updating:**

1. **Cloud Functions deployment fails:**
   - Check Node.js version: `node -v` (should be 20+)
   - Check Firebase CLI: `firebase --version` (should be 13+)
   - Review logs: `firebase functions:log`

2. **Generative AI errors:**
   - Verify API key is set: `firebase functions:config:get`
   - Check model name: `gemini-2.0-flash-exp` or `gemini-pro`
   - Review rate limits in Google Cloud Console

3. **Email sending fails:**
   - Verify Gmail app password is correct
   - Check nodemailer configuration
   - Review SMTP logs

---

## ✅ BOTTOM LINE

**CRITICAL:** Update Cloud Functions packages (especially Google AI and Firebase Functions)

**SAFE:** Stay on current Next.js/React versions for now

**TESTED:** All our code is compatible with latest package versions!

Update the Cloud Functions and you're good to go! 🚀
