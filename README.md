# NRI Wealth Partners - Professional Website

A comprehensive, SEO-optimized website for NRI Wealth Partners, a SEBI-registered wealth management and financial advisory firm serving Non-Resident Indians worldwide.

## 🌟 Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Responsive Design**: Mobile-first, fully responsive across all devices
- **Interactive Calculators**: SIP Calculator with real-time calculations and charts
- **Contact Forms**: React Hook Form with Zod validation
- **SEO Optimized**: Meta tags, structured data, sitemap ready
- **SEBI Compliant**: Comprehensive disclaimer and regulatory compliance pages
- **Performance**: Optimized for Google Cloud Run deployment
- **Animations**: Framer Motion for smooth, professional animations
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Building](#building)
- [Deployment](#deployment)
- [Features Implemented](#features-implemented)
- [Pending Enhancements](#pending-enhancements)
- [Contributing](#contributing)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd NRIWealthPartners
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your configuration values.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
NRIWealthPartners/
├── app/                          # Next.js 14 App Router
│   ├── about/                    # About Us page
│   ├── calculators/              # Financial Calculators
│   ├── contact/                  # Contact page
│   ├── services/                 # Services page
│   ├── sebi-disclaimer/          # SEBI compliance page
│   ├── thank-you/                # Form submission success page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles
│   └── not-found.tsx             # 404 page
├── components/
│   ├── calculators/              # Calculator components
│   ├── forms/                    # Form components
│   ├── navigation/               # Header & Footer
│   ├── sections/                 # Page sections
│   └── ui/                       # shadcn/ui components
├── lib/
│   └── utils.ts                  # Utility functions
├── public/
│   └── images/                   # Static images
├── .env.example                  # Environment variables template
├── Dockerfile                    # Docker configuration
├── cloudbuild.yaml               # Google Cloud Build config
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── package.json                  # Dependencies

```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=support@nriwealthpartners.com

# Google reCAPTCHA v3 (Test keys provided in .env.local.example)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key

# Contact Email
CONTACT_EMAIL=support@nriwealthpartners.com

# Environment
NODE_ENV=development
```

### Getting API Keys

1. **Resend API Key**: Sign up at [resend.com](https://resend.com)
2. **reCAPTCHA**: Get keys from [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)

## 💻 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Adding New Pages

1. Create a new directory in `app/` (e.g., `app/new-page/`)
2. Add `page.tsx` with your component
3. Add metadata export for SEO
4. Update navigation in `components/navigation/header.tsx`

### Adding New Calculators

1. Create calculator component in `components/calculators/`
2. Add to `app/calculators/page.tsx`
3. Use utility functions from `lib/utils.ts`

## 🏗️ Building

```bash
# Create production build
npm run build

# Test production build locally
npm start
```

The build output will be in `.next/` directory.

## 🚀 Deployment

### Option 1: Google Cloud Run (Recommended)

#### Prerequisites
- Google Cloud account
- gcloud CLI installed and configured
- Docker installed

#### Steps

1. **Set up Google Cloud Project**:
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud config set compute/region us-east1
```

2. **Enable required APIs**:
```bash
gcloud services enable cloudbuild.googleapis.com run.googleapis.com
```

3. **Build and Deploy**:
```bash
# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml

# Or manually with Docker
docker build -t gcr.io/YOUR_PROJECT_ID/nri-wealth-partners .
docker push gcr.io/YOUR_PROJECT_ID/nri-wealth-partners
gcloud run deploy nri-wealth-partners \
  --image gcr.io/YOUR_PROJECT_ID/nri-wealth-partners \
  --region us-east1 \
  --platform managed \
  --allow-unauthenticated
```

4. **Set environment variables in Cloud Run**:
```bash
gcloud run services update nri-wealth-partners \
  --set-env-vars="NODE_ENV=production" \
  --region us-east1
```

#### Continuous Deployment

Connect your repository to Google Cloud Build for automatic deployments on push.

### Option 2: Vercel (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Option 3: Traditional Hosting

1. Build the application: `npm run build`
2. Copy `.next/`, `public/`, `package.json`, and `node_modules/` to your server
3. Run: `npm start` or use PM2: `pm2 start npm --name "nri-wealth" -- start`

## ✅ Features Implemented

### Pages
- ✅ Home page with hero, metrics, services overview, testimonials
- ✅ About Us page with team profiles
- ✅ Services page with 8 detailed service sections
- ✅ Contact page with validated form
- ✅ Calculators page with SIP calculator
- ✅ SEBI Disclaimer page (compliance)
- ✅ Thank You page
- ✅ 404 Error page

### Components
- ✅ Responsive navigation header with dropdown menus
- ✅ Comprehensive footer with SEBI disclaimer
- ✅ Contact form with React Hook Form & Zod validation
- ✅ SIP Calculator with charts (Recharts)
- ✅ Floating WhatsApp button
- ✅ Scroll to top button
- ✅ Cookie consent banner
- ✅ Testimonials carousel
- ✅ Animated counter components

### Technical
- ✅ Next.js 14 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS with custom design system
- ✅ shadcn/ui component library
- ✅ SEO optimization (metadata, structured data ready)
- ✅ Google Cloud Run deployment configuration
- ✅ Docker containerization
- ✅ Environment variable setup
- ✅ Responsive design (mobile-first)
- ✅ Accessibility features

## 🔄 Pending Enhancements

### High Priority
1. **Email Integration**: Implement Resend API for contact form submissions
   - Create `/app/api/contact/route.ts`
   - Integrate with contact form
   - Set up email templates

2. **reCAPTCHA Integration**: Add Google reCAPTCHA v3 to contact form
   - Add reCAPTCHA script to layout
   - Implement verification in API route

3. **Additional Calculators**: Implement remaining 9 calculators
   - Retirement Planning Calculator
   - NRI Tax Calculator
   - Currency Impact Calculator
   - NRE/NRO Interest Calculator
   - Home Loan EMI Calculator
   - Lumpsum Investment Calculator
   - Financial Goal Planner
   - PPF Calculator
   - Education Cost Planner

4. **Resources Page**: Build complete resources page
   - Blog section (with CMS integration or MDX)
   - Downloadable guides
   - FAQ accordion
   - Newsletter signup

5. **Team Photos**: Add actual team member photos
   - Upload `Anil.jpeg` to `/public/images/anil-parekh.jpg`
   - Upload `Avani.jpeg` to `/public/images/avani-parekh.jpg`
   - Update image references

### Medium Priority
6. **Privacy Policy & Terms**: Create full legal pages
7. **Analytics**: Add Google Analytics 4
8. **Sitemap**: Generate dynamic sitemap.xml
9. **Robots.txt**: Configure for SEO
10. **Schema Markup**: Add JSON-LD structured data
11. **Blog System**: Implement blog with MDX or headless CMS
12. **Search Functionality**: Add site-wide search

### Low Priority
13. **Multi-language**: Add Hindi/regional language support
14. **Dark Mode**: Implement theme toggle
15. **Progressive Web App**: Add PWA support
16. **Live Chat**: Integrate chat widget
17. **Social Media Integration**: Add social sharing
18. **Client Portal**: Member login area

## 📦 Dependencies

### Core
- Next.js 14.2.18
- React 18.3.1
- TypeScript 5.6.3

### UI & Styling
- Tailwind CSS 3.4.15
- Framer Motion 11.11.17
- Radix UI Components
- Lucide React (icons)

### Forms & Validation
- React Hook Form 7.53.2
- Zod 3.23.8
- @hookform/resolvers 3.9.1

### Data Visualization
- Recharts 2.15.0

### Utilities
- clsx 2.1.1
- tailwind-merge 2.5.5
- class-variance-authority 0.7.1

## 🤝 Contributing

This is a private project for NRI Wealth Partners. For any updates or modifications, please contact the development team.

## 📝 Important Notes

### SEBI Compliance
- Update AMFI registration number in `/app/sebi-disclaimer/page.tsx`
- Verify all regulatory disclaimers before going live
- Ensure all investment-related content includes appropriate risk warnings

### Before Launch Checklist
- [ ] Update AMFI registration number
- [ ] Add actual team member photos
- [ ] Set up Resend email API
- [ ] Configure Google reCAPTCHA
- [ ] Set up Google Analytics
- [ ] Test all forms
- [ ] Verify all links
- [ ] Test on multiple devices
- [ ] Run SEO audit
- [ ] Test accessibility (WCAG 2.1 AA)
- [ ] Set up SSL certificate
- [ ] Configure custom domain
- [ ] Set up Google Search Console
- [ ] Submit sitemap to search engines

## 📧 Contact

For questions or support:
- Email: support@nriwealthpartners.com
- Phone: +91 9974742626
- Website: www.nriwealthpartners.com

## 📄 License

© 2024 NRI Wealth Partners. All rights reserved.

---

**Built with ❤️ for NRIs Worldwide**
