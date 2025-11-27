/**
 * Newsletter Unsubscribe API
 *
 * Handles one-click unsubscribe with proper error handling.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Unsubscribe token is required' },
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
        { error: 'Invalid unsubscribe token' },
        { status: 404 }
      );
    }

    const subscriberDoc = snapshot.docs[0];
    const subscriber = subscriberDoc.data();

    // Check if already unsubscribed
    if (subscriber.status === 'unsubscribed') {
      return NextResponse.redirect(
        new URL('/newsletter/already-unsubscribed', request.url)
      );
    }

    // Unsubscribe
    await subscriberDoc.ref.update({
      status: 'unsubscribed',
      unsubscribedAt: new Date()
    });

    console.log(`✅ Unsubscribed: ${subscriber.email}`);

    // Redirect to unsubscribe confirmation page
    return NextResponse.redirect(
      new URL('/newsletter/unsubscribed', request.url)
    );
  } catch (error) {
    console.error('❌ Unsubscribe error:', error);

    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Unsubscribe token is required' },
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
        { error: 'Invalid unsubscribe token' },
        { status: 404 }
      );
    }

    const subscriberDoc = snapshot.docs[0];
    const subscriber = subscriberDoc.data();

    // Check if already unsubscribed
    if (subscriber.status === 'unsubscribed') {
      return NextResponse.json({
        success: true,
        message: 'Already unsubscribed'
      });
    }

    // Unsubscribe
    await subscriberDoc.ref.update({
      status: 'unsubscribed',
      unsubscribedAt: new Date()
    });

    console.log(`✅ Unsubscribed: ${subscriber.email}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed'
    });
  } catch (error) {
    console.error('❌ Unsubscribe error:', error);

    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
