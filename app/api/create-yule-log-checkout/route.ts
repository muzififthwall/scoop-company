import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

interface CartItem {
  id: string;
  flavour: string;
  sauces: string[];
  toppings: string[];
  quantity: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  collectionDate: string;
  deliveryOption: 'collect' | 'delivery';
}

const BASE_PRICE = 29.99;

export async function POST(request: NextRequest) {
  try {
    const { cart, customerInfo }: { cart: CartItem[]; customerInfo: CustomerInfo } = await request.json();

    // Validate inputs
    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.collectionDate) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    // Validate collection date is at least 72 hours in the future
    const collectionDate = new Date(customerInfo.collectionDate);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);

    if (collectionDate < minDate) {
      return NextResponse.json(
        { error: 'Collection date must be at least 72 hours in the future' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = cart.map((item, index) => {
      const customizations = [];
      if (item.sauces.length > 0) {
        customizations.push(`Sauces: ${item.sauces.join(', ')}`);
      }
      if (item.toppings.length > 0) {
        customizations.push(`Toppings: ${item.toppings.join(', ')}`);
      }

      const description = [
        `Flavour: ${item.flavour}`,
        ...customizations
      ].join(' | ');

      return {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Gelato Yule Log #${index + 1}`,
            description: description,
          },
          unit_amount: Math.round(BASE_PRICE * 100), // Convert to pence
        },
        quantity: item.quantity,
      };
    });

    // Calculate total for metadata
    const total = cart.reduce((sum, item) => sum + (BASE_PRICE * item.quantity), 0);

    // Format collection date
    const collectionDateFormatted = new Date(customerInfo.collectionDate).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create order summary for metadata
    const orderSummary = cart.map((item, index) => {
      const customizations = [];
      if (item.sauces.length > 0) {
        customizations.push(`Sauces: ${item.sauces.join(', ')}`);
      }
      if (item.toppings.length > 0) {
        customizations.push(`Toppings: ${item.toppings.join(', ')}`);
      }

      return `#${index + 1}: ${item.flavour} x${item.quantity}${customizations.length > 0 ? ` (${customizations.join('; ')})` : ''}`;
    }).join(' | ');

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}&type=yule-log`,
      cancel_url: `${request.nextUrl.origin}/yule-log`,
      customer_email: customerInfo.email,
      metadata: {
        product_type: 'yule_log',
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        collection_date: customerInfo.collectionDate,
        collection_date_formatted: collectionDateFormatted,
        delivery_option: customerInfo.deliveryOption,
        total_amount: total.toFixed(2),
        order_summary: orderSummary.substring(0, 500), // Stripe metadata has 500 char limit per field
        items_count: cart.length.toString(),
      },
      payment_intent_data: {
        metadata: {
          product_type: 'yule_log',
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone,
          collection_date: customerInfo.collectionDate,
          collection_date_formatted: collectionDateFormatted,
          delivery_option: customerInfo.deliveryOption,
          order_summary: orderSummary.substring(0, 500),
        },
        receipt_email: customerInfo.email,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating yule log checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
