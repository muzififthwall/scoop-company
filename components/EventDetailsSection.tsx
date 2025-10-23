import { Film, MapPin, Clock } from "lucide-react";
import { Card } from "./ui/card";

export function EventDetailsSection() {
  return (
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF5F0 100%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-center mb-12" style={{ fontWeight: 800, color: '#030213' }}>
            Event Details
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* What's On */}
            <Card className="p-8 bg-white border-2 hover:border-[#F8AFC8] transition-all hover:shadow-xl">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#F8AFC8' }}>
                  <Film className="w-8 h-8" style={{ color: '#030213' }} />
                </div>
                <h3 className="text-2xl" style={{ fontWeight: 700, color: '#030213' }}>What's On</h3>
                <div className="space-y-2" style={{ color: '#717182' }}>
                  <p style={{ fontWeight: 600 }}>Hocus Pocus</p>
                  <p style={{ fontWeight: 600 }}>Casper</p>
                  <p style={{ fontWeight: 600 }}>Hotel Transylvania</p>
                </div>
              </div>
            </Card>

            {/* Where */}
            <Card className="p-8 bg-white border-2 hover:border-[#FF8C42] transition-all hover:shadow-xl">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#FF8C42' }}>
                  <MapPin className="w-8 h-8" style={{ color: '#FFFFFF' }} />
                </div>
                <h3 className="text-2xl" style={{ fontWeight: 700, color: '#030213' }}>Where</h3>
                <div style={{ color: '#717182' }}>
                  <p style={{ fontWeight: 600 }}>The Scoop Company</p>
                  <p>Warlingham</p>
                  <p className="mt-2">Cosy gelato parlour</p>
                </div>
              </div>
            </Card>

            {/* When */}
            <Card className="p-8 bg-white border-2 hover:border-[#F38DB5] transition-all hover:shadow-xl">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#F38DB5' }}>
                  <Clock className="w-8 h-8" style={{ color: '#FFFFFF' }} />
                </div>
                <h3 className="text-2xl" style={{ fontWeight: 700, color: '#030213' }}>When</h3>
                <div style={{ color: '#717182' }}>
                  <p style={{ fontWeight: 600 }}>Monday - Friday</p>
                  <p>4:45 PM onwards</p>
                  <p className="mt-2">27th - 31st October</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Subtext */}
          <div className="mt-12 text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border-2 border-[#F8AFC8]/30">
            <p className="text-lg" style={{ color: '#030213' }}>
              🎃 <span style={{ fontWeight: 600 }}>Family-friendly</span> • 
              🎟️ <span style={{ fontWeight: 600 }}>Seats are limited</span> • 
              ⏰ <span style={{ fontWeight: 600 }}>Book early!</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
