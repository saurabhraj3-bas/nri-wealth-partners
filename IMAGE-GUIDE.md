# Image and Logo Placement Guide

Complete guide for organizing images in your NRI Wealth Partners website.

## 📁 Directory Structure

```
public/
└── images/
    ├── logos/          # Company logos and branding
    ├── team/           # Team member photos
    ├── services/       # Service-related images
    ├── blog/           # Blog post images
    └── (root)          # General images
```

---

## 🎨 **1. LOGOS**

### Location: `public/images/logos/`

#### Required Logo Files:

**Main Logo (for header/footer):**
```bash
public/images/logos/nri-wealth-partners-logo.png
# Recommended size: 200x60px
# Format: PNG with transparent background
# Use: Header, Footer, Favicon
```

**Favicon:**
```bash
public/favicon.ico
# Size: 32x32px or 64x64px
# Format: ICO or PNG
# Use: Browser tab icon
```

**Optional Logos:**
```bash
public/images/logos/nri-wealth-partners-logo-white.png    # For dark backgrounds
public/images/logos/nri-wealth-partners-square.png        # Square version (social media)
public/images/logos/nri-wealth-partners-icon.png          # Icon only
```

### How to Add:

1. **Copy your logo files:**
```bash
cp /path/to/your/logo.png ~/Projects/NRIWealthPartners/public/images/logos/nri-wealth-partners-logo.png
```

2. **Update the header component:**
The logo is currently text-based. To add an image logo:

```typescript
// In: components/navigation/header.tsx
// Replace this:
<div className="text-2xl font-bold text-navy">
  NRI <span className="text-gold">Wealth Partners</span>
</div>

// With this:
<Image
  src="/images/logos/nri-wealth-partners-logo.png"
  alt="NRI Wealth Partners"
  width={200}
  height={60}
  priority
/>
```

---

## 👥 **2. TEAM PHOTOS**

### Location: `public/images/team/`

#### Required Files:

**Anil Parekh Photo:**
```bash
public/images/team/anil-parekh.jpg
# Source: Anil.jpeg (provided by you)
# Recommended size: 800x800px (square)
# Format: JPG or PNG
# Quality: High resolution, professional headshot
```

**Avani Parekh Photo:**
```bash
public/images/team/avani-parekh.jpg
# Source: Avani.jpeg (provided by you)
# Recommended size: 800x800px (square)
# Format: JPG or PNG
# Quality: High resolution, professional headshot
```

### How to Add:

**Option 1: Using Finder (GUI)**
1. Open Finder
2. Navigate to: `~/Projects/NRIWealthPartners/public/images/team/`
3. Drag and drop your photos:
   - Rename `Anil.jpeg` → `anil-parekh.jpg`
   - Rename `Avani.jpeg` → `avani-parekh.jpg`

**Option 2: Using Terminal**
```bash
# If your photos are on Desktop:
cp ~/Desktop/Anil.jpeg ~/Projects/NRIWealthPartners/public/images/team/anil-parekh.jpg
cp ~/Desktop/Avani.jpeg ~/Projects/NRIWealthPartners/public/images/team/avani-parekh.jpg
```

### Currently Used In:
- About Us page (`/about`)
- Team Preview section on Home page

---

## 🖼️ **3. GENERAL IMAGES**

### Hero/Banner Images:
```bash
public/images/hero-banner.jpg           # Home page hero background
public/images/about-banner.jpg          # About page banner
public/images/services-banner.jpg       # Services page banner
```
Size: 1920x600px (landscape)

### Service Icons/Illustrations:
```bash
public/images/services/investment.png
public/images/services/mutual-funds.png
public/images/services/tax-planning.png
# etc.
```
Size: 512x512px (square)

### Blog/Resource Images:
```bash
public/images/blog/article-1.jpg
public/images/blog/article-2.jpg
```
Size: 1200x630px (social media optimized)

---

## 📐 **Image Specifications**

### Recommended Formats:

| Image Type | Format | Size | Notes |
|------------|--------|------|-------|
| Logos | PNG | 200x60px | Transparent background |
| Team Photos | JPG | 800x800px | Square, professional |
| Hero Banners | JPG | 1920x600px | High quality |
| Icons | PNG/SVG | 512x512px | Transparent background |
| Blog Images | JPG | 1200x630px | Optimized for social |
| Favicon | ICO/PNG | 32x32px | Browser icon |

### Image Optimization:

**Before uploading, optimize images:**

1. **Online Tools:**
   - https://tinypng.com (compress PNG/JPG)
   - https://squoosh.app (Google's image optimizer)

2. **Command Line (if installed):**
```bash
# Install ImageMagick (one-time)
brew install imagemagick

# Resize image
convert input.jpg -resize 800x800 output.jpg

# Compress image
convert input.jpg -quality 85 output.jpg
```

---

## 🔄 **How to Use Images in Code**

### Using Next.js Image Component:

```typescript
import Image from 'next/image'

// Example 1: Static image
<Image
  src="/images/team/anil-parekh.jpg"
  alt="Anil Parekh - Founder"
  width={800}
  height={800}
  quality={90}
/>

// Example 2: Logo
<Image
  src="/images/logos/nri-wealth-partners-logo.png"
  alt="NRI Wealth Partners"
  width={200}
  height={60}
  priority  // Loads immediately
/>

// Example 3: Background image (using CSS)
<div
  className="hero"
  style={{backgroundImage: 'url(/images/hero-banner.jpg)'}}
>
  Content
</div>
```

### Accessing Images via URL:

In browser, images are accessible at:
```
http://localhost:3001/images/team/anil-parekh.jpg
http://localhost:3001/images/logos/logo.png
```

After deployment:
```
https://your-site.run.app/images/team/anil-parekh.jpg
```

---

## ✅ **Quick Setup Checklist**

### Minimum Required Images:

- [ ] `public/images/team/anil-parekh.jpg` - Anil's photo
- [ ] `public/images/team/avani-parekh.jpg` - Avani's photo
- [ ] `public/images/logos/nri-wealth-partners-logo.png` - Main logo (optional)
- [ ] `public/favicon.ico` - Browser favicon (optional)

### Steps:

1. **Create folders** (already done ✅)
   ```bash
   cd ~/Projects/NRIWealthPartners
   mkdir -p public/images/team public/images/logos
   ```

2. **Copy team photos:**
   ```bash
   # From Desktop
   cp ~/Desktop/Anil.jpeg public/images/team/anil-parekh.jpg
   cp ~/Desktop/Avani.jpeg public/images/team/avani-parekh.jpg
   ```

3. **Update About page** (if needed)

   The code currently shows placeholders. Once you add photos, they'll automatically display!

4. **Verify images work:**
   ```bash
   # Start dev server
   npm run dev

   # Visit in browser
   open http://localhost:3001/about
   ```

5. **Check image URLs directly:**
   ```
   http://localhost:3001/images/team/anil-parekh.jpg
   http://localhost:3001/images/team/avani-parekh.jpg
   ```

---

## 🎨 **Optional: Add Actual Logo**

Currently, the site uses a text logo. To add an image logo:

### Step 1: Add logo file
```bash
cp /path/to/logo.png ~/Projects/NRIWealthPartners/public/images/logos/nri-wealth-partners-logo.png
```

### Step 2: Update Header Component

Edit: `components/navigation/header.tsx`

Replace line 36-39 (the text logo) with:

```typescript
import Image from "next/image"

// In the header component, replace:
<div className="text-2xl font-bold text-navy">
  NRI <span className="text-gold">Wealth Partners</span>
</div>

// With:
<Image
  src="/images/logos/nri-wealth-partners-logo.png"
  alt="NRI Wealth Partners"
  width={200}
  height={60}
  className="h-12 w-auto"
  priority
/>
```

---

## 🖼️ **Current Image Status in Code**

### Already Implemented:
✅ Team photos on About page (ready for your images)
✅ Image structure in place
✅ Optimized Next.js Image component

### Using Placeholders:
⚠️ Team photos (shows "Photo" text)
⚠️ Logo (using text instead of image)

### Add Your Images:
Just copy your files to the correct location and they'll work immediately!

---

## 📞 **Quick Commands**

```bash
# Navigate to images folder
cd ~/Projects/NRIWealthPartners/public/images

# List all images
ls -R

# Check image size
du -sh team/anil-parekh.jpg

# View folder in Finder
open ~/Projects/NRIWealthPartners/public/images
```

---

## 🎯 **Next Steps**

1. **Copy your team photos** to `public/images/team/`
2. **Add logo** to `public/images/logos/` (optional)
3. **Restart dev server** to see changes
4. **Test all pages** to verify images load
5. **Deploy** when satisfied

---

**Need help?** The images will automatically work once you place them in the correct folders! 🎉
