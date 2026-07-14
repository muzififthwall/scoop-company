'use client';

import { Card } from "./ui/card";
import { Check } from "lucide-react";
import { CINEMA_INTEREST_MODE } from "@/lib/cinema-mode";

export function PricingSection() {
  const scrollToTickets = () => {
    document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="how-it-works" className="py-20" style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF5F0 100%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
              ✨ How It Works
            </h2>
            <p className="text-xl" style={{ color: '#5C5C6B' }}>
              {CINEMA_INTEREST_MODE
                ? 'Here is how a cinema night runs when we are back.'
                : 'Simple, fun, and perfectly sweet'}
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
            <Card className="p-6 bg-white border-2 border-transparent hover:border-[#F8AFC8] transition-all">
              <div className="text-center space-y-3">
                <h3 style={{ fontWeight: 700, color: '#1F1B24' }}>Pick your film</h3>
              </div>
            </Card>

            <Card className="p-6 bg-white border-2 border-transparent hover:border-[#F8AFC8] transition-all">
              <div className="text-center space-y-3">
                <h3 style={{ fontWeight: 700, color: '#1F1B24' }}>Book your seats</h3>
              </div>
            </Card>

            <Card className="p-6 bg-white border-2 border-transparent hover:border-[#F8AFC8] transition-all">
              <div className="text-center space-y-3">
                <h3 style={{ fontWeight: 700, color: '#1F1B24' }}>Arrive & choose treats</h3>
              </div>
            </Card>

            <Card className="p-6 bg-white border-2 border-transparent hover:border-[#F8AFC8] transition-all">
              <div className="text-center space-y-3">
                <h3 style={{ fontWeight: 700, color: '#1F1B24' }}>Enjoy the movie 🎬✨</h3>
              </div>
            </Card>
          </div>

          {/* Ticket Cards */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Kids Ticket */}
              <Card
                role="button"
                tabIndex={0}
                aria-label={CINEMA_INTEREST_MODE ? 'Register your interest' : 'Book kids tickets'}
                className="relative p-8 bg-white border-2 transition-all hover:shadow-2xl cursor-pointer border-transparent hover:border-[#F8AFC8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4416B] focus-visible:ring-offset-2"
                onClick={scrollToTickets}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToTickets(); } }}
              >
                <div className="text-center space-y-4">
                  <div className="text-3xl">🎟️</div>

                  <h3 className="text-2xl" style={{ fontWeight: 700, color: '#1F1B24' }}>
                    Kids Cinema Ticket
                  </h3>

                  <div className="py-4">
                    <div className="text-5xl" style={{ fontWeight: 800, color: '#C4416B' }}>
                      £12
                    </div>
                    <p className="mt-2" style={{ color: '#5C5C6B' }}>
                      per child
                    </p>
                  </div>

                  <div className="p-3 rounded-lg" style={{ background: '#FFE8F0' }}>
                    <p style={{ fontWeight: 600, color: '#1F1B24' }}>
                      Any dessert + any drink
                    </p>
                  </div>

                  <div className="pt-4 space-y-3 text-left">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#F8AFC8' }} />
                      <span style={{ color: '#5C5C6B' }}>Entry to the movie</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#F8AFC8' }} />
                      <span style={{ color: '#5C5C6B' }}>Any dessert</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#F8AFC8' }} />
                      <span style={{ color: '#5C5C6B' }}>Any drink</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Adult Ticket */}
              <Card
                role="button"
                tabIndex={0}
                aria-label={CINEMA_INTEREST_MODE ? 'Register your interest' : 'Book adult tickets'}
                className="relative p-8 bg-white border-2 transition-all hover:shadow-2xl cursor-pointer border-transparent hover:border-[#E8A87C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9662F] focus-visible:ring-offset-2"
                onClick={scrollToTickets}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToTickets(); } }}
              >
                <div className="text-center space-y-4">
                  <div className="text-3xl">👨‍👩‍👧</div>

                  <h3 className="text-2xl" style={{ fontWeight: 700, color: '#1F1B24' }}>
                    Adult Ticket
                  </h3>

                  <div className="py-4">
                    <div className="text-5xl" style={{ fontWeight: 800, color: '#A9662F' }}>
                      £12
                    </div>
                    <p className="mt-2" style={{ color: '#5C5C6B' }}>
                      per adult
                    </p>
                  </div>

                  <div className="p-3 rounded-lg" style={{ background: '#FFF5E8' }}>
                    <p style={{ fontWeight: 600, color: '#1F1B24' }}>
                      Any dessert + any drink
                    </p>
                  </div>

                  <div className="pt-4 space-y-3 text-left">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#E8A87C' }} />
                      <span style={{ color: '#5C5C6B' }}>Entry to the movie</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#E8A87C' }} />
                      <span style={{ color: '#5C5C6B' }}>Any dessert</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#E8A87C' }} />
                      <span style={{ color: '#5C5C6B' }}>Any drink</span>
                    </div>
                  </div>

                  <div className="pt-4 p-3 rounded-lg" style={{ background: '#FFF3CD' }}>
                    <p className="text-sm" style={{ color: '#856404', fontWeight: 600 }}>
                      ⚠️ Must be booked with a child ticket
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Seating Info */}
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <div className="text-center space-y-3">
                <div className="text-3xl">🪑</div>
                <h4 className="text-lg" style={{ fontWeight: 700, color: '#1F1B24' }}>Seating Arranged for Little Ones</h4>
                <p style={{ color: '#5C5C6B' }}>
                  Seating is arranged to make sure all children can see the screen clearly. Parents and carers are seated nearby to keep everyone comfortable.
                </p>
              </div>
            </Card>
          </div>

          {/* Event Details */}
          {/* Off season there are no dates to show, and Location & Info below
              already carries the address. In season this repeats them up top. */}
          {!CINEMA_INTEREST_MODE && (
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card className="p-6 bg-white/80 backdrop-blur-sm text-center">
                <div className="text-3xl mb-2">🗓</div>
                <h4 style={{ fontWeight: 700, color: '#1F1B24' }}>When</h4>
                <p style={{ color: '#5C5C6B' }}>Thu 19th &amp; Fri 20th</p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm text-center">
                <div className="text-3xl mb-2">📍</div>
                <h4 style={{ fontWeight: 700, color: '#1F1B24' }}>Where</h4>
                <p style={{ color: '#5C5C6B' }}>The Scoop Company, Warlingham</p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm text-center">
                <div className="text-3xl mb-2">🕗</div>
                <h4 style={{ fontWeight: 700, color: '#1F1B24' }}>Time</h4>
                <p style={{ color: '#5C5C6B' }}>4:30pm start</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
