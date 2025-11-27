/**
 * Newsletter Subscription Confirmation API
 *
 * Confirms email subscription via double opt-in token.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Confirmation token is required' },
        { status: 400 }
      );
    }

    // Initialize Firestore
    const db = getFirestoreDb();

    // Find subscriber by token
    const subscribersRef = db.collection('subscribers');
    const snapshot = await subscribersRef
      .where('unsubscribeToken', '==', token)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid confirmation token' },
        { status: 404 }
      );
    }

    const subscriberDoc = snapshot.docs[0];
    const subscriber = subscriberDoc.data();

    // Check if already confirmed
    if (subscriber.status === 'active') {
      return NextResponse.redirect(
        new URL('/newsletter/already-confirmed', request.url)
      );
    }

    // Confirm subscription
    await subscriberDoc.ref.update({
      status: 'active',
      confirmedAt: new Date()
    });

    console.log(`✅ Subscription confirmed: ${subscriber.email}`);

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/newsletter/confirmed', request.url)
    );
  } catch (error) {
    console.error('❌ Confirmation error:', error);

    return NextResponse.json(
      { error: 'Failed to confirm subscription' },
      { status: 500 }
    );
  }
}
