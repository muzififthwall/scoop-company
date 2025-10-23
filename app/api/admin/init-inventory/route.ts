import { NextRequest, NextResponse } from 'next/server';
import { initializeInventory } from '@/lib/inventory';

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

    // Check credentials (use environment variable for password)
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme';

    if (username !== 'admin' || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Initialize inventory
    await initializeInventory();

    return NextResponse.json({
      success: true,
      message: 'Inventory initialized successfully for all 5 nights'
    });
  } catch (error) {
    console.error('Error initializing inventory:', error);
    return NextResponse.json(
      { error: 'Error initializing inventory' },
      { status: 500 }
    );
  }
}
