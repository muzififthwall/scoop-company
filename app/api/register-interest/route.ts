import { NextRequest, NextResponse } from 'next/server';
import { addInterestSignup } from '@/lib/interest';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Please fill in your name, email and mobile number.' },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: 'That email address does not look right.' },
        { status: 400 }
      );
    }

    await addInterestSignup({
      name: name.slice(0, 100),
      email: email.slice(0, 200),
      phone: phone.slice(0, 30),
      signedUpAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to record cinema interest:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
