/**
 * QR Code Generation API
 *
 * Generates QR codes for newsletter subscriptions, webinar registrations,
 * and custom URLs with tracking parameters.
 *
 * GET /api/generate-qr?type=newsletter
 * GET /api/generate-qr?type=webinar&webinarId=123&webinarTitle=Tax+Planning
 * GET /api/generate-qr?url=https://example.com&source=custom&campaign=promo
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateQRCode,
  generateQRCodeBuffer,
  generateQRCodeSVG,
  generateNewsletterQRCode,
  generateWebinarQRCode,
  QRCodeOptions
} from '@/lib/qr-code-generator';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const type = searchParams.get('type');
    const format = searchParams.get('format') || 'png'; // png, svg, dataurl
    const source = searchParams.get('source') || 'qr_code';

    // Download QR code as file (trigger browser download)
    const download = searchParams.get('download') === 'true';

    let qrCodeData: string | Buffer;
    let contentType: string;
    let filename: string = 'qr-code';

    if (type === 'newsletter') {
      // Newsletter subscription QR code
      filename = `newsletter-qr-${source}`;

      if (format === 'svg') {
        qrCodeData = await generateQRCodeSVG({
          url: 'https://nriwealthpartners.com/newsletter/subscribe',
          source,
          medium: 'qr',
          campaign: 'newsletter_signup'
        });
        contentType = 'image/svg+xml';
      } else if (format === 'dataurl') {
        qrCodeData = await generateNewsletterQRCode(source);
        return NextResponse.json({ qrCode: qrCodeData });
      } else {
        qrCodeData = await generateQRCodeBuffer({
          url: 'https://nriwealthpartners.com/newsletter/subscribe',
          source,
          medium: 'qr',
          campaign: 'newsletter_signup'
        });
        contentType = 'image/png';
      }
    } else if (type === 'webinar') {
      // Webinar registration QR code
      const webinarId = searchParams.get('webinarId');
      const webinarTitle = searchParams.get('webinarTitle') || 'webinar';

      if (!webinarId) {
        return NextResponse.json(
          { error: 'webinarId is required for webinar QR codes' },
          { status: 400 }
        );
      }

      filename = `webinar-${webinarId}-qr`;

      if (format === 'svg') {
        qrCodeData = await generateQRCodeSVG({
          url: `https://nriwealthpartners.com/webinars?id=${webinarId}`,
          source,
          medium: 'qr',
          campaign: `webinar_${webinarId}`,
          customParams: {
            webinar: webinarId,
            title: webinarTitle.toLowerCase().replace(/\s+/g, '_')
          }
        });
        contentType = 'image/svg+xml';
      } else if (format === 'dataurl') {
        qrCodeData = await generateWebinarQRCode(webinarId, webinarTitle, source);
        return NextResponse.json({ qrCode: qrCodeData });
      } else {
        qrCodeData = await generateQRCodeBuffer({
          url: `https://nriwealthpartners.com/webinars?id=${webinarId}`,
          source,
          medium: 'qr',
          campaign: `webinar_${webinarId}`,
          customParams: {
            webinar: webinarId,
            title: webinarTitle.toLowerCase().replace(/\s+/g, '_')
          }
        });
        contentType = 'image/png';
      }
    } else if (type === 'custom') {
      // Custom URL QR code
      const url = searchParams.get('url');

      if (!url) {
        return NextResponse.json(
          { error: 'url is required for custom QR codes' },
          { status: 400 }
        );
      }

      const campaign = searchParams.get('campaign') || 'custom';
      const medium = searchParams.get('medium') || 'qr';
      const size = parseInt(searchParams.get('size') || '512');
      const color = searchParams.get('color') || '#1A365D';
      const errorLevel = (searchParams.get('errorLevel') as 'L' | 'M' | 'Q' | 'H') || 'M';

      filename = `qr-${campaign}`;

      const options: QRCodeOptions = {
        url,
        source,
        medium,
        campaign,
        size,
        color,
        errorCorrectionLevel: errorLevel
      };

      if (format === 'svg') {
        qrCodeData = await generateQRCodeSVG(options);
        contentType = 'image/svg+xml';
      } else if (format === 'dataurl') {
        qrCodeData = await generateQRCode(options);
        return NextResponse.json({ qrCode: qrCodeData });
      } else {
        qrCodeData = await generateQRCodeBuffer(options);
        contentType = 'image/png';
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use: newsletter, webinar, or custom' },
        { status: 400 }
      );
    }

    // Return QR code as image
    const headers = new Headers();
    headers.set('Content-Type', contentType);

    if (download) {
      headers.set(
        'Content-Disposition',
        `attachment; filename="${filename}.${format === 'svg' ? 'svg' : 'png'}"`
      );
    } else {
      headers.set('Content-Disposition', 'inline');
    }

    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    // Convert Buffer to Uint8Array if needed for NextResponse compatibility
    const body = qrCodeData instanceof Buffer ? new Uint8Array(qrCodeData) : qrCodeData;

    return new NextResponse(body as BodyInit, { headers });
  } catch (error: any) {
    console.error('QR code generation error:', error);

    return NextResponse.json(
      { error: 'Failed to generate QR code', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Example usage:
 *
 * Newsletter QR code (PNG):
 * GET /api/generate-qr?type=newsletter&source=event_booth
 *
 * Newsletter QR code (SVG for print):
 * GET /api/generate-qr?type=newsletter&format=svg&source=poster
 *
 * Newsletter QR code (Data URL for display):
 * GET /api/generate-qr?type=newsletter&format=dataurl
 *
 * Webinar QR code:
 * GET /api/generate-qr?type=webinar&webinarId=123&webinarTitle=Tax+Planning&source=presentation
 *
 * Custom QR code:
 * GET /api/generate-qr?type=custom&url=https://example.com&campaign=promo&size=1024
 *
 * Download QR code:
 * GET /api/generate-qr?type=newsletter&download=true
 */
