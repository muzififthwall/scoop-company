import { Film, MapPin, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { CINEMA_INTEREST_MODE } from "@/lib/cinema-mode";

export function EventDetailsSection() {
  return (
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF5F0 100%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-center mb-12" style={{ fontWeight: 800, color: '#1F1B24' }}>
            🎬 Location &amp; Info
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* What's On */}
            <Card className="p-8 bg-white border-2 hover:border-[#F8AFC8] transition-all hover:shadow-xl">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#F8AFC8' }}>
                  <Film className="w-8 h-8" style={{ color: '#FFFFFF' }} />
                </div>
                <h3 className="text-2xl" style={{ fontWeight: 700, color: '#1F1B24' }}>What&apos;s On</h3>
                {CINEMA_INTEREST_MODE ? (
                  <div className="space-y-2" style={{ color: '#5C5C6B' }}>
                    <p style={{ fontWeight: 600, color: '#1F1B24' }}>Films TBC</p>
                    <p className="text-sm">All your winter faves. We announce the line-up along with the dates.</p>
                  </div>
                ) : (
                  <div className="space-y-2" style={{ color: '#5C5C6B' }}>
                    <p style={{ fontWeight: 600, color: '#1F1B24' }}>Gnomeo &amp; Juliet</p>
                    <p style={{ fontWeight: 600, color: '#1F1B24' }}>Tangled</p>
                    <p className="text-sm mt-3">Two family films this week</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Where */}
            <Card className="p-8 bg-white border-2 hover:border-[#F38DB5] transition-all hover:shadow-xl">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#F38DB5' }}>
                  <MapPin className="w-8 h-8" style={{ color: '#FFFFFF' }} />
                </div>
                <h3 className="text-2xl" style={{ fontWeight: 700, color: '#1F1B24' }}>Where</h3>
                <div style={{ color: '#5C5C6B' }}>
                  <p style={{ fontWeight: 600, color: '#1F1B24' }}>The Scoop Company</p>
                  <p>369 Limpsfield Road</p>
                  <p>Warlingham</p>
                  <p className="mt-2 text-sm">🚗 Free parking nearby</p>
                </div>
              </div>
            </Card>

            {/* When */}
            <Card className="p-8 bg-white border-2 hover:border-[#E8A87C] transition-all hover:shadow-xl">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#E8A87C' }}>
                  <Clock className="w-8 h-8" style={{ color: '#FFFFFF' }} />
                </div>
                <h3 className="text-2xl" style={{ fontWeight: 700, color: '#1F1B24' }}>When</h3>
                {CINEMA_INTEREST_MODE ? (
                  <div style={{ color: '#5C5C6B' }}>
                    <p style={{ fontWeight: 600, color: '#1F1B24' }}>Dates TBC</p>
                    <p className="text-sm mt-2">
                      Back when the nights draw in. Join the list and we&apos;ll email you the moment they&apos;re set.
                    </p>
                  </div>
                ) : (
                  <div style={{ color: '#5C5C6B' }}>
                    <p style={{ fontWeight: 600, color: '#1F1B24' }}>Thu 19th &amp; Fri 20th</p>
                    <p>4:30pm start</p>
                    <p className="text-sm mt-2">Please arrive 10 to 15 mins early</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Subtext */}
          <div className="mt-12 text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border-2 border-[#F8AFC8]/30">
            <p className="text-lg" style={{ color: '#1F1B24' }}>
              {CINEMA_INTEREST_MODE ? (
                <>
                  👨‍👩‍👧 <span style={{ fontWeight: 600 }}>Kids &amp; families welcome</span> •{' '}
                  🎟️ <span style={{ fontWeight: 600 }}>Seats are limited</span> •{' '}
                  ❄️ <span style={{ fontWeight: 600 }}>The list gets first pick</span>
                </>
              ) : (
                <>
                  👨‍👩‍👧 <span style={{ fontWeight: 600 }}>Kids &amp; families welcome</span> •{' '}
                  🎟️ <span style={{ fontWeight: 600 }}>Limited seats</span> •{' '}
                  🍦 <span style={{ fontWeight: 600 }}>Book early!</span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
