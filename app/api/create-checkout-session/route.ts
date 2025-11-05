import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { reserveTickets, getNightKeyFromValue } from '@/lib/inventory';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { name, email, night, kidTickets, adultTickets } = await request.json();

    // Validate inputs
    if (!name || !email || !night) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!kidTickets || kidTickets < 1) {
      return NextResponse.json(
        { error: 'At least 1 kid ticket is required' },
        { status: 400 }
      );
    }

    if ((adultTickets || 0) > 0 && kidTickets < 1) {
      return NextResponse.json(
        { error: 'Must have at least 1 kid ticket to book adult tickets' },
        { status: 400 }
      );
    }

    // Get night key from value
    const nightKey = getNightKeyFromValue(night);
    if (!nightKey) {
      return NextResponse.json(
        { error: 'Invalid night value' },
        { status: 400 }
      );
    }

    // Create a temporary session ID for reservation
    const tempSessionId = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Reserve tickets before creating Stripe session
    const reservationResult = await reserveTickets(nightKey, kidTickets, adultTickets || 0, tempSessionId);

    if (!reservationResult.success) {
      return NextResponse.json(
        { error: reservationResult.error || 'Failed to reserve tickets' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = [];

    // Kids tickets - £12 each
    if (kidTickets > 0) {
      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Kids Ticket - ${night}`,
            description: 'Any dessert + any drink',
            images: ['https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800'],
          },
          unit_amount: 1200, // £12.00 in pence
        },
        quantity: kidTickets,
      });
    }

    // Adult tickets - £12 each
    if ((adultTickets || 0) > 0) {
      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Adult Ticket - ${night}`,
            description: 'Any dessert + any drink',
            images: ['https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800'],
          },
          unit_amount: 1200, // £12.00 in pence
        },
        quantity: adultTickets,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/#tickets`,
      customer_email: email,
      metadata: {
        customer_name: name,
        event_night: night,
        night_key: nightKey,
        kid_tickets: kidTickets.toString(),
        adult_tickets: (adultTickets || 0).toString(),
        temp_session_id: tempSessionId,
      },
      // IMPORTANT: Also attach metadata and email to the Payment Intent
      // This ensures:
      // 1. Stripe can send automatic receipt emails
      // 2. Metadata is visible in Stripe Dashboard > Payments
      // 3. Manual receipt sending is easier
      payment_intent_data: {
        metadata: {
          customer_name: name,
          event_night: night,
          night_key: nightKey,
          kid_tickets: kidTickets.toString(),
          adult_tickets: (adultTickets || 0).toString(),
          temp_session_id: tempSessionId,
        },
        receipt_email: email,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
