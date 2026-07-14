'use client';

import { Button } from "./ui/button";
import { TICKETS_SOLD_OUT, BOOKING_COMING_SOON } from "@/lib/inventory";
import { CINEMA_INTEREST_MODE } from "@/lib/cinema-mode";

export function HeroSection() {
  const scrollToTickets = () => {
    document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMovies = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF5F0 100%)' }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl">⭐</div>
        <div className="absolute top-40 right-20 text-5xl">✨</div>
        <div className="absolute bottom-32 left-20 text-7xl">🎬</div>
        <div className="absolute bottom-20 right-32 text-6xl">🍿</div>
        <div className="absolute top-1/2 left-1/4 text-5xl">🌟</div>
        <div className="absolute top-1/3 right-1/4 text-4xl">⭐</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
            <div className="inline-block px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm mb-4">
              <span style={{ color: '#F8AFC8', fontWeight: 600 }}>🎈 Perfect for After School</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl leading-tight" style={{ fontWeight: 800, color: '#1F1B24' }}>
              🍿 Kids Cinema Nights at The Scoop Company 🍦
            </h1>

            <p className="text-xl sm:text-2xl leading-relaxed" style={{ color: '#717182' }}>
              After-school films, sweet treats, and cosy vibes — the perfect midweek treat.
            </p>

            <p className="text-base" style={{ color: '#717182', fontWeight: 600 }}>
              👨‍👩‍👧 Kids welcome • Family-friendly screenings
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={(TICKETS_SOLD_OUT || BOOKING_COMING_SOON) ? undefined : scrollToTickets}
                disabled={TICKETS_SOLD_OUT || BOOKING_COMING_SOON}
                className="w-full sm:w-auto text-base px-6 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: '#F8AFC8', color: 'white', fontWeight: 600 }}
              >
                {CINEMA_INTEREST_MODE ? '🎟️ Register Your Interest' : '🎟️ Book Your Seats'}
              </Button>

              <Button
                onClick={scrollToMovies}
                variant="outline"
                className="w-full sm:w-auto text-base px-6 py-6 rounded-full border-2 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ borderColor: '#F8AFC8', color: '#1F1B24', fontWeight: 600 }}
              >
                🍨 See What's Showing
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl" style={{ background: '#F8AFC8' }}></div>
              <img
                src="/images/header-image.jpg"
                alt="The Scoop Company"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
