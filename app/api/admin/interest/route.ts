import { NextRequest, NextResponse } from 'next/server';
import { getInterestSignups, InterestSignup } from '@/lib/interest';

function unauthorized() {
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

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  const base64Credentials = authHeader.split(' ')[1];
  if (!base64Credentials) return false;

  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme';

  return username === 'admin' && password === adminPassword;
}

function toCsv(signups: InterestSignup[]): string {
  const escape = (value: string) => `"${String(value ?? '').replace(/"/g, '""')}"`;

  const rows = signups.map((s) =>
    [s.name, s.email, s.phone, s.signedUpAt].map(escape).join(',')
  );

  return ['Name,Email,Mobile,Registered', ...rows].join('\n');
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorized();
  }

  try {
    const signups = await getInterestSignups();

    if (request.nextUrl.searchParams.get('format') === 'csv') {
      return new NextResponse(toCsv(signups), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="cinema-interest.csv"'
        }
      });
    }

    return NextResponse.json({ count: signups.length, signups });
  } catch (error) {
    console.error('Failed to load cinema interest signups:', error);
    return NextResponse.json(
      { error: 'Failed to load signups' },
      { status: 500 }
    );
  }
}
