# QR Code System - Quick Reference Guide

Complete QR code generation system for newsletter subscriptions and webinar registrations.

---

## Features

✅ **Newsletter Subscription QR Codes** - Direct link to newsletter signup
✅ **Webinar Registration QR Codes** - Direct link to specific webinar registration
✅ **Source Tracking** - Track where subscribers/registrants came from
✅ **Multiple Formats** - PNG, SVG (scalable for print), Data URL
✅ **High-Quality Print** - Up to 2048x2048 pixels with high error correction
✅ **Downloadable** - Direct browser download as files
✅ **Customizable** - Colors, sizes, error correction levels

---

## API Endpoints

### 1. Newsletter QR Code

**PNG (for digital use):**
```
GET /api/generate-qr?type=newsletter&source=event_booth
```

**SVG (for print):**
```
GET /api/generate-qr?type=newsletter&format=svg&source=poster
```

**Data URL (for embedding in pages):**
```
GET /api/generate-qr?type=newsletter&format=dataurl&source=website
```

**Download as file:**
```
GET /api/generate-qr?type=newsletter&download=true
```

### 2. Webinar QR Code

**Basic webinar QR:**
```
GET /api/generate-qr?type=webinar&webinarId=123&webinarTitle=Tax+Planning
```

**With custom source:**
```
GET /api/generate-qr?type=webinar&webinarId=123&webinarTitle=Tax+Planning&source=presentation
```

**High-res for print:**
```
GET /api/generate-qr?type=webinar&webinarId=123&webinarTitle=Tax+Planning&format=svg
```

### 3. Custom QR Code

**Basic custom URL:**
```
GET /api/generate-qr?type=custom&url=https://nriwealthpartners.com/contact&campaign=contact_us
```

**Advanced options:**
```
GET /api/generate-qr?type=custom&url=https://example.com&campaign=promo&size=1024&color=%23C5A572&errorLevel=H
```

---

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | **required** | `newsletter`, `webinar`, or `custom` |
| `format` | string | `png` | `png`, `svg`, or `dataurl` |
| `source` | string | `qr_code` | UTM source (e.g., `event`, `poster`, `email`) |
| `download` | boolean | `false` | Set to `true` to download as file |
| **Webinar-specific:** |
| `webinarId` | string | **required** | ID of the webinar |
| `webinarTitle` | string | optional | Title of the webinar (for tracking) |
| **Custom QR-specific:** |
| `url` | string | **required** | URL to encode |
| `campaign` | string | `custom` | UTM campaign name |
| `medium` | string | `qr` | UTM medium |
| `size` | number | `512` | QR code size in pixels |
| `color` | string | `#1A365D` | QR code color (hex, URL-encoded) |
| `errorLevel` | string | `M` | Error correction: `L`, `M`, `Q`, `H` |

---

## Usage Examples

### Example 1: Newsletter Signup QR for Event Booth

Display QR code at your event booth:

```html
<img src="/api/generate-qr?type=newsletter&source=event_booth" alt="Subscribe to Newsletter" />
```

### Example 2: Downloadable Webinar QR for Poster

Create download link for high-res poster:

```html
<a href="/api/generate-qr?type=webinar&webinarId=tax-planning-jan-2024&webinarTitle=Tax Planning for NRIs&format=svg&download=true">
  Download Webinar QR Code (SVG)
</a>
```

### Example 3: Newsletter QR with React Component

```typescript
import Image from 'next/image';

export function NewsletterQRCode({ source = 'website' }) {
  const [qrCode, setQRCode] = useState('');

  useEffect(() => {
    fetch(`/api/generate-qr?type=newsletter&format=dataurl&source=${source}`)
      .then(res => res.json())
      .then(data => setQRCode(data.qrCode));
  }, [source]);

  return qrCode ? (
    <img src={qrCode} alt="Newsletter Signup QR Code" className="w-64 h-64" />
  ) : (
    <div>Loading QR code...</div>
  );
}
```

---

## Tracking Sources

The QR code system automatically tracks where subscribers/registrants came from via UTM parameters.

### Recommended Source Names:

**Physical Locations:**
- `event_booth` - Event booths/conferences
- `poster` - Printed posters
- `flyer` - Printed flyers/handouts
- `business_card` - Business cards
- `banner` - Physical banners

**Digital:**
- `presentation` - PowerPoint/Google Slides
- `website` - Website pages
- `email_signature` - Email signatures
- `social_media` - Social media posts

**Events:**
- `webinar_presentation` - During webinar slides
- `workshop` - Workshop materials
- `seminar` - Seminar materials

---

## Print Specifications

### For Business Cards (small)
```
Size: 512px
Format: PNG
Error Level: M
```

### For Posters/Flyers (medium)
```
Size: 1024px
Format: PNG or SVG
Error Level: H
```

### For Large Banners (large)
```
Size: 2048px
Format: SVG (scalable)
Error Level: H
```

### Example: High-Quality Print QR
```
GET /api/generate-qr?type=newsletter&format=svg&source=poster&errorLevel=H
```

---

## Use Cases

### 1. Webinar Presentations
Display QR code on slides for instant registration:
```html
<div class="qr-slide">
  <h2>Register Now!</h2>
  <img src="/api/generate-qr?type=webinar&webinarId=123&source=presentation" />
  <p>Scan to register for this webinar</p>
</div>
```

### 2. Event Booth
Printed poster with newsletter signup QR:
```
Download: /api/generate-qr?type=newsletter&format=svg&source=event_booth&download=true
Print size: 8" x 10" poster
```

### 3. Email Signature
Add QR code to admin email signatures:
```html
<img src="https://nriwealthpartners.com/api/generate-qr?type=newsletter&source=email_signature&size=150" width="75" height="75" />
```

### 4. Social Media Posts
Share QR code image on LinkedIn/Twitter:
```
Download PNG: /api/generate-qr?type=newsletter&source=linkedin&size=800&download=true
```

---

## Analytics

All QR code scans are tracked via UTM parameters:

- **utm_source** - Where the QR code was placed (e.g., `event_booth`)
- **utm_medium** - Always `qr`
- **utm_campaign** - Campaign name (e.g., `newsletter_signup`, `webinar_123`)

View analytics in:
1. **Newsletter subscribers** - Filter by source in admin dashboard
2. **Webinar registrations** - Filter by source in webinar dashboard
3. **Google Analytics** - Campaign tracking reports

---

## Admin Dashboard Integration

### Newsletter QR Code Manager
**Location:** `/admin/newsletter/qr-codes`

Features:
- [ ] Generate QR codes for different sources
- [ ] Preview QR codes
- [ ] Download as PNG or SVG
- [ ] View scan analytics by source

### Webinar QR Code Manager
**Location:** `/admin/webinars/[id]/qr-code`

Features:
- [ ] Generate QR code for specific webinar
- [ ] Download for presentation
- [ ] Download for print materials
- [ ] Track registrations by QR source

---

## Technical Details

### Library
- **qrcode** v1.5.4 - Zero dependencies, fast, reliable

### QR Code Specs
- **Error Correction Levels:**
  - **L (Low)** - 7% error correction - Good for digital only
  - **M (Medium)** - 15% error correction - **DEFAULT** - Good balance
  - **Q (Quartile)** - 25% error correction - Good for print
  - **H (High)** - 30% error correction - Best for print, allows logo overlay

- **Size Recommendations:**
  - Digital display: 256-512px
  - Print materials: 1024-2048px
  - Banners/large format: SVG (scalable)

### Caching
- QR codes are cached for 1 year (`max-age=31536000`)
- Same parameters = same QR code (deterministic)

---

## Security Considerations

✅ **URL Validation** - All URLs are validated before QR generation
✅ **Rate Limiting** - TODO: Add rate limiting to prevent abuse
✅ **HTTPS Only** - All generated QR codes link to HTTPS URLs
✅ **No PII** - QR codes don't contain personally identifiable information

---

## Next Steps

1. **Build Admin UI** - QR code generation interfaces
2. **Add to Webinar Pages** - Auto-generate QR for each webinar
3. **Newsletter Signup Page** - Display QR code with tracking
4. **Analytics Dashboard** - Track QR code scans by source
5. **Print Templates** - Ready-to-print posters/flyers with QR codes

---

## Support

Questions? Issues? Contact the development team or refer to:
- Main documentation: `/docs/newsletter-system-progress.md`
- API reference: `/app/api/generate-qr/route.ts`
- Utility functions: `/lib/qr-code-generator.ts`
