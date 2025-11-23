# Google Dialogflow Chatbot - Complete Implementation Guide

## ✅ Implementation Completed!

I've already integrated Dialogflow into your website. Here's what's been done:

### Files Created:
1. ✅ `/components/dialogflow-chat.tsx` - Chatbot component
2. ✅ Updated `/app/layout.tsx` - Added chatbot to all pages

### What You Need to Do:

---

## Step 1: Enable Dialogflow API (2 minutes)

1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Make sure your **NRIWealthPartners project** is selected (top left dropdown)
3. Click hamburger menu (☰) → **APIs & Services** → **Library**
4. Search for: `Dialogflow API`
5. Click on **Dialogflow API**
6. Click the **Enable** button
7. Wait 30 seconds for activation

---

## Step 2: Create Your Dialogflow Agent (10 minutes)

1. Go to **Dialogflow CX**: https://dialogflow.cloud.google.com/cx
2. Click **Create Agent**
3. Fill in:
   - **Display Name**: `NRI Wealth Assistant`
   - **Location**: `us-central1` (or closest to your users)
   - **Time Zone**: `(GMT-5:00) America/New_York` (or your preference)
   - **Default Language**: `English`
4. Click **Create**

---

## Step 3: Build Your Chatbot (30 minutes)

### Create Intents & Responses

Click **Manage** → **Intents** → **Create** for each:

#### Intent 1: Welcome
- **Display Name**: `welcome`
- **Training Phrases** (click Add):
  ```
  Hello
  Hi
  Hey
  Good morning
  I need help
  Start
  ```
- **Response**:
  ```
  Welcome to NRI Wealth Partners! 👋

  I'm your virtual assistant, here to help with:
  • Investment Advisory
  • Tax Planning
  • Compliance Services
  • Moving Back to India

  What would you like to know about?
  ```

#### Intent 2: Services
- **Display Name**: `services`
- **Training Phrases**:
  ```
  What services do you offer?
  How can you help me?
  What do you do?
  Tell me about your services
  Your offerings
  ```
- **Response**:
  ```
  We provide comprehensive wealth management for NRIs:

  💰 Investment Advisory - Mutual Funds, AIFs, PMS
  📊 Tax Planning - DTAA, FEMA compliance
  🌐 NRI Compliance - FATCA, CRS, Repatriation
  ✈️ Moving Back to India - RNOR status planning
  👨‍👩‍👧‍👦 Virtual Family Office - Holistic wealth management

  Which service interests you?
  ```

#### Intent 3: Investment
- **Display Name**: `investment`
- **Training Phrases**:
  ```
  I want to invest
  Investment options
  Mutual funds
  Where should I invest?
  SIP
  Stock market
  ```
- **Response**:
  ```
  We offer multiple investment options for NRIs:

  📈 Mutual Funds (AMFI registered)
  💎 Alternative Investments (AIFs, PMS)
  🏛️ GIFT City products
  📊 Equity advisory

  What's your investment goal?
  - Retirement planning
  - Children's education
  - Wealth creation

  I can connect you with our expert advisors!
  ```

#### Intent 4: Tax Planning
- **Display Name**: `tax-planning`
- **Training Phrases**:
  ```
  Tax planning
  Help with taxes
  NRI tax filing
  DTAA
  Tax optimization
  How are NRIs taxed?
  ```
- **Response**:
  ```
  Our expert CA provides NRI tax planning:

  ✅ India-US tax treaty optimization (DTAA)
  ✅ FEMA compliance consulting
  ✅ TDS advisory
  ✅ Capital gains tax planning
  ✅ Income tax return filing

  📅 Book a free consultation: nriwealthpartners.com/contact
  📞 Call: +91 9974742626
  ```

#### Intent 5: Compliance
- **Display Name**: `compliance`
- **Training Phrases**:
  ```
  FEMA compliance
  FATCA
  Repatriation
  NRE NRO account
  CRS
  What is FEMA?
  ```
- **Response**:
  ```
  We help with all NRI compliance requirements:

  ✅ FEMA compliance consulting
  ✅ FATCA and CRS reporting
  ✅ Fund repatriation guidance
  ✅ NRE/NRO/FCNR account advisory

  Stay compliant, stress-free!

  Need immediate help? Contact us:
  📧 support@nriwealthpartners.com
  📞 +91 9974742626
  ```

#### Intent 6: Moving Back
- **Display Name**: `moving-back`
- **Training Phrases**:
  ```
  Moving back to India
  Returning to India
  RNOR status
  Relocating to India
  Coming back home
  ```
- **Response**:
  ```
  We specialize in helping NRIs return to India! 🇮🇳

  Our services include:
  ✈️ RNOR status planning
  💰 Fund repatriation
  📊 Investment restructuring
  📋 Tax residency planning

  When are you planning to return? Let's schedule a consultation to discuss your transition!
  ```

#### Intent 7: Contact
- **Display Name**: `contact`
- **Training Phrases**:
  ```
  Talk to advisor
  Book consultation
  Call me
  Schedule meeting
  Contact you
  How do I reach you?
  ```
- **Response**:
  ```
  Let's connect! Here are your options:

  📅 Free Consultation: nriwealthpartners.com/contact
  📞 Phone: +91 9974742626
  💬 WhatsApp: Click the green button on our website
  📧 Email: support@nriwealthpartners.com

  Office Hours: Mon-Sat, 9 AM - 6 PM IST

  What time works best for you?
  ```

#### Intent 8: Pricing
- **Display Name**: `pricing`
- **Training Phrases**:
  ```
  How much do you charge?
  Your fees
  Pricing
  Cost
  How much does it cost?
  ```
- **Response**:
  ```
  Our pricing is transparent and competitive:

  ✅ FREE initial consultation
  ✅ Customized pricing based on your needs
  ✅ No hidden charges

  Fee structure varies by service. I recommend a quick call with our team to get a personalized quote.

  Book your free consultation: nriwealthpartners.com/contact
  ```

---

## Step 4: Get Your Agent ID (2 minutes)

1. In Dialogflow CX console, click **Settings** (⚙️ icon, top right)
2. Find **Agent ID** (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)
3. **Copy** the Agent ID

---

## Step 5: Configure Your Website (2 minutes)

1. Open your project folder
2. Find or create `.env.local` file
3. Add this line:

```env
NEXT_PUBLIC_DIALOGFLOW_AGENT_ID=your-agent-id-here
```

Example:
```env
NEXT_PUBLIC_DIALOGFLOW_AGENT_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

4. Save the file
5. Restart your development server:
```bash
npm run dev
```

---

## Step 6: Test Your Chatbot (5 minutes)

### Test in Dialogflow Console:
1. Click **Test Agent** (top right in Dialogflow)
2. Try these queries:
   - "Hello"
   - "What services do you offer?"
   - "Help with tax planning"
   - "I want to invest"
   - "Book a consultation"

### Test on Your Website:
1. Go to http://localhost:3000
2. Look for the chat widget (bottom right)
3. Click to open
4. Try the same queries
5. Verify responses match what you configured

---

## Advanced Configuration (Optional)

### Add Multilingual Support

1. In Dialogflow console, click **Manage** → **Agent Settings**
2. Click **Add Language**
3. Select languages (e.g., Hindi, Gujarati)
4. Create translations for each intent

### Add Rich Responses

In intent responses, click **Add Response** → **Custom Payload**:

```json
{
  "richContent": [
    [
      {
        "type": "chips",
        "options": [
          {
            "text": "Investment Services"
          },
          {
            "text": "Tax Planning"
          },
          {
            "text": "Book Consultation"
          }
        ]
      }
    ]
  ]
}
```

### Enable Analytics

1. Go to **Analyze** tab in Dialogflow
2. View:
   - Session count
   - Popular intents
   - Unhandled queries
3. Use insights to improve your bot

---

## Customization Guide

### Change Colors (Match Your Brand)

The chatbot already uses your brand colors (Navy & Gold). To customize further, edit `/components/dialogflow-chat.tsx`:

```typescript
--df-messenger-bot-message: #1e3a8a;           // Navy
--df-messenger-button-titlebar-color: #1e3a8a; // Navy
--df-messenger-user-message: #d4af37;          // Gold
```

### Change Chat Icon

Update in `/components/dialogflow-chat.tsx`:
```typescript
chat-icon="https://nriwealthpartners.com/images/logos/logo.png"
```

### Change Position

Add this to the styling section:
```css
df-messenger {
  --df-messenger-bot-message: #1e3a8a;
  z-index: 999;
  position: fixed;
  bottom: 20px;
  right: 20px; /* Change to 'left: 20px' for left side */
}
```

---

## Cost Management

### Free Tier
- **1,000 text requests per month** = FREE
- **10,000+ requests** = $0.007 per request

### Expected Costs (Monthly)
- **100 conversations**: $0 (free tier)
- **2,000 conversations**: $7
- **5,000 conversations**: $28

### Set Budget Alerts
1. Go to Google Cloud Console
2. **Billing** → **Budgets & alerts**
3. Create budget for Dialogflow API
4. Set alert at $10, $25, etc.

---

## Troubleshooting

### Chatbot Not Appearing
**Issue**: Chat widget doesn't show on website
**Solutions**:
1. ✅ Check `NEXT_PUBLIC_DIALOGFLOW_AGENT_ID` is set in `.env.local`
2. ✅ Restart development server (`npm run dev`)
3. ✅ Check browser console for errors
4. ✅ Verify Dialogflow API is enabled

### Chatbot Not Responding
**Issue**: Widget appears but doesn't respond
**Solutions**:
1. ✅ Verify Agent ID is correct
2. ✅ Check that intents are created in Dialogflow
3. ✅ Test in Dialogflow console first
4. ✅ Check Dialogflow logs for errors

### Wrong Responses
**Issue**: Bot gives incorrect answers
**Solutions**:
1. ✅ Add more training phrases to intents
2. ✅ Check for conflicting intents
3. ✅ Review and update responses
4. ✅ Use **Analyze** tab to see what users ask

---

## Deployment to Google Cloud Run

### Set Environment Variable

When deploying, add the Agent ID:

```bash
gcloud run services update nriwealthpartners \
  --update-env-vars NEXT_PUBLIC_DIALOGFLOW_AGENT_ID=your-agent-id-here
```

Or in Google Cloud Console:
1. Go to **Cloud Run**
2. Select your service
3. Click **Edit & Deploy New Revision**
4. **Variables & Secrets** tab
5. Add: `NEXT_PUBLIC_DIALOGFLOW_AGENT_ID` = `your-agent-id`
6. Deploy

---

## Monitoring & Analytics

### View Chat Analytics
1. Dialogflow console → **Analyze** tab
2. See:
   - Total sessions
   - Popular intents
   - Unhandled queries (questions bot couldn't answer)
   - Average session length

### Improve Based on Data
- Check "Unhandled queries" weekly
- Add new intents for common questions
- Refine existing responses
- Add training phrases

---

## Next Steps Checklist

- [ ] Enable Dialogflow API in Google Cloud
- [ ] Create Dialogflow CX agent
- [ ] Add all 8 intents with responses
- [ ] Copy Agent ID
- [ ] Add Agent ID to `.env.local`
- [ ] Test in Dialogflow console
- [ ] Test on your website
- [ ] Deploy to production
- [ ] Monitor analytics weekly
- [ ] Improve based on user queries

---

## Support & Resources

- **Dialogflow Documentation**: https://cloud.google.com/dialogflow/cx/docs
- **Training**: https://www.cloudskillsboost.google/paths/12
- **Community**: https://www.googlecloudcommunity.com/gc/Dialogflow/bd-p/cloud-ai-chatbots
- **Pricing**: https://cloud.google.com/dialogflow/pricing

---

## Alternative: Quick Setup with Dialogflow ES

If you want an even simpler setup, use Dialogflow ES instead:

1. Go to: https://dialogflow.cloud.google.com/
2. Create agent (not CX)
3. Use simpler interface
4. Same integration code works

**Trade-off**: Less advanced features, but easier to start

---

## Comparison with WhatsApp Button

Your site now has BOTH:
- **WhatsApp Button** (bottom right) - Direct human contact
- **AI Chatbot** (Dialogflow widget) - Automated responses

They complement each other:
- Simple questions → Chatbot answers instantly
- Complex queries → Chatbot suggests WhatsApp/call
- Outside business hours → Chatbot always available

---

You're all set! The chatbot is ready to go once you complete the configuration steps above. 🎉
