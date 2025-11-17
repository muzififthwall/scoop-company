import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { confirmBooking, releaseReservation } from '@/lib/inventory';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Extract metadata
        const metadata = session.metadata;
        if (!metadata) {
          console.error('No metadata found in session');
          return NextResponse.json({ error: 'No metadata' }, { status: 400 });
        }

        // Check if this is a yule log order or ticket order
        const productType = metadata.product_type;

        if (productType === 'yule_log') {
          // Handle yule log order - no inventory tracking needed
          console.log('Yule Log order confirmed:', {
            sessionId: session.id,
            customerName: metadata.customer_name,
            customerEmail: session.customer_email,
            collectionDate: metadata.collection_date_formatted,
            deliveryOption: metadata.delivery_option,
            orderSummary: metadata.order_summary,
            totalAmount: metadata.total_amount
          });
          // In production, you might want to:
          // - Store the order in a database
          // - Send a confirmation email
          // - Notify the kitchen/staff
        } else {
          // Handle ticket order with inventory
          const { night_key, kid_tickets, adult_tickets, temp_session_id } = metadata;

          if (!night_key || !kid_tickets || !temp_session_id) {
            console.error('Missing required metadata fields');
            return NextResponse.json(
              { error: 'Missing metadata fields' },
              { status: 400 }
            );
          }

          // Confirm the booking (permanently deduct from inventory)
          const result = await confirmBooking(
            night_key,
            parseInt(kid_tickets),
            parseInt(adult_tickets || '0'),
            temp_session_id
          );

          if (!result.success) {
            console.error('Failed to confirm booking:', result.error);
            // Note: Payment already succeeded, so we log the error but don't fail the webhook
            // In a production system, you'd want to handle this more gracefully (e.g., alert admins)
          }

          console.log('Ticket booking confirmed for session:', session.id);
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Release the reservation
        const metadata = session.metadata;
        if (metadata?.temp_session_id && metadata?.night_key) {
          await releaseReservation(metadata.temp_session_id, metadata.night_key);
          console.log('Reservation released for expired session:', session.id);
        }
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Release the reservation
        const metadata = session.metadata;
        if (metadata?.temp_session_id && metadata?.night_key) {
          await releaseReservation(metadata.temp_session_id, metadata.night_key);
          console.log('Reservation released for failed payment session:', session.id);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
