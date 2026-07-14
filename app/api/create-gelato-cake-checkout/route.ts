import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GELATO_CAKES_SOLD_OUT } from '@/lib/inventory';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

interface CartItem {
  id: string;
  size: 'small' | 'large';
  buttercream: 'small' | 'full' | 'none';
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

// Pricing constants
const SIZE_PRICES = {
  small: 27.99,
  large: 34.99
};

const BUTTERCREAM_PRICES = {
  small: 0,
  full: 2.00,
  none: 0
};

// Helper to get flavour display name
const getFlavourName = (flavourId: string) => {
  const names: { [key: string]: string } = {
    'vanilla': 'Classic Vanilla',
    'strawberry': 'Strawberry Swirl',
    'pistachio': 'Pistachio Dream',
    'chocolate': 'Belgian Chocolate',
    'mango': 'Mango Sorbet',
    'salted-caramel': 'Salted Caramel',
    'hazelnut': 'Roasted Hazelnut',
    'lemon': 'Zesty Lemon',
    'mint': 'Mint Choc Chip',
    'raspberry': 'Raspberry Ripple',
  };
  return names[flavourId] || flavourId;
};

// Calculate price for a single item
const calculateItemPrice = (item: CartItem): number => {
  const sizePrice = SIZE_PRICES[item.size];
  const buttercreamPrice = BUTTERCREAM_PRICES[item.buttercream];
  return sizePrice + buttercreamPrice;
};

export async function POST(request: NextRequest) {
  try {
    // Check if Gelato Cakes are sold out
    if (GELATO_CAKES_SOLD_OUT) {
      return NextResponse.json(
        { error: 'Gelato Cakes are sold out' },
        { status: 400 }
      );
    }

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
      const sizeLabel = item.size === 'small' ? 'Small (6-8)' : 'Large (10-12)';
      const buttercreamLabel = item.buttercream === 'small' ? 'Small Decorative' : item.buttercream === 'full' ? 'Full Coverage' : 'None';

      const customizations = [
        `Size: ${sizeLabel}`,
        `Buttercream: ${buttercreamLabel}`,
        `Flavour: ${getFlavourName(item.flavour)}`,
      ];

      if (item.sauces.length > 0) {
        customizations.push(`Sauces: ${item.sauces.join(', ')}`);
      }
      if (item.toppings.length > 0) {
        customizations.push(`Toppings: ${item.toppings.join(', ')}`);
      }

      const description = customizations.join(' | ');
      const unitPrice = calculateItemPrice(item);

      return {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Gelato Cake #${index + 1}`,
            description: description,
          },
          unit_amount: Math.round(unitPrice * 100), // Convert to pence
        },
        quantity: item.quantity,
      };
    });

    // Calculate total for metadata
    const total = cart.reduce((sum, item) => sum + (calculateItemPrice(item) * item.quantity), 0);

    // Format collection date
    const collectionDateFormatted = new Date(customerInfo.collectionDate).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create order summary for metadata
    const orderSummary = cart.map((item, index) => {
      const sizeLabel = item.size === 'small' ? 'Small' : 'Large';
      const buttercreamLabel = item.buttercream === 'small' ? 'Sm BC' : item.buttercream === 'full' ? 'Full BC' : 'No BC';
      const customizations = [];

      if (item.sauces.length > 0) {
        customizations.push(`S: ${item.sauces.join(', ')}`);
      }
      if (item.toppings.length > 0) {
        customizations.push(`T: ${item.toppings.join(', ')}`);
      }

      return `#${index + 1}: ${sizeLabel} ${getFlavourName(item.flavour)} (${buttercreamLabel}) x${item.quantity}${customizations.length > 0 ? ` [${customizations.join('; ')}]` : ''}`;
    }).join(' | ');

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}&type=gelato-cake`,
      cancel_url: `${request.nextUrl.origin}/#builder`,
      customer_email: customerInfo.email,
      metadata: {
        product_type: 'gelato_cake',
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
          product_type: 'gelato_cake',
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
    console.error('Error creating gelato cake checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
