import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { name, email, night, tickets } = await request.json();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Scoop & Scream: Halloween Movie Night',
              description: `${night} - ${tickets} ticket(s) - Includes any dessert + any drink per person`,
              images: ['https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800'],
            },
            unit_amount: 1000, // £10.00 in pence
          },
          quantity: tickets,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/#tickets`,
      customer_email: email,
      metadata: {
        customer_name: name,
        event_night: night,
        tickets: tickets.toString(),
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
