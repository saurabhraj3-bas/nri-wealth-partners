/**
 * Newsletter Subscription API
 *
 * Handles new newsletter subscriptions with double opt-in email confirmation.
 * Includes comprehensive error handling and validation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDb } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { email, name, preferences, source } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailTrimmed = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(emailTrimmed)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Initialize Firestore
    let db;
    try {
      db = getFirestoreDb();
    } catch (dbError) {
      console.error('❌ Failed to initialize Firestore:', dbError);
      return NextResponse.json(
        {
          error: 'Database connection failed',
          message: 'We are currently experiencing technical difficulties. Please try again later or contact support@nriwealthpartners.com',
          details: process.env.NODE_ENV === 'development' ? String(dbError) : 'Service temporarily unavailable'
        },
        { status: 503 }
      );
    }

    // Check if subscriber already exists
    let existingSubscriber;
    try {
      const subscribersRef = db.collection('subscribers');
      const snapshot = await subscribersRef.where('email', '==', emailTrimmed).limit(1).get();
      existingSubscriber = !snapshot.empty ? snapshot.docs[0] : null;
    } catch (queryError) {
      console.error('❌ Failed to query existing subscriber:', queryError);
      return NextResponse.json(
        { error: 'Failed to check existing subscription' },
        { status: 500 }
      );
    }

    if (existingSubscriber) {
      const data = existingSubscriber.data();

      if (data.status === 'active') {
        return NextResponse.json(
          {
            error: 'Already subscribed',
            message: 'This email is already subscribed to our newsletter'
          },
          { status: 409 }
        );
      }

      if (data.status === 'pending') {
        return NextResponse.json(
          {
            error: 'Confirmation pending',
            message: 'Please check your email to confirm your subscription'
          },
          { status: 409 }
        );
      }

      if (data.status === 'unsubscribed') {
        // Re-subscribe
        try {
          const unsubscribeToken = uuidv4();

          await existingSubscriber.ref.update({
            status: 'pending',
            name: name || data.name || '',
            preferences: {
              weeklyDigest: preferences?.weeklyDigest !== false,
              regulatoryOnly: preferences?.regulatoryOnly || false,
              financialOnly: preferences?.financialOnly || false
            },
            source: source || 'website',
            subscribedAt: new Date(),
            confirmedAt: null,
            unsubscribedAt: null,
            unsubscribeToken
          });

          // Send confirmation email
          await sendConfirmationEmail(emailTrimmed, name || '', unsubscribeToken);

          return NextResponse.json({
            success: true,
            message: 'Please check your email to confirm your subscription'
          });
        } catch (updateError) {
          console.error('❌ Failed to resubscribe:', updateError);
          return NextResponse.json(
            { error: 'Failed to resubscribe' },
            { status: 500 }
          );
        }
      }
    }

    // Create new subscriber
    try {
      const unsubscribeToken = uuidv4();

      const subscriberData = {
        email: emailTrimmed,
        name: name || '',
        status: 'pending',
        preferences: {
          weeklyDigest: preferences?.weeklyDigest !== false,
          regulatoryOnly: preferences?.regulatoryOnly || false,
          financialOnly: preferences?.financialOnly || false
        },
        source: source || 'website',
        subscribedAt: new Date(),
        confirmedAt: null,
        unsubscribedAt: null,
        lastEmailSent: null,
        emailsSent: 0,
        emailsOpened: 0,
        linksClicked: 0,
        metadata: {
          location: '',
          device: '',
          referrer: request.headers.get('referer') || ''
        },
        unsubscribeToken
      };

      await db.collection('subscribers').add(subscriberData);

      // Send confirmation email
      await sendConfirmationEmail(emailTrimmed, name || '', unsubscribeToken);

      console.log(`✅ New subscriber (pending): ${emailTrimmed}`);

      return NextResponse.json({
        success: true,
        message: 'Please check your email to confirm your subscription'
      });
    } catch (createError) {
      console.error('❌ Failed to create subscriber:', createError);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Send confirmation email with double opt-in link
 */
async function sendConfirmationEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  try {
    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'newsletters@nriwealthpartners.com',
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const confirmationLink = `https://nriwealthpartners.com/newsletter/confirm?token=${token}`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 20px 0; border-bottom: 3px solid #C5A572;">
    <h1 style="color: #1A365D; margin: 0;">Welcome to The NRI Weekly!</h1>
  </div>

  <div style="padding: 30px 0;">
    <p>Hello${name ? ` ${name}` : ''},</p>

    <p>Thank you for subscribing to The NRI Weekly newsletter from NRI Wealth Partners!</p>

    <p>To complete your subscription and start receiving our weekly curated newsletter, please confirm your email address by clicking the button below:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${confirmationLink}"
         style="display: inline-block; background-color: #C5A572; color: white; text-decoration: none; padding: 15px 40px; border-radius: 5px; font-weight: bold; font-size: 16px;">
        Confirm Subscription
      </a>
    </div>

    <p style="font-size: 14px; color: #666;">
      Or copy and paste this link into your browser:<br>
      <a href="${confirmationLink}" style="color: #C5A572; word-break: break-all;">
        ${confirmationLink}
      </a>
    </p>

    <div style="margin-top: 40px; padding: 20px; background-color: #F7FAFC; border-left: 4px solid #C5A572; border-radius: 4px;">
      <h3 style="color: #1A365D; margin: 0 0 10px 0;">What You'll Receive:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #4A5568;">
        <li>Weekly curated NRI news and insights</li>
        <li>Regulatory updates (FEMA, FATCA, CRS)</li>
        <li>Financial market analysis for NRIs</li>
        <li>Success stories from the Indian diaspora</li>
        <li>Expert tips and planning advice</li>
      </ul>
    </div>

    <p style="margin-top: 30px; font-size: 14px; color: #666;">
      If you didn't request this subscription, you can safely ignore this email.
    </p>
  </div>

  <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #E2E8F0; text-align: center; color: #718096; font-size: 12px;">
    <p style="margin: 0 0 10px 0;">
      © ${new Date().getFullYear()} NRI Wealth Partners. All rights reserved.
    </p>
    <p style="margin: 0;">
      <a href="https://nriwealthpartners.com" style="color: #C5A572; text-decoration: none;">nriwealthpartners.com</a>
    </p>
  </div>
</body>
</html>
    `;

    const textContent = `
Welcome to The NRI Weekly!

Hello${name ? ` ${name}` : ''},

Thank you for subscribing to The NRI Weekly newsletter from NRI Wealth Partners!

To complete your subscription, please confirm your email address by clicking this link:
${confirmationLink}

What you'll receive:
- Weekly curated NRI news and insights
- Regulatory updates (FEMA, FATCA, CRS)
- Financial market analysis for NRIs
- Success stories from the Indian diaspora
- Expert tips and planning advice

If you didn't request this subscription, you can safely ignore this email.

© ${new Date().getFullYear()} NRI Wealth Partners
https://nriwealthpartners.com
    `;

    await transporter.sendMail({
      from: {
        name: 'NRI Wealth Partners',
        address: process.env.GMAIL_USER || 'newsletters@nriwealthpartners.com'
      },
      to: email,
      subject: 'Confirm Your Newsletter Subscription - The NRI Weekly',
      text: textContent,
      html: htmlContent
    });

    console.log(`✅ Confirmation email sent to ${email}`);
  } catch (emailError) {
    console.error('❌ Failed to send confirmation email:', emailError);
    throw new Error('Failed to send confirmation email');
  }
}
