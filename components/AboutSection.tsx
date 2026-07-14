import { Film, Sparkles } from "lucide-react";
import { Card } from "./ui/card";

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-[#FFFBF8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-center mb-4" style={{ fontWeight: 800, color: '#1F1B24' }}>
            🎬 What's On
          </h2>

          <p className="text-xl max-w-2xl mx-auto text-center mb-12" style={{ color: '#5C5C6B', lineHeight: '1.8' }}>
            Each ticket includes a dessert and a drink, chosen on the day.
          </p>

          {/* Movie Schedule */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 bg-white border-2 border-transparent hover:border-[#F8AFC8] transition-all hover:shadow-xl">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#F8AFC8' }}>
                <Film className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3 className="text-xl mb-2" style={{ fontWeight: 700, color: '#1F1B24' }}>Thursday 19th, 4:30pm</h3>
              <p className="text-2xl mb-2">🎬</p>
              <p className="text-lg mb-2" style={{ fontWeight: 600, color: '#F8AFC8' }}>Gnomeo & Juliet</p>
              <p className="text-sm" style={{ color: '#5C5C6B' }}>A fun, colourful retelling of a classic story, perfect for younger viewers.</p>
            </Card>

            <Card className="p-8 bg-white border-2 border-transparent hover:border-[#F8AFC8] transition-all hover:shadow-xl">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#F38DB5' }}>
                <Sparkles className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3 className="text-xl mb-2" style={{ fontWeight: 700, color: '#1F1B24' }}>Friday 20th, 4:30pm</h3>
              <p className="text-2xl mb-2">🎬</p>
              <p className="text-lg mb-2" style={{ fontWeight: 600, color: '#F38DB5' }}>Tangled</p>
              <p className="text-sm" style={{ color: '#5C5C6B' }}>A much-loved Disney favourite, full of music, adventure and laughs.</p>
            </Card>
          </div>

          {/* Note */}
          <div className="mt-8 p-4 rounded-xl text-center" style={{ background: '#FFE8F0' }}>
            <p style={{ color: '#1F1B24', fontWeight: 600 }}>
              ⏰ Films start promptly at 4:30pm. Please arrive 10 to 15 minutes early.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
