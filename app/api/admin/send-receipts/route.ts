import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { EVENT_NIGHTS } from '@/lib/inventory';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

interface CustomerOrder {
  sessionId: string;
  paymentIntentId: string | null;
  customerEmail: string | null;
  customerName: string;
  eventNight: string;
  kidTickets: number;
  adultDrinkTickets: number;
  adultFullTickets: number;
  totalAmount: number;
  createdAt: string;
  receiptSent: boolean;
}

export async function GET(request: NextRequest) {
  try {
    // Basic auth check
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization required' },
        {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Admin Area"'
          }
        }
      );
    }

    // Decode basic auth
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Check credentials
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme';

    if (username !== 'admin' || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Fetch all successful checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: 'complete',
    });

    const orders: CustomerOrder[] = [];

    // Process each session
    for (const session of sessions.data) {
      const metadata = session.metadata;

      if (!metadata || !metadata.night_key) {
        continue;
      }

      // Get the payment intent to check if receipt was sent
      let paymentIntent = null;
      let receiptSent = false;

      if (session.payment_intent) {
        const piId = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent.id;

        paymentIntent = await stripe.paymentIntents.retrieve(piId);
        receiptSent = !!paymentIntent.receipt_email;
      }

      orders.push({
        sessionId: session.id,
        paymentIntentId: paymentIntent?.id || null,
        customerEmail: session.customer_email || session.customer_details?.email || null,
        customerName: metadata.customer_name || 'Unknown',
        eventNight: metadata.event_night || 'Unknown',
        kidTickets: parseInt(metadata.kid_tickets || '0'),
        adultDrinkTickets: parseInt(metadata.adult_drink_tickets || '0'),
        adultFullTickets: parseInt(metadata.adult_full_tickets || '0'),
        totalAmount: session.amount_total ? session.amount_total / 100 : 0,
        createdAt: new Date(session.created * 1000).toISOString(),
        receiptSent,
      });
    }

    // Count orders without receipts
    const ordersWithoutReceipts = orders.filter(o => !o.receiptSent);

    return NextResponse.json({
      success: true,
      totalOrders: orders.length,
      ordersWithoutReceipts: ordersWithoutReceipts.length,
      orders,
      instructions: {
        message: 'To send receipts manually, you have two options:',
        option1: 'Use Stripe Dashboard: Go to Payments > Click each payment > Click "Send receipt"',
        option2: 'Use this endpoint with POST to get a detailed list for export',
        note: 'Future orders will automatically receive receipts now that payment_intent_data.receipt_email is configured',
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Error fetching orders', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Basic auth check
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization required' },
        {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Admin Area"'
          }
        }
      );
    }

    // Decode basic auth
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Check credentials
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme';

    if (username !== 'admin' || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Fetch all successful checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: 'complete',
    });

    const csvData: string[] = [];
    csvData.push('Customer Email,Customer Name,Event Night,Kid Tickets,Adult Drink Tickets,Adult Full Tickets,Total Amount (£),Date,Receipt Sent,Payment Intent ID');

    // Process each session
    for (const session of sessions.data) {
      const metadata = session.metadata;

      if (!metadata || !metadata.night_key) {
        continue;
      }

      // Get the payment intent to check if receipt was sent
      let paymentIntent = null;
      let receiptSent = false;

      if (session.payment_intent) {
        const piId = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent.id;

        try {
          paymentIntent = await stripe.paymentIntents.retrieve(piId);
          receiptSent = !!paymentIntent.receipt_email;
        } catch (err) {
          console.error('Error retrieving payment intent:', err);
        }
      }

      const email = session.customer_email || session.customer_details?.email || 'NO EMAIL';
      const name = metadata.customer_name || 'Unknown';
      const eventNight = metadata.event_night || 'Unknown';
      const kidTickets = metadata.kid_tickets || '0';
      const adultDrink = metadata.adult_drink_tickets || '0';
      const adultFull = metadata.adult_full_tickets || '0';
      const total = session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00';
      const date = new Date(session.created * 1000).toLocaleDateString('en-GB');
      const piId = paymentIntent?.id || 'N/A';

      csvData.push(`${email},${name},${eventNight},${kidTickets},${adultDrink},${adultFull},${total},${date},${receiptSent ? 'Yes' : 'No'},${piId}`);
    }

    return new NextResponse(csvData.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="customer-orders.csv"',
      },
    });
  } catch (error) {
    console.error('Error generating CSV:', error);
    return NextResponse.json(
      { error: 'Error generating CSV', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
