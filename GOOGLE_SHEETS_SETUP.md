# 📊 Google Sheets Setup for Conversation Archiving

## What Is This?

This optional feature saves all chatbot conversations to a Google Sheet, allowing you to:
- Review customer questions
- Identify common concerns
- Follow up with interested leads
- Improve your services based on feedback

**Cost:** Free
**Time:** 15 minutes
**Required:** No (chatbot works without it)

---

## Step 1: Create Google Sheet (2 minutes)

### 1.1 Create New Spreadsheet

1. Go to **https://sheets.google.com**
2. Sign in with **saurabh@nriwealthpartners.com**
3. Click **"+ Blank"** to create new spreadsheet
4. Name it: **"NRI Chatbot Conversations"**

### 1.2 Add Headers

In Row 1, add these column headers:

| Column A | Column B | Column C | Column D | Column E |
|----------|----------|----------|----------|----------|
| Timestamp | User Email | User Message | AI Response | Conversation History |

**Exactly like this:**
```
A1: Timestamp
B1: User Email
C1: User Message
D1: AI Response
E1: Conversation History
```

---

## Step 2: Get Sheet ID (1 minute)

### 2.1 Copy Sheet ID from URL

Your Google Sheet URL looks like this:
```
https://docs.google.com/spreadsheets/d/1ABC123XYZ456DEF789/edit
                                      ^^^^^^^^^^^^^^^^^^
                                      This is your Sheet ID
```

**Example:**
- URL: `https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit`
- Sheet ID: `1a2b3c4d5e6f7g8h9i0j`

**Copy this ID** - you'll need it in Step 4.

---

## Step 3: Enable Google Sheets API (5 minutes)

### 3.1 Go to Google Cloud Console

1. Visit: **https://console.cloud.google.com**
2. Sign in with **saurabh@nriwealthpartners.com**
3. Select your project (same one you used for AI API key)

### 3.2 Enable Sheets API

1. In the search bar at top, type: **"Google Sheets API"**
2. Click on **"Google Sheets API"** in results
3. Click **"Enable"** button
4. Wait 10-20 seconds for activation

### 3.3 Create API Key

1. Go to **APIs & Services** → **Credentials** (left sidebar)
2. Click **"+ Create Credentials"** (top of page)
3. Select **"API Key"**
4. A popup will show your API key - **Copy it!**
5. Click **"Restrict Key"** (recommended for security)

### 3.4 Restrict API Key (Optional but Recommended)

1. Under "Application restrictions": Select **"None"**
2. Under "API restrictions":
   - Select **"Restrict key"**
   - Check **"Google Sheets API"**
   - Check **"Generative Language API"** (for the chatbot)
3. Click **"Save"**

You now have your Sheets API Key!

---

## Step 4: Add to Environment Variables (2 minutes)

### 4.1 Open .env.local

Open `.env.local` file in your project root.

### 4.2 Add Sheet ID and API Key

Find these lines (around line 19-21):
```env
# Optional: Google Sheets for conversation archiving
GOOGLE_SHEETS_ID=
GOOGLE_SHEETS_API_KEY=
```

Update them with your values:
```env
# Optional: Google Sheets for conversation archiving
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_SHEETS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important:**
- Use the **Sheet ID** (not the full URL)
- Use the **Sheets API key** (different from your AI API key)

### 4.3 Save File

Save `.env.local`

---

## Step 5: Restart Server (1 minute)

```bash
# Stop current server
pkill -f "next dev"

# Start fresh
npm run dev
```

---

## Step 6: Test (2 minutes)

### 6.1 Test Chatbot

1. Open **http://localhost:3000**
2. Click **"AI Assistant"** button
3. Enter your email
4. Send a test message: "What services do you offer?"
5. Get a response from AI

### 6.2 Check Google Sheet

1. Go to your Google Sheet
2. Refresh the page
3. You should see a new row with:
   - Timestamp (when you sent the message)
   - Your email
   - Your question
   - AI's response
   - Full conversation history (JSON format)

**If you see the data:** ✅ Success! Archiving is working!

**If no data appears:** Check troubleshooting below.

---

## Troubleshooting

### No Data Appearing in Sheet

**Check 1: API Key Permissions**
- Make sure Sheet ID is correct (check URL)
- Verify API key has Sheets API enabled
- Try creating a new API key

**Check 2: Sheet Headers**
- Column A must be exactly "Timestamp"
- Column B must be exactly "User Email"
- Check spelling and capitalization

**Check 3: Server Logs**
```bash
# Check for errors
tail -50 dev-server.log
```

Look for messages like:
- "Failed to save to Google Sheets"
- "403 Forbidden"
- "Invalid API key"

**Check 4: Browser Console**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Send a chat message
4. Look for "Conversation archived:" log

### 403 Forbidden Error

**Cause:** API key doesn't have permission

**Fix:**
1. Go to Google Cloud Console → Credentials
2. Edit your API key
3. Make sure "Google Sheets API" is enabled
4. Save and wait 2-3 minutes
5. Try again

### Sheet Permission Error

**Cause:** Sheet might be private

**Fix:**
1. Open your Google Sheet
2. Click **"Share"** button (top-right)
3. Under "Get link" → Change to **"Anyone with the link"** → **"Viewer"**
4. Copy the link
5. Click **"Done"**

**Note:** This is optional - the API key should work without making it public.

---

## What Gets Stored

### Row Format

Each chat message creates one row:

| Timestamp | User Email | User Message | AI Response | Conversation History |
|-----------|------------|--------------|-------------|----------------------|
| 2025-01-22T10:30:45.123Z | user@example.com | What services do you offer? | We offer NRI Investment Advisory... | [{"role":"user","content":"What..."}] |

### Example Data

```
Timestamp: 2025-01-22T10:30:45.123Z
User Email: saurabh@nriwealthpartners.com
User Message: What services do you offer for NRIs?
AI Response: We offer comprehensive services including NRI Investment Advisory, Tax Planning, Mutual Funds, and more...
Conversation History: [{"role":"user","content":"What services..."}]
```

---

## Viewing & Analyzing Data

### Filter by Date

1. Select **"Timestamp"** column (Column A)
2. Click **Data** → **Create a filter**
3. Click filter icon on "Timestamp" header
4. Select date range

### Search by Email

1. Use **Ctrl+F** (Windows) or **Cmd+F** (Mac)
2. Type email address
3. See all conversations from that user

### Export Data

1. Click **File** → **Download**
2. Choose format: Excel, CSV, or PDF
3. Use for reporting or analysis

---

## Privacy & Security

### What's Stored
- User email addresses
- Chat messages (questions and answers)
- Timestamps
- Conversation context

### What's NOT Stored
- Passwords
- Financial details
- Personal identification numbers
- Payment information

### Data Retention

**Recommended:** Keep for 6-12 months, then archive or delete.

**To delete:**
1. Select rows to delete
2. Right-click → **Delete rows**
3. Or clear entire sheet: Select all → Delete

### Access Control

**Who can see the data:**
- Only people with Google Sheet access
- Default: Just you (saurabh@nriwealthpartners.com)

**To share with team:**
1. Click **"Share"** button
2. Add team member's email
3. Set permission: **"Viewer"** or **"Editor"**
4. Click **"Send"**

---

## Cost

**Google Sheets API:**
- Free tier: Unlimited reads/writes for personal use
- Rate limit: 100 read requests per 100 seconds per user
- Cost for your volume: **$0/month**

**Expected Usage:**
- 50-100 chats/day = 50-100 writes/day
- Well within free tier
- No charges expected

---

## Alternative: Console Logging Only

### If You Skip Google Sheets

If you don't set up Google Sheets, conversations are still logged to the server console.

**To view:**
```bash
# Watch live logs
tail -f dev-server.log | grep "Conversation archived"
```

**Example output:**
```
Conversation archived: {
  email: 'user@example.com',
  timestamp: '2025-01-22T10:30:45.123Z',
  messageCount: 2
}
```

**Pros:**
- No setup required
- Works immediately
- Free

**Cons:**
- Harder to review later
- Lost when server restarts
- Not shareable with team

---

## Summary

### Setup Checklist

- [ ] Create Google Sheet named "NRI Chatbot Conversations"
- [ ] Add headers in Row 1 (Timestamp, User Email, User Message, AI Response, Conversation History)
- [ ] Copy Sheet ID from URL
- [ ] Go to Google Cloud Console
- [ ] Enable Google Sheets API
- [ ] Create API Key
- [ ] (Optional) Restrict key to Sheets API
- [ ] Add GOOGLE_SHEETS_ID to .env.local
- [ ] Add GOOGLE_SHEETS_API_KEY to .env.local
- [ ] Restart server
- [ ] Test chatbot
- [ ] Check Google Sheet for new row

### Time: 15 minutes

### Cost: $0/month

### Required: No (optional feature)

---

## Quick Reference

### Get Sheet ID

From URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`

### Enable Sheets API

1. Google Cloud Console
2. Search "Google Sheets API"
3. Click "Enable"
4. Create API Key

### Add to .env.local

```env
GOOGLE_SHEETS_ID=your-sheet-id-here
GOOGLE_SHEETS_API_KEY=AIzaSyBxxxxxxxxxxx
```

### Restart Server

```bash
pkill -f "next dev" && npm run dev
```

---

## Need Help?

**Documentation:**
- This guide
- `AI_CHATBOT_SETUP_GUIDE.md` (full guide)
- `CHATBOT_QUICK_SETUP.md` (quick start)

**Troubleshooting:**
- Check browser console (F12)
- Check server logs: `tail -f dev-server.log`
- Verify API key has Sheets API enabled

**Support:**
- Email: saurabh@nriwealthpartners.com

---

🎉 **Done!** Your chatbot conversations will now be automatically saved to Google Sheets!
