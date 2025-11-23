# 📊 AI Chatbot Analytics & Insights System

## Overview

Your AI chatbot now has a complete analytics system that:
- ✅ **Archives every conversation** via email
- ✅ **Analyzes user intent** (High/Medium/Low)
- ✅ **Tracks services mentioned**
- ✅ **Identifies patterns** and trends
- ✅ **Generates business insights** automatically
- ✅ **Emails detailed reports** on demand

---

## What Gets Tracked

### For Each Conversation:

1. **User Information**
   - Email address
   - Timestamp
   - Conversation length

2. **Intent Classification**
   - **High Intent - Ready to Invest**: User ready to take action
   - **Medium Intent - Exploring**: User researching options
   - **Low Intent - General Inquiry**: Just browsing

3. **Services Mentioned** (Journey-Based Categories)

   **Building Wealth:**
   - NRI Investment
   - Mutual Funds
   - Portfolio Management

   **Specialized Solutions:**
   - GIFT City
   - Virtual Family Office

   **Regulatory & Tax:**
   - Tax Planning
   - Compliance (FEMA, FATCA, CRS)

   **Life Transitions:**
   - Moving Back to India
   - Retirement Planning
   - Estate Planning

4. **Full Conversation**
   - All messages (user + AI)
   - Complete context

---

## Email Notifications

### Individual Conversation Emails

**Sent:** After EVERY conversation
**To:** saurabh@nriwealthpartners.com
**Subject:** `💬 Chatbot - user@example.com - High Intent`

**Contains:**
- User email
- Intent level (color-coded: green=high, orange=medium, gray=low)
- Services mentioned
- Latest exchange
- Full conversation history

**Example:**
```
Subject: 💬 Chatbot - john@example.com - High Intent - Ready to Invest

Intent: High Intent - Ready to Invest (green)
Services Mentioned: NRI Investment, Tax Planning

Latest Exchange:
User: I want to invest ₹50 lakhs in India
AI: Great! We help NRIs invest...
```

---

## Analytics Insights Report

### Generate On-Demand Report

Visit: `http://localhost:3000/api/chatbot-insights`

Or use curl:
```bash
curl http://localhost:3000/api/chatbot-insights
```

**You'll receive an email with:**

### 1. Key Metrics Dashboard
- Total conversations
- Unique users
- Average messages per conversation

### 2. Lead Quality Distribution
- High Intent users (🎯 priority follow-up!)
- Medium Intent users (nurture)
- Low Intent users (awareness)

### 3. Most Popular Services
- Ranked by number of inquiries
- Visual bar charts
- Percentage breakdown

### 4. Top Questions Asked
- Most frequently asked questions
- Count for each question
- Use this to create FAQ content!

### 5. Peak Usage Hours
- When users are most active
- Plan team availability
- Optimize response times

### 6. AI-Generated Recommendations
- High-intent leads to follow up
- Content opportunities
- Service promotion ideas
- Timing optimizations

---

## Business Insights Examples

### Insight 1: Lead Quality
```
✅ High Conversion Potential: 12 users showed high purchase intent.
Follow up within 24 hours!
```

**Action:** Email these users personally with consultation offer

### Insight 2: Service Demand
```
📈 Top Service Interest: Tax Planning is generating the most inquiries.
Consider creating targeted content.
```

**Action:** Create blog post, video, or webinar on NRI tax planning

### Insight 3: Timing Optimization
```
⏰ Optimal Response Time: Most conversations happen around 21:00.
Ensure team availability during these hours.
```

**Action:** Schedule team member or set up auto-responses

### Insight 4: FAQ Opportunities
```
❓ FAQ Opportunity: "How do I invest from USA?" asked 8 times.
Add to your FAQ page.
```

**Action:** Create dedicated FAQ page or expand existing one

---

## How to Use the Insights

### Daily (5 minutes)
1. Check email for new conversation notifications
2. Identify **High Intent** users (green)
3. Follow up with personalized emails within 24 hours

### Weekly (15 minutes)
1. Generate insights report: visit `/api/chatbot-insights`
2. Review top questions
3. Update website FAQ or create content
4. Follow up with Medium Intent users

### Monthly (30 minutes)
1. Analyze trends over time
2. Identify growing service interests
3. Plan content calendar based on questions
4. Review and optimize AI responses

---

## Understanding Intent Levels

### 🟢 High Intent - Ready to Invest
**Keywords detected:**
- "ready to invest"
- "want to start"
- "how to begin"
- "schedule consultation"

**What to do:**
- **Priority 1:** Follow up within 24 hours
- Send personalized email
- Offer free consultation
- Provide direct contact number

### 🟠 Medium Intent - Exploring
**Keywords detected:**
- "tell me about"
- "what is"
- "how does"
- "explain"

**What to do:**
- Send educational content
- Share case studies
- Invite to webinar
- Add to nurture email sequence

### ⚪ Low Intent - General Inquiry
**Keywords detected:**
- "curious"
- "just looking"
- "information"

**What to do:**
- Add to newsletter
- Share blog posts
- No immediate follow-up needed

---

## Sample Analytics Report

### Email Report Preview:

```
📊 NRI Wealth Partners - Chatbot Analytics Report
Report Period: 11/15/2025 - 11/22/2025

📈 Key Metrics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Conversations: 45
Unique Users: 32
Avg Messages/Chat: 3.2

🎯 Lead Quality Distribution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
High Intent: 12 (26.7%) 🟢
Medium Intent: 23 (51.1%) 🟠
Low Intent: 10 (22.2%) ⚪

💼 Most Popular Services (Journey-Based)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Regulatory & Tax - Tax Planning - 18 inquiries
2. Building Wealth - NRI Investment - 15 inquiries
3. Specialized - GIFT City - 12 inquiries
4. Building Wealth - Mutual Funds - 10 inquiries
5. Life Transitions - Retirement - 8 inquiries

❓ Top Questions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. "How do I invest from USA?" - 8 times
2. "What is GIFT City?" - 6 times
3. "Help with tax filing" - 5 times
4. "Moving back to India" - 4 times
5. "Retirement planning for NRI" - 3 times

⏰ Peak Usage Hours
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 21:00-22:00 - 12 conversations
2. 20:00-21:00 - 9 conversations
3. 14:00-15:00 - 7 conversations

💡 Key Recommendations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ High Conversion Potential: 12 users ready to invest
📈 Top Service: Tax Planning needs content
⏰ Best Time: Team available 9-10 PM
❓ FAQ Needed: "How to invest from USA" article
```

---

## Compliance & Data Storage

### What Gets Saved:
- **Email Archive:** All conversations in your Gmail (searchable, permanent)
- **Local File:** `chatbot-analytics/conversations.jsonl` (backup)
- **Both contain:** Full conversation + metadata

### Data Retention:
- **Email:** Stored permanently in Gmail (unless you delete)
- **Local File:** Stored indefinitely (can be cleared manually)

### Privacy Compliance:
- User emails collected with consent (they enter it willingly)
- Data used for business analytics only
- No third-party sharing
- Users can request deletion (contact you)

### How to Delete Data:
```bash
# Delete local analytics file
rm -rf chatbot-analytics/

# Email archive: manually delete from Gmail
```

---

## Advanced Usage

### Get Insights Programmatically:
```bash
curl http://localhost:3000/api/chatbot-insights
```

**Response:**
```json
{
  "success": true,
  "message": "Analytics report emailed successfully!",
  "totalConversations": 45,
  "uniqueUsers": 32
}
```

### Schedule Weekly Reports:
Set up a cron job to automatically email reports every Monday:

```bash
# Add to crontab (every Monday at 9 AM)
0 9 * * 1 curl http://localhost:3000/api/chatbot-insights
```

---

## Benefits Summary

### For Compliance ✅
- Complete conversation archive
- Timestamped records
- Easy retrieval via email search
- Export capability

### For Business Intelligence 📊
- Identify hot leads instantly
- Track service demand
- Understand customer needs
- Optimize content strategy
- Plan team availability

### For Sales 💰
- Prioritize high-intent leads
- Personalized follow-up data
- Service interest tracking
- Conversion optimization

### For Marketing 📣
- FAQ content ideas
- Blog post topics
- Webinar themes
- SEO keyword insights

---

## Quick Start

### 1. Test the System (Now)
```bash
# Send a test conversation through the chatbot
# Check your email for conversation notification
```

### 2. Generate First Report
```bash
curl http://localhost:3000/api/chatbot-insights
# Check email for full analytics report
```

### 3. Review Insights (Daily)
- Open conversation emails
- Look for 🟢 High Intent labels
- Follow up with those users first

### 4. Act on Recommendations (Weekly)
- Generate insights report
- Create content based on top questions
- Update FAQ page
- Plan email campaigns

---

## Cost

**Everything included - $0 extra!**
- Email archiving: Free (uses existing Gmail)
- Analytics: Free (local processing)
- Insights reports: Free (automated)

---

## Support

**Questions?**
- Check individual conversation emails for details
- Generate insights report for trends
- Review this guide for interpretation

**Issues?**
- Check `chatbot-analytics/conversations.jsonl` for raw data
- Verify email configuration in `.env.local`
- Contact: saurabh@nriwealthpartners.com

---

🎉 **Your AI chatbot is now a complete business intelligence system!**

Every conversation generates:
1. Immediate email notification with intent analysis
2. Permanent archive for compliance
3. Data for weekly insights reports
4. Actionable business recommendations
