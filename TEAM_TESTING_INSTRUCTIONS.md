# Team Testing Instructions

## 🎯 What to Test

Your website has been updated with 12 new features plus AI chatbot integration. Please test everything thoroughly!

---

## Access Information

### Local Testing (Development)
**URL**: Will be provided after deployment
- Format: `http://192.168.x.x:3000` (your local network)
- Or: `https://xxxxx.ngrok.io` (if using ngrok for remote access)

### Production Testing (Live Site)
**URL**: https://nriwealthpartners.com
- Or Cloud Run URL: https://nriwealthpartners-xxxxx.run.app

---

## Testing Checklist

### 1. Homepage Updates ✅

**Navigate to**: Homepage (/)

**Check for:**
- [ ] New hero headline: "Full-service wealth, tax & compliance solutions for NRIs worldwide"
- [ ] Compliance section (FEMA, FATCA, CRS, Repatriation)
- [ ] Virtual Family Office section (dark blue background)
- [ ] Products overview section (GIFT City, Mutual Funds, AIFs)
- [ ] Success Stories section (3 case studies)
- [ ] All sections load without errors
- [ ] Mobile responsive design works

**How to test:**
1. Scroll through the entire homepage
2. Verify all new sections appear
3. Check on mobile device (or resize browser window)

---

### 2. Services Page Updates ✅

**Navigate to**: /services

**Check for NEW services:**
- [ ] NRI Compliance & Regulatory Services
- [ ] Moving Back to India
- [ ] Alternative Investments & GIFT City
- [ ] Virtual Family Office

**How to test:**
1. Go to Services page
2. Scroll through all service cards
3. Verify 4 new services are added
4. Click "Get Started" buttons (should go to contact page)

---

### 3. About Us Page Updates ✅

**Navigate to**: /about

**Check for:**
- [ ] Vision appears BEFORE Mission (correct order)
- [ ] Team description: "We are a young, energetic team working across tax, investments and compliance"
- [ ] Team photos display correctly
- [ ] All text is readable

**How to test:**
1. Go to About Us page
2. Look at Vision/Mission section (Vision should be on left)
3. Scroll to team section
4. Read the team description

---

### 4. Resources Page Updates ✅

**Navigate to**: /resources

**Check for NEW resources:**
- [ ] "NRI Tax Guide 2024-25" (should be first)
- [ ] "Repatriation Checklist for NRIs" (should be second)
- [ ] Both show as "PDF Guide" and "Checklist"

**How to test:**
1. Go to Resources page
2. Look at the resource cards
3. Verify two new resources at the top

---

### 5. Contact Form Testing 📧

**Navigate to**: /contact

**Test steps:**
1. Fill out the contact form with:
   - Your real email address
   - Your name
   - A test message
2. Click "Send Message"
3. Check for success message
4. **Check TWO email inboxes:**
   - ✅ Your personal email (should get "Thank you" confirmation)
   - ✅ support@nriwealthpartners.com (should get notification)

**Expected result:**
- Form submits successfully
- Success message appears
- Two emails sent (one to you, one to support)

**If emails don't arrive:**
- Check spam folder
- Wait 2-3 minutes
- Report to development team

---

### 6. Webinar Registration Testing 📅

**Navigate to**: /webinars

**Test steps:**
1. Click "Register Now" on any upcoming webinar
2. It should open a Google Form (current behavior)
3. Fill out the form
4. Submit

**Note**: Email confirmations for webinars will be enabled once email is configured. For now, just verify the registration form loads.

---

### 7. WhatsApp Widget Testing 💬

**Check on ALL pages:**

**Test steps:**
1. Look for green WhatsApp button (bottom right corner)
2. Hover over it or wait a few seconds
3. Should see a popup: "Chat with our NRI wealth specialist anytime"
4. Click the WhatsApp button
5. Should open WhatsApp with pre-filled message

**Expected result:**
- WhatsApp widget appears on every page
- Clicking opens WhatsApp Web or app
- Message says: "Hello, I would like to know more about your NRI wealth management services."

---

### 8. AI Chatbot Testing 🤖

**Note**: Chatbot will appear once Dialogflow is configured

**When enabled, test:**
1. Look for chat widget (bottom right, near WhatsApp)
2. Click to open
3. Try these questions:
   - "What services do you offer?"
   - "Help with tax planning"
   - "I want to invest in India"
   - "Moving back to India"
4. Verify responses make sense

**If chatbot doesn't appear:**
- That's normal - it needs to be configured first
- Skip this test for now

---

### 9. Navigation & Links Testing 🔗

**Test ALL navigation links:**

**Header menu:**
- [ ] Home
- [ ] About
- [ ] Services
- [ ] Calculators
- [ ] Resources
- [ ] Webinars
- [ ] Contact

**Footer links:**
- [ ] Quick Links section
- [ ] Services section
- [ ] Legal section (Privacy Policy, SEBI Disclaimer)
- [ ] Social media icons (if present)

**How to test:**
1. Click each link in header menu
2. Verify page loads correctly
3. Click each link in footer
4. Verify no broken links

---

### 10. Mobile Responsiveness Testing 📱

**Test on multiple devices:**

**Desktop/Laptop:**
- [ ] Full-width layout works
- [ ] All sections visible
- [ ] Images load properly

**Tablet:**
- [ ] Layout adjusts correctly
- [ ] Navigation menu works
- [ ] Forms are usable

**Mobile Phone:**
- [ ] Mobile menu (hamburger icon) works
- [ ] Text is readable
- [ ] Buttons are clickable
- [ ] Forms work properly
- [ ] Images scale correctly

**How to test:**
1. Open site on your phone
2. Navigate through all pages
3. Try submitting contact form
4. Check that everything is readable and clickable

---

### 11. Performance Testing ⚡

**Check:**
- [ ] Pages load within 2-3 seconds
- [ ] No extremely slow pages
- [ ] Images appear quickly
- [ ] Smooth scrolling

**How to test:**
1. Open site in incognito/private mode (fresh cache)
2. Note how long homepage takes to load
3. Navigate to different pages
4. Report any very slow pages

---

### 12. Browser Compatibility Testing 🌐

**Test on multiple browsers:**
- [ ] Google Chrome
- [ ] Safari
- [ ] Firefox
- [ ] Edge
- [ ] Mobile browsers (Chrome, Safari)

**How to test:**
1. Open site in each browser
2. Do a quick navigation test
3. Check if any features don't work
4. Report browser-specific issues

---

## Common Issues to Watch For

### Visual Issues
- ❌ Broken images (image icons instead of photos)
- ❌ Overlapping text
- ❌ Buttons too small on mobile
- ❌ Wrong colors or fonts
- ❌ Sections missing

### Functional Issues
- ❌ Links don't work (404 errors)
- ❌ Forms don't submit
- ❌ Buttons don't click
- ❌ Dropdown menus don't open
- ❌ Search not working (if applicable)

### Content Issues
- ❌ Spelling mistakes
- ❌ Incorrect information
- ❌ Missing content
- ❌ Placeholder text (Lorem ipsum)
- ❌ Outdated information

---

## How to Report Issues

### For Each Issue Found:

**Provide:**
1. **Page URL** (which page?)
2. **What's wrong?** (describe the problem)
3. **Expected behavior** (what should happen?)
4. **Screenshots** (if visual issue)
5. **Browser/Device** (what you're using)
6. **Steps to reproduce** (how to see the issue)

### Example Good Bug Report:

```
Page: /services
Issue: "Alternative Investments" card has typo
Expected: "Portfolio Management Services"
Actual: "Protfolio Management Services" (missing 'r')
Screenshot: [attach image]
Browser: Chrome on Windows
Steps: Go to /services, scroll to Alternative Investments card
```

### Example Bad Bug Report:

```
The website is broken
```

---

## Priority Testing Order

### Phase 1: Critical (Test First) ⚠️
1. Homepage loads
2. Contact form works
3. Navigation works
4. Mobile responsive

### Phase 2: Important (Test Second) 📋
1. All new sections appear
2. Services page updates
3. About Us updates
4. Resources updates

### Phase 3: Nice to Have (Test Third) ✨
1. WhatsApp widget
2. Email confirmations
3. Chatbot (when enabled)
4. Performance

---

## Testing Timeline

**Day 1: Initial Testing (2 hours)**
- Test all pages on desktop
- Test contact form
- Check all new features visible

**Day 2: Mobile Testing (1 hour)**
- Test on phones/tablets
- Check mobile menu
- Test forms on mobile

**Day 3: Final Review (30 minutes)**
- Re-test any reported issues
- Verify fixes
- Give final approval

---

## Sign-Off Checklist

Before approving for production:
- [ ] All pages load correctly
- [ ] No broken links found
- [ ] Contact form works
- [ ] Mobile version works
- [ ] New features are visible
- [ ] No major visual issues
- [ ] Performance is acceptable
- [ ] Email confirmations work (if configured)

---

## Questions?

**Contact:**
- Development Team: [contact info]
- Project Manager: [contact info]

**Resources:**
- Full feature list: See IMPLEMENTATION_SUMMARY.md
- Deployment guide: See DEPLOYMENT_GUIDE.md

---

Thank you for testing! Your feedback helps us ensure a smooth launch. 🚀
