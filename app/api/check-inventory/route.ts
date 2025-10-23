import { NextRequest, NextResponse } from 'next/server';
import { getAllAvailability, getAvailability, getNightKeyFromValue, cleanupExpiredReservations } from '@/lib/inventory';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const night = searchParams.get('night');

    // Clean up expired reservations on each request
    await cleanupExpiredReservations();

    if (night) {
      // Get availability for specific night
      const nightKey = getNightKeyFromValue(night);

      if (!nightKey) {
        return NextResponse.json(
          { error: 'Invalid night value' },
          { status: 400 }
        );
      }

      const availability = await getAvailability(nightKey);
      return NextResponse.json(availability);
    } else {
      // Get availability for all nights
      const availabilities = await getAllAvailability();
      return NextResponse.json(availabilities);
    }
  } catch (error) {
    console.error('Error checking inventory:', error);
    return NextResponse.json(
      { error: 'Error checking inventory' },
      { status: 500 }
    );
  }
}
