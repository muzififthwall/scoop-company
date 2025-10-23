'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Could fetch session details here if needed
      setTimeout(() => setLoading(false), 500);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="text-center">
          <div className="text-4xl mb-4">🎟️</div>
          <p className="text-muted">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4">
      <div className="max-w-md w-full">
        <div className="bg-white border border-border rounded-3xl p-8 shadow-lg text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-black mb-3">You&apos;re All Set!</h1>
          <p className="text-muted mb-6">
            Check your email for your ticket confirmation. Just show it at the door on the night of your event!
          </p>
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6 mb-6">
            <div className="text-4xl mb-3">🍨</div>
            <p className="text-sm text-ink font-medium">
              Get ready for a frightfully sweet night of family-friendly Halloween movies, delicious desserts, and cozy vibes!
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Questions? Email us at{' '}
              <a href="mailto:hello@thescoopcompany.co.uk" className="text-pink-deep hover:underline">
                hello@thescoopcompany.co.uk
              </a>
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-pink-deep text-white rounded-xl font-semibold hover:brightness-95 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="text-center">
          <div className="text-4xl mb-4">🎟️</div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
