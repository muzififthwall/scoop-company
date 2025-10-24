'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      setTimeout(() => setLoading(false), 500);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF5F0 100%)' }}>
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">🎟️</div>
          <p className="text-xl" style={{ color: '#717182' }}>Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF5F0 100%)' }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#FF8C42] blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#F8AFC8] blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-[#F38DB5] blur-2xl"></div>
      </div>

      {/* Floating decorative icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-[10%] text-4xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>🎃</div>
        <div className="absolute top-32 right-[15%] text-3xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>🍦</div>
        <div className="absolute bottom-32 left-[20%] text-3xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>👻</div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <Card className="p-8 md:p-12 bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-[#F8AFC8]/30">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: '#F8AFC8' }}>
                  <CheckCircle2 className="w-12 h-12" style={{ color: '#030213' }} />
                </div>
                <div className="absolute -top-2 -right-2 text-4xl animate-spin" style={{ animationDuration: '3s' }}>✨</div>
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#030213' }}>
                You're All Set! 🎉
              </h1>
              <p className="text-xl" style={{ color: '#717182' }}>
                Your tickets have been confirmed
              </p>
            </div>

            {/* Info Card */}
            <div className="p-6 rounded-2xl space-y-3" style={{ background: 'linear-gradient(135deg, rgba(248, 175, 200, 0.2) 0%, rgba(255, 140, 66, 0.2) 100%)', border: '2px solid rgba(248, 175, 200, 0.3)' }}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" style={{ color: '#F8AFC8' }} />
                <p className="text-lg" style={{ fontWeight: 600, color: '#030213' }}>
                  What's Next?
                </p>
              </div>
              <div className="space-y-2 text-left max-w-md mx-auto" style={{ color: '#030213' }}>
                <p className="flex items-start gap-2">
                  <span className="text-xl">📧</span>
                  <span>Check your email for your ticket confirmation</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-xl">🎟️</span>
                  <span>Show your confirmation at the door on event night</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-xl">🍨</span>
                  <span>Get ready for a frightfully sweet evening!</span>
                </p>
              </div>
            </div>

            {/* Details Note */}
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255, 140, 66, 0.1)', border: '1px solid rgba(255, 140, 66, 0.3)' }}>
              <p className="text-sm" style={{ color: '#030213' }}>
                <strong>Remember:</strong> Your dessert and drink are included! Choose from our full menu when you arrive. 🎃
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/">
                <Button
                  className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  style={{ background: '#F8AFC8', color: '#030213' }}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* Support */}
            <div className="pt-6 border-t border-border">
              <p className="text-sm" style={{ color: '#717182' }}>
                Questions? Email us at{' '}
                <a
                  href="mailto:thescoopcompany@mail.com"
                  className="font-semibold hover:underline"
                  style={{ color: '#F38DB5' }}
                >
                  thescoopcompany@mail.com
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF5F0 100%)' }}>
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">🎟️</div>
          <p className="text-xl" style={{ color: '#717182' }}>Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
