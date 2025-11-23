# ⚡ AI Chatbot - Quick Setup (5 Minutes)

## What You Need

Your AI chatbot is **already installed** and ready to go! You just need to add one API key.

---

## Step 1: Get Your Google AI API Key (2 minutes)

1. Visit: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account (saurabh@nriwealthpartners.com recommended)
3. Click **"Create API Key"**
4. Select your Google Cloud project (or create new one)
5. Copy the API key (starts with `AIza...`)

---

## Step 2: Add API Key to .env.local (1 minute)

1. Open `.env.local` in your project root
2. Find this line:
   ```env
   GOOGLE_AI_API_KEY=
   ```
3. Paste your API key after the `=`:
   ```env
   GOOGLE_AI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Save the file

---

## Step 3: Restart Server (1 minute)

```bash
# Kill current server
pkill -f "next dev"

# Start fresh
npm run dev
```

---

## Step 4: Test (1 minute)

1. Open **http://localhost:3000**
2. Look for blue **"AI Assistant"** button (bottom right corner)
3. Click to open chatbot
4. Enter your email
5. Ask: **"What services do you offer for NRIs?"**

---

## ✅ Done!

Your AI chatbot is now live with:
- ✅ Email validation
- ✅ Conversation storage
- ✅ Context-aware responses
- ✅ Google Gemini 2.0 AI

**Cost**: $0/month (free tier: 1.5M requests/month)

---

## Optional: Archive Conversations to Google Sheets

If you want to save all conversations to Google Sheets for review:

**Read**: `AI_CHATBOT_SETUP_GUIDE.md` (section: Google Sheets Archiving)

**Time**: +15 minutes
**Cost**: Free

---

## Need Help?

**Full Documentation**: `AI_CHATBOT_SETUP_GUIDE.md`
**Support**: saurabh@nriwealthpartners.com

---

## Important: Using Latest SDK

This chatbot uses **`@google/genai`** - Google's new unified SDK.

**Why this matters:**
- ✅ Latest Gemini 2.0+ features
- ✅ Better performance
- ✅ Actively maintained
- ✅ Supports both Gemini API and Vertex AI

**Old SDK (`@google/generative-ai`)** is deprecated and stops working August 31, 2025.

**Sources:**
- [@google/genai npm package](https://www.npmjs.com/package/@google/genai)
- [Google Gen AI SDK Documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/sdks/overview)
- [GitHub - js-genai](https://github.com/googleapis/js-genai)
