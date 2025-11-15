# 📖 Site Management Guide

Complete guide for managing and updating the NRI Wealth Partners website.

---

## 🎯 Overview

This guide will help you:
- Update webinar links
- Add PDFs to the resources section
- Update contact information
- Modify service offerings
- Add/edit testimonials
- Update team information
- Manage SEO content
- Deploy changes to production

**No coding experience required!** Just follow these step-by-step instructions.

---

## 📋 Table of Contents

1. [Quick Start - How to Make Changes](#quick-start)
2. [Update Webinar Links](#update-webinar-links)
3. [Add PDFs to Resources](#add-pdfs-to-resources)
4. [Update Contact Information](#update-contact-information)
5. [Modify Services](#modify-services)
6. [Update Team Information](#update-team-information)
7. [Add/Edit Testimonials](#addedit-testimonials)
8. [Update Office Hours](#update-office-hours)
9. [Change Social Media Links](#change-social-media-links)
10. [Update SEO Content](#update-seo-content)
11. [Deploy Your Changes](#deploy-your-changes)
12. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Tools You Need

1. **Text Editor**: Visual Studio Code (recommended)
   - Download: https://code.visualstudio.com

2. **GitHub Desktop**: For publishing changes
   - Already installed ✅

3. **Access to Files**:
   - Location: `/Users/jyotikumari/Projects/NRIWealthPartners`

### Basic Workflow

```
1. Open project in VS Code
2. Find the file you want to edit
3. Make your changes
4. Save the file
5. Open GitHub Desktop
6. Review changes
7. Commit with description
8. Push to GitHub
9. Wait 5-10 minutes for auto-deployment
```

---

## 📅 Update Webinar Links

### Current Webinar Locations

Webinars appear in **3 places** on the website:

1. **Home Page Hero Section** - Main call-to-action
2. **Services Page** - Each service section
3. **Footer** - (if you add it)

### Step-by-Step Instructions

#### 1. Update Home Page Webinar Link

**File**: `app/page.tsx`

**Find this line** (around line 13):

```tsx
<Link
  href="https://docs.google.com/forms/d/e/1FAIpQLSfVq..."
  target="_blank"
  rel="noopener noreferrer"
>
```

**Change the `href` value** to your new Google Form or webinar link:

```tsx
<Link
  href="https://YOUR-NEW-WEBINAR-LINK-HERE"
  target="_blank"
  rel="noopener noreferrer"
>
```

**Example**:
```tsx
<Link
  href="https://forms.gle/abc123xyz"
  target="_blank"
  rel="noopener noreferrer"
>
```

#### 2. Update Services Page Webinar Links

**File**: `app/services/page.tsx`

**Search for**: `https://docs.google.com/forms`

You'll find multiple instances. Replace each one with your new link.

**Pro Tip**: Use VS Code's Find & Replace:
- Press `Cmd+F` (Mac) or `Ctrl+F` (Windows)
- Click the arrow to expand Replace
- Enter old link in "Find"
- Enter new link in "Replace"
- Click "Replace All"

---

## 📄 Add PDFs to Resources

### Where Resources Are Stored

PDFs and documents go in: `public/resources/`

### Adding a New PDF

#### Step 1: Add the PDF File

1. **Create folder** (if it doesn't exist):
   ```
   public/resources/
   ```

2. **Copy your PDF** into this folder:
   ```
   public/resources/nri-tax-guide-2024.pdf
   public/resources/investment-checklist.pdf
   ```

3. **File naming best practices**:
   - Use lowercase
   - Use hyphens instead of spaces
   - Be descriptive
   - Include year if applicable

   ❌ Bad: `Tax Guide Final V2.pdf`
   ✅ Good: `nri-tax-guide-2024.pdf`

#### Step 2: Create/Update Resources Page

**Option A: If resources page doesn't exist yet**

Create file: `app/resources/page.tsx`

```tsx
import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"

export const metadata: Metadata = {
  title: "Resources - NRI Wealth Partners",
  description: "Download helpful guides, checklists, and resources for NRI financial planning.",
}

export default function ResourcesPage() {
  const resources = [
    {
      title: "NRI Tax Planning Guide 2024",
      description: "Comprehensive guide to tax planning for NRIs",
      file: "/resources/nri-tax-guide-2024.pdf",
      category: "Tax Planning"
    },
    {
      title: "Investment Checklist for NRIs",
      description: "Essential checklist before making investments in India",
      file: "/resources/investment-checklist.pdf",
      category: "Investment"
    },
    // Add more resources here
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-navy/10 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6">
              Resources
            </h1>
            <p className="text-xl text-gray-700">
              Download helpful guides and resources for your financial planning journey
            </p>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-8 w-8 text-gold mb-4" />
                    <span className="text-xs bg-navy/10 text-navy px-2 py-1 rounded">
                      {resource.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href={resource.file}
                    download
                    className="inline-flex items-center gap-2 bg-gold text-white px-4 py-2 rounded-md hover:bg-gold/90 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

**Option B: If you already have a resources page**

Just add your new resource to the `resources` array:

```tsx
{
  title: "Your New Resource Title",
  description: "Brief description of what this resource covers",
  file: "/resources/your-file-name.pdf",
  category: "Category Name"
}
```

#### Step 3: Update Navigation (Optional)

If resources link doesn't exist in the header, add it:

**File**: `components/navigation/header.tsx`

Find the navigation items section and add:

```tsx
<Link href="/resources" className="text-gray-700 hover:text-gold transition-colors">
  Resources
</Link>
```

---

## 📞 Update Contact Information

### Where Contact Info Appears

Contact information appears in **3 locations**:

1. **Contact Page** (`app/contact/page.tsx`)
2. **Footer** (`components/navigation/footer.tsx`)
3. **Metadata** (for SEO)

### Update Phone Number

**Find and replace in these files**:

```tsx
// Old
+91 9974742626

// New
+91 YOUR-NEW-NUMBER
```

**Files to update**:
- `app/contact/page.tsx` (line 60)
- `components/navigation/footer.tsx` (line 145)

### Update Email Address

**Find and replace**:

```tsx
// Old
support@nriwealthpartners.com

// New
yournewemail@nriwealthpartners.com
```

**Files to update**:
- `app/contact/page.tsx` (line 70)
- `components/navigation/footer.tsx` (line 151)

### Update Office Address

**File**: `app/contact/page.tsx` (line 52)

```tsx
<p className="text-sm text-gray-600">
  Your New Office Address Line 1,<br />
  Address Line 2,<br />
  City, State, India - PIN CODE
</p>
```

**Also update in**: `components/navigation/footer.tsx` (line 140)

### Update WhatsApp Number

**File**: `app/contact/page.tsx` (line 125)

```tsx
href="https://wa.me/919974742626?text=Hello%2C%20I%20would%20like%20to%20know%20more"
```

Change `919974742626` to your WhatsApp number (with country code, no + or spaces).

---

## 🎯 Modify Services

### Where Services Are Defined

**Main File**: `app/services/page.tsx`

### Structure of a Service

Each service has:
- **Icon** - Visual representation
- **Title** - Service name
- **Description** - What you offer
- **Features** - Bullet points
- **CTA Button** - Link to webinar/contact

### Adding a New Service

**Find the services section** (around line 30-200):

```tsx
{/* Add this block anywhere in the services grid */}
<div id="new-service" className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
  <div className="flex items-center gap-4 mb-6">
    <div className="p-3 bg-gold/10 rounded-lg">
      <YourIcon className="h-8 w-8 text-gold" />
    </div>
    <h2 className="text-2xl font-bold text-navy">Your New Service</h2>
  </div>

  <p className="text-gray-700 mb-6">
    Description of your new service and what it includes.
  </p>

  <h3 className="font-semibold text-navy mb-3">Key Features:</h3>
  <ul className="space-y-2 mb-6">
    <li className="flex items-start gap-2">
      <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
      <span className="text-gray-700">Feature 1</span>
    </li>
    <li className="flex items-start gap-2">
      <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
      <span className="text-gray-700">Feature 2</span>
    </li>
  </ul>

  <Link
    href="YOUR-WEBINAR-LINK"
    target="_blank"
    className="inline-flex items-center gap-2 bg-gold text-white px-6 py-3 rounded-md hover:bg-gold/90 transition-colors"
  >
    Learn More
    <ArrowRight className="h-4 w-4" />
  </Link>
</div>
```

### Editing Existing Service

1. **Find the service** by searching for its title
2. **Modify the text** between the tags
3. **Update features** in the `<ul>` section
4. **Change the link** in the `<Link>` component

### Available Icons

Common icons you can use (import from `lucide-react`):

```tsx
import {
  TrendingUp,      // Investments
  PiggyBank,       // Savings
  Home,            // Real Estate
  GraduationCap,   // Education
  Shield,          // Insurance
  Calculator,      // Tax Planning
  Target,          // Goals
  Building2,       // Corporate
  Users,           // Advisory
  DollarSign,      // Finance
} from "lucide-react"
```

---

## 👥 Update Team Information

### Where Team Info Appears

**File**: `app/about/page.tsx`

### Update Team Member Details

**Find the team array** (around line 20):

```tsx
const team = [
  {
    name: "Anil Parekh",
    role: "Founder & CEO",
    credentials: "CA, CFP, SEBI Registered Investment Advisor",
    image: "/images/anil-parekh.jpg",
    bio: "With over 15 years of experience..."
  },
  {
    name: "Avani Parekh",
    role: "Co-Founder & Financial Advisor",
    credentials: "AMFI Registered Mutual Fund Distributor, MBA Finance",
    image: "/images/avani-parekh.jpg",
    bio: "Avani specializes in..."
  }
]
```

### Add a New Team Member

Add to the `team` array:

```tsx
{
  name: "New Member Name",
  role: "Their Position",
  credentials: "Qualifications, Certifications",
  image: "/images/new-member.jpg",
  bio: "Brief professional background and expertise. Keep it 2-3 sentences."
}
```

### Add Team Member Photo

1. **Prepare the photo**:
   - Square format (1:1 ratio) recommended
   - At least 400x400 pixels
   - Professional headshot
   - Save as `.jpg` or `.png`

2. **Add to project**:
   - Copy photo to: `public/images/`
   - Name it clearly: `member-name.jpg`

3. **Update image path** in team array:
   ```tsx
   image: "/images/member-name.jpg"
   ```

---

## ⭐ Add/Edit Testimonials

### Where Testimonials Appear

**File**: `app/page.tsx`

### Find Testimonials Section

Search for: `testimonials` (around line 100-150)

```tsx
const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Software Engineer, USA",
    text: "Their expertise in NRI taxation...",
    rating: 5
  },
  // Add more here
]
```

### Add New Testimonial

```tsx
{
  name: "Client Name",
  location: "Profession, Country",
  text: "Their testimonial quote. Keep it concise and impactful.",
  rating: 5  // 1-5 stars
}
```

### Guidelines for Testimonials

✅ **Do**:
- Use real client feedback
- Keep quotes under 100 words
- Include location/profession
- Vary the testimonials

❌ **Don't**:
- Make up fake testimonials
- Use overly promotional language
- Include sensitive financial details
- Forget to get client permission

---

## ⏰ Update Office Hours

### Where Office Hours Appear

**Files to update**:
1. `app/contact/page.tsx` (lines 93-110)
2. `components/navigation/footer.tsx` (lines 160-162)

### Contact Page - Detailed Hours

**File**: `app/contact/page.tsx`

```tsx
<div className="space-y-2">
  <div className="flex items-center gap-3">
    <Clock className="h-5 w-5 text-gold" />
    <div>
      <p className="font-medium text-gray-900">Monday - Friday</p>
      <p className="text-sm text-gray-600">9:00 AM - 6:00 PM IST</p>
    </div>
  </div>
  <div className="flex items-center gap-3">
    <Clock className="h-5 w-5 text-gold" />
    <div>
      <p className="font-medium text-gray-900">Saturday</p>
      <p className="text-sm text-gray-600">10:00 AM - 2:00 PM IST</p>
    </div>
  </div>
</div>
```

### Footer - Summary Hours

**File**: `components/navigation/footer.tsx`

```tsx
<div className="mt-4">
  <p className="text-xs text-gray-400">Business Hours:</p>
  <p className="text-sm text-gray-300">Mon-Fri: 9:00 AM - 6:00 PM IST</p>
  <p className="text-sm text-gray-300">Sat: 10:00 AM - 2:00 PM IST</p>
</div>
```

---

## 🔗 Change Social Media Links

### Where Social Links Appear

**File**: `components/navigation/footer.tsx` (lines 29-57)

### Update Links

```tsx
<div className="flex space-x-4">
  <a
    href="https://www.linkedin.com/company/your-page"
    className="text-gray-400 hover:text-gold transition-colors"
    aria-label="LinkedIn"
  >
    <Linkedin className="h-5 w-5" />
  </a>
  <a
    href="https://twitter.com/your-handle"
    className="text-gray-400 hover:text-gold transition-colors"
    aria-label="Twitter"
  >
    <Twitter className="h-5 w-5" />
  </a>
  <a
    href="https://www.facebook.com/your-page"
    className="text-gray-400 hover:text-gold transition-colors"
    aria-label="Facebook"
  >
    <Facebook className="h-5 w-5" />
  </a>
  <a
    href="https://www.youtube.com/@your-channel"
    className="text-gray-400 hover:text-gold transition-colors"
    aria-label="YouTube"
  >
    <Youtube className="h-5 w-5" />
  </a>
</div>
```

**Replace** `href="#"` with your actual social media URLs.

### Hiding Social Links

If you don't have a particular social account, remove or comment out that block:

```tsx
{/* Commented out until we have a Twitter account
<a href="#" ...>
  <Twitter className="h-5 w-5" />
</a>
*/}
```

---

## 🔍 Update SEO Content

### What is SEO?

SEO (Search Engine Optimization) helps your website rank higher in Google search results.

### Where SEO Content Is

Every page has metadata at the top:

```tsx
export const metadata: Metadata = {
  title: "Page Title - NRI Wealth Partners",
  description: "Description that appears in Google search results",
}
```

### Update Page Titles

**Format**: `Specific Page Title - NRI Wealth Partners`

**Examples**:
```tsx
// Home page
title: "Expert NRI Wealth Management & Financial Planning - NRI Wealth Partners"

// Services page
title: "Financial Services for NRIs - Investment, Tax & Retirement Planning"

// Contact page
title: "Contact Us - Get in Touch with Our Experts"
```

### Update Meta Descriptions

**Best practices**:
- 150-160 characters
- Include keywords naturally
- Make it compelling
- Include a call-to-action

**Example**:

```tsx
description: "Expert wealth management for NRIs. Tax planning, investments, retirement planning. SEBI registered. Call +91 9974742626 for free consultation."
```

### Files to Update

1. `app/page.tsx` - Home page
2. `app/about/page.tsx` - About Us
3. `app/services/page.tsx` - Services
4. `app/contact/page.tsx` - Contact
5. `app/calculators/page.tsx` - Calculators

---

## 🚀 Deploy Your Changes

### Step-by-Step Deployment Process

#### 1. Save Your Changes

In VS Code:
- `Cmd+S` (Mac) or `Ctrl+S` (Windows)
- Or: File → Save All

#### 2. Open GitHub Desktop

You should see:
- ✅ Changed files listed on the left
- Preview of changes on the right

#### 3. Review Your Changes

**Look for**:
- ❌ Red highlighting = Deleted text
- ✅ Green highlighting = Added text

**Make sure**:
- Only the files you meant to change are listed
- The changes look correct

#### 4. Write a Commit Message

**Bottom left of GitHub Desktop**:

**Summary** (required):
```
Update webinar links for March 2024
```

**Description** (optional but recommended):
```
- Changed home page webinar link
- Updated services page registration forms
- Added new Tax Planning webinar
```

**Commit message best practices**:
- Start with a verb: Update, Add, Fix, Change
- Be specific about what changed
- Keep it under 50 characters for summary

**Examples**:
- ✅ "Add Q1 2024 tax planning guide PDF"
- ✅ "Update office hours for summer schedule"
- ✅ "Fix typo in services page"
- ❌ "changes"
- ❌ "stuff"

#### 5. Commit to Main

Click the blue **"Commit to main"** button

#### 6. Push to GitHub

Click **"Push origin"** button at the top

#### 7. Monitor Deployment

1. **Check Cloud Build**:
   - Go to: https://console.cloud.google.com/cloud-build/builds?project=nri-wealth-partners
   - You should see a new build starting within 30 seconds

2. **Build Progress** (takes 5-10 minutes):
   - ⏳ Cloning repository
   - ⏳ Building Docker image
   - ⏳ Pushing to registry
   - ⏳ Deploying to Cloud Run
   - ✅ Complete!

3. **Verify Changes Live**:
   - Go to: https://nriwealthpartners.com
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Check your changes are visible

---

## 🛠️ Troubleshooting

### Changes Not Showing Up?

**Solution 1: Clear Browser Cache**

```
Chrome/Edge: Ctrl+Shift+Delete → Clear cache
Safari: Cmd+Option+E
```

**Solution 2: Hard Refresh**

```
Mac: Cmd+Shift+R
Windows: Ctrl+F5
```

**Solution 3: Check Deployment**

Go to Cloud Build console and verify the build succeeded.

### Build Failed?

**Common causes**:

1. **Syntax Error**:
   - Missing closing tag: `</div>`
   - Missing comma in array
   - Unclosed quotes

   **Solution**: Check the error message in Cloud Build logs

2. **Wrong File Path**:
   - Image path doesn't exist
   - Typo in file name

   **Solution**: Verify all file paths are correct

3. **Import Missing**:
   - Used an icon but didn't import it

   **Solution**: Add import at top of file

### Can't Push to GitHub?

**Error: "Authentication failed"**

**Solution**:
1. GitHub Desktop → Settings → Accounts
2. Sign out and sign back in
3. Try pushing again

### Made a Mistake?

**Want to undo**:

**In GitHub Desktop**:
1. Go to History tab
2. Right-click on the bad commit
3. Select "Revert this commit"
4. Push to GitHub

---

## 📊 Common Tasks Quick Reference

### Update Webinar Link Everywhere

**Files to change**:
1. `app/page.tsx` - Home page
2. `app/services/page.tsx` - All service sections

**Search**: `https://docs.google.com/forms`
**Replace**: Your new link

### Add a New PDF Resource

**Steps**:
1. Add PDF to `public/resources/`
2. Update `app/resources/page.tsx`
3. Add to resources array
4. Commit and push

### Change Phone Number Everywhere

**Files**:
1. `app/contact/page.tsx`
2. `components/navigation/footer.tsx`

**Search**: `+91 9974742626`
**Replace**: Your new number

### Update SEBI Disclaimer

**File**: `app/sebi-disclaimer/page.tsx`

Update the registration numbers and compliance details.

---

## 📞 Need Help?

### Before Asking for Help

1. **Check this guide** - Search for your task
2. **Check error messages** - They often tell you what's wrong
3. **Try Googling the error** - Someone else has likely solved it

### Getting Help

**For technical issues**:
- Check Cloud Build logs
- Review GitHub Desktop error messages
- Take a screenshot of the error

**For content questions**:
- Draft the content first
- Identify which file to update
- Follow the examples in this guide

---

## 🎯 Best Practices

### Content Updates

✅ **Do**:
- Keep backups of important content
- Test changes locally when possible
- Update one thing at a time
- Write clear commit messages
- Check the live site after deployment

❌ **Don't**:
- Make multiple unrelated changes at once
- Push changes without reviewing them
- Forget to save files before committing
- Skip testing after deployment

### File Organization

✅ **Do**:
- Use lowercase for file names
- Use hyphens in file names (not spaces)
- Keep related files together
- Name files descriptively

❌ **Don't**:
- Use spaces in file names
- Use special characters (@, #, $, etc.)
- Create duplicate files
- Mix file types in wrong folders

---

## 📅 Recommended Maintenance Schedule

### Weekly
- ✅ Check for broken links
- ✅ Review Google Analytics
- ✅ Monitor Cloud Build status

### Monthly
- ✅ Update webinar links if changed
- ✅ Add new resources/PDFs
- ✅ Update team photos if needed
- ✅ Review and update testimonials

### Quarterly
- ✅ Review all contact information
- ✅ Update office hours if changed
- ✅ Audit all external links
- ✅ Update SEO content
- ✅ Review services offered

### Annually
- ✅ Update copyright year in footer
- ✅ Review and update SEBI compliance
- ✅ Audit all content for accuracy
- ✅ Update team information
- ✅ Refresh testimonials

---

## 🎉 You're All Set!

You now have everything you need to manage the NRI Wealth Partners website. Remember:

1. **Start small** - Make one change at a time
2. **Always review** before pushing
3. **Test after deployment**
4. **Keep this guide handy**

**Questions?** Refer back to this guide anytime!

---

**Last Updated**: November 2024
**Version**: 1.0
