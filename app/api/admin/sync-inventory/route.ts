import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getInventory, EVENT_NIGHTS } from '@/lib/inventory';
import { kv } from '@vercel/kv';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

interface SalesByNight {
  [nightKey: string]: {
    displayName: string;
    kidTickets: number;
    adultTickets: number;
    sessionIds: string[];
  };
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

    // Fetch all successful checkout sessions from Stripe
    const sessions = await stripe.checkout.sessions.list({
      limit: 100, // Adjust if you expect more than 100 sales
      status: 'complete',
    });

    // Group sales by night
    const salesByNight: SalesByNight = {};

    // Initialize all nights with zero
    for (const night of EVENT_NIGHTS) {
      salesByNight[night.key] = {
        displayName: night.displayName,
        kidTickets: 0,
        adultTickets: 0,
        sessionIds: [],
      };
    }

    // Process each session
    for (const session of sessions.data) {
      const metadata = session.metadata;

      if (!metadata || !metadata.night_key) {
        console.warn('Session missing metadata:', session.id);
        continue;
      }

      const nightKey = metadata.night_key;

      // Only process if it's one of our event nights
      if (salesByNight[nightKey]) {
        salesByNight[nightKey].kidTickets += parseInt(metadata.kid_tickets || '0');

        // Handle both old (3-tier) and new (2-tier) ticket structures
        if (metadata.adult_tickets) {
          // New structure: single adult ticket type
          salesByNight[nightKey].adultTickets += parseInt(metadata.adult_tickets || '0');
        } else {
          // Old structure: combine adult_drink_tickets and adult_full_tickets
          const adultDrink = parseInt(metadata.adult_drink_tickets || '0');
          const adultFull = parseInt(metadata.adult_full_tickets || '0');
          salesByNight[nightKey].adultTickets += adultDrink + adultFull;
        }

        salesByNight[nightKey].sessionIds.push(session.id);
      }
    }

    // Get current inventory from KV
    const currentInventory = await Promise.all(
      EVENT_NIGHTS.map(async (night) => {
        const inventory = await getInventory(night.key);
        return {
          nightKey: night.key,
          displayName: night.displayName,
          current: inventory,
        };
      })
    );

    // Compare actual sales vs current inventory
    const discrepancies = EVENT_NIGHTS.map((night) => {
      const actual = salesByNight[night.key];
      const current = currentInventory.find(i => i.nightKey === night.key)?.current;

      return {
        nightKey: night.key,
        displayName: night.displayName,
        actualSales: {
          kidTickets: actual.kidTickets,
          adultTickets: actual.adultTickets,
        },
        currentInventory: {
          kidTickets: current?.kid_tickets_sold || 0,
          adultTickets: current?.adult_tickets_sold || 0,
        },
        hasDiscrepancy:
          actual.kidTickets !== (current?.kid_tickets_sold || 0) ||
          actual.adultTickets !== (current?.adult_tickets_sold || 0),
        sessionCount: actual.sessionIds.length,
      };
    });

    return NextResponse.json({
      success: true,
      totalSessions: sessions.data.length,
      discrepancies,
      instructions: {
        message: 'To fix inventory, send a POST request to this endpoint with action=sync',
        example: 'POST /api/admin/sync-inventory with Basic Auth',
      }
    });
  } catch (error) {
    console.error('Error syncing inventory:', error);
    return NextResponse.json(
      { error: 'Error syncing inventory', details: error instanceof Error ? error.message : 'Unknown error' },
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

    // Fetch all successful checkout sessions from Stripe
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: 'complete',
    });

    // Group sales by night
    const salesByNight: SalesByNight = {};

    // Initialize all nights with zero
    for (const night of EVENT_NIGHTS) {
      salesByNight[night.key] = {
        displayName: night.displayName,
        kidTickets: 0,
        adultTickets: 0,
        sessionIds: [],
      };
    }

    // Process each session
    for (const session of sessions.data) {
      const metadata = session.metadata;

      if (!metadata || !metadata.night_key) {
        continue;
      }

      const nightKey = metadata.night_key;

      if (salesByNight[nightKey]) {
        salesByNight[nightKey].kidTickets += parseInt(metadata.kid_tickets || '0');

        // Handle both old (3-tier) and new (2-tier) ticket structures
        if (metadata.adult_tickets) {
          // New structure: single adult ticket type
          salesByNight[nightKey].adultTickets += parseInt(metadata.adult_tickets || '0');
        } else {
          // Old structure: combine adult_drink_tickets and adult_full_tickets
          const adultDrink = parseInt(metadata.adult_drink_tickets || '0');
          const adultFull = parseInt(metadata.adult_full_tickets || '0');
          salesByNight[nightKey].adultTickets += adultDrink + adultFull;
        }

        salesByNight[nightKey].sessionIds.push(session.id);
      }
    }

    // Update inventory in KV to match actual sales
    const updates = [];
    for (const night of EVENT_NIGHTS) {
      const sales = salesByNight[night.key];
      const inventoryKey = `inventory:${night.key}`;

      await kv.set(inventoryKey, {
        kid_tickets_sold: sales.kidTickets,
        adult_tickets_sold: sales.adultTickets,
      });

      updates.push({
        nightKey: night.key,
        displayName: night.displayName,
        updated: {
          kidTickets: sales.kidTickets,
          adultTickets: sales.adultTickets,
        },
        sessionCount: sales.sessionIds.length,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Inventory synchronized with Stripe data',
      updates,
    });
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json(
      { error: 'Error updating inventory', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
