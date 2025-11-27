/**
 * QR Code Generator Utility
 *
 * Generates QR codes for:
 * - Newsletter subscriptions
 * - Webinar registrations
 * - Custom URLs
 *
 * Supports tracking source attribution via UTM parameters
 */

import QRCode from 'qrcode';

export interface QRCodeOptions {
  /**
   * The URL to encode in the QR code
   */
  url: string;

  /**
   * UTM source for tracking (e.g., "qr_code", "print_material", "event")
   */
  source?: string;

  /**
   * UTM medium for tracking (e.g., "qr", "print", "digital")
   */
  medium?: string;

  /**
   * UTM campaign for tracking (e.g., "newsletter_signup", "webinar_jan_2024")
   */
  campaign?: string;

  /**
   * Additional custom parameters
   */
  customParams?: Record<string, string>;

  /**
   * QR code color (default: #1A365D - navy)
   */
  color?: string;

  /**
   * QR code background color (default: #FFFFFF - white)
   */
  backgroundColor?: string;

  /**
   * Error correction level (L, M, Q, H) - default: M
   * - L: ~7% error correction
   * - M: ~15% error correction
   * - Q: ~25% error correction
   * - H: ~30% error correction
   */
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';

  /**
   * Width/height of QR code in pixels (default: 512)
   */
  size?: number;

  /**
   * Margin around QR code in modules (default: 4)
   */
  margin?: number;
}

/**
 * Build URL with tracking parameters
 */
export function buildTrackingURL(options: QRCodeOptions): string {
  const url = new URL(options.url);

  // Add UTM parameters if provided
  if (options.source) {
    url.searchParams.set('utm_source', options.source);
  }

  if (options.medium) {
    url.searchParams.set('utm_medium', options.medium);
  }

  if (options.campaign) {
    url.searchParams.set('utm_campaign', options.campaign);
  }

  // Add custom parameters
  if (options.customParams) {
    Object.entries(options.customParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}

/**
 * Generate QR code as Data URL (for display in browser)
 */
export async function generateQRCode(options: QRCodeOptions): Promise<string> {
  const url = buildTrackingURL(options);

  const qrOptions: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    type: 'image/png',
    width: options.size || 512,
    margin: options.margin || 4,
    color: {
      dark: options.color || '#1A365D', // Navy
      light: options.backgroundColor || '#FFFFFF' // White
    }
  };

  return await QRCode.toDataURL(url, qrOptions);
}

/**
 * Generate QR code as SVG string (scalable, better for print)
 */
export async function generateQRCodeSVG(options: QRCodeOptions): Promise<string> {
  const url = buildTrackingURL(options);

  const qrOptions: QRCode.QRCodeToStringOptions = {
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    type: 'svg',
    width: options.size || 512,
    margin: options.margin || 4,
    color: {
      dark: options.color || '#1A365D',
      light: options.backgroundColor || '#FFFFFF'
    }
  };

  return await QRCode.toString(url, qrOptions);
}

/**
 * Generate QR code as Buffer (for file downloads)
 */
export async function generateQRCodeBuffer(options: QRCodeOptions): Promise<Buffer> {
  const url = buildTrackingURL(options);

  const qrOptions: QRCode.QRCodeToBufferOptions = {
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    type: 'png',
    width: options.size || 512,
    margin: options.margin || 4,
    color: {
      dark: options.color || '#1A365D',
      light: options.backgroundColor || '#FFFFFF'
    }
  };

  return await QRCode.toBuffer(url, qrOptions);
}

/**
 * Predefined QR code generators for common use cases
 */

/**
 * Generate QR code for newsletter subscription
 */
export async function generateNewsletterQRCode(source: string = 'qr_code'): Promise<string> {
  return await generateQRCode({
    url: 'https://nriwealthpartners.com/newsletter/subscribe',
    source,
    medium: 'qr',
    campaign: 'newsletter_signup'
  });
}

/**
 * Generate QR code for webinar registration
 */
export async function generateWebinarQRCode(
  webinarId: string,
  webinarTitle: string,
  source: string = 'qr_code'
): Promise<string> {
  return await generateQRCode({
    url: `https://nriwealthpartners.com/webinars?id=${webinarId}`,
    source,
    medium: 'qr',
    campaign: `webinar_${webinarId}`,
    customParams: {
      webinar: webinarId,
      title: webinarTitle.toLowerCase().replace(/\s+/g, '_')
    }
  });
}

/**
 * Generate high-resolution print QR code (for posters, flyers)
 */
export async function generatePrintQRCode(
  url: string,
  campaign: string,
  size: number = 2048 // 2048x2048 for high-quality print
): Promise<string> {
  return await generateQRCode({
    url,
    source: 'print_material',
    medium: 'qr',
    campaign,
    errorCorrectionLevel: 'H', // Highest error correction for print
    size,
    margin: 6 // Larger margin for print
  });
}

/**
 * Download QR code as file
 */
export async function downloadQRCode(
  options: QRCodeOptions,
  filename: string = 'qr-code.png'
): Promise<void> {
  const dataUrl = await generateQRCode(options);

  // Create download link
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate QR code with logo (advanced)
 * Note: This requires additional canvas manipulation
 */
export async function generateQRCodeWithLogo(
  options: QRCodeOptions,
  logoUrl: string,
  logoSize: number = 80
): Promise<string> {
  // Generate base QR code
  const qrDataUrl = await generateQRCode({
    ...options,
    errorCorrectionLevel: 'H' // High correction level needed for logo overlay
  });

  // Create canvas to overlay logo
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  const size = options.size || 512;
  canvas.width = size;
  canvas.height = size;

  // Load QR code image
  const qrImage = await loadImage(qrDataUrl);
  ctx.drawImage(qrImage, 0, 0, size, size);

  // Load and draw logo
  const logoImage = await loadImage(logoUrl);
  const logoX = (size - logoSize) / 2;
  const logoY = (size - logoSize) / 2;

  // Draw white background for logo
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

  // Draw logo
  ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

  return canvas.toDataURL('image/png');
}

/**
 * Helper: Load image from URL
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
