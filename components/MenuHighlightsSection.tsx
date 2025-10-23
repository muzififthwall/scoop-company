import { Card } from "./ui/card";
import { Sparkles } from "lucide-react";

const menuItems = [
  {
    name: "S'mores Cone 🔥",
    description: "Black cone, torched marshmallow, and chocolate drizzle — a little campfire magic in every bite.",
    image: "/images/smores-cone.jpg",
    color: "#F8AFC8",
    emoji: "🔥",
    doodle: "✨"
  },
  {
    name: "Black Cone with White Candy Floss 👻",
    description: "Spooky, sweet, and seriously Insta-worthy — looks haunting, tastes heavenly.",
    image: "/images/black-cone.jpg",
    color: "#1F1B24",
    emoji: "👻",
    doodle: "🦇"
  },
  {
    name: "Deluxe Hot Chocolate ☕",
    description: "Rich, creamy, and topped with whipped cream — warms your soul and melts your willpower.",
    image: "/images/hot-chocolate.jpg",
    color: "#F38DB5",
    emoji: "☕",
    doodle: "☁️"
  },
  {
    name: "5 Mini Cones 🍬",
    description: "Five tiny cones stacked with fun — perfect for sharing (if you actually want to).",
    image: "/images/mini-cones.jpg",
    color: "#FF8C42",
    emoji: "🍬",
    doodle: "🍭"
  }
];

export function MenuHighlightsSection() {
  return (
    <section className="py-20 bg-[#FFFBF8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
              Menu Highlights
            </h2>
            <p className="text-xl" style={{ color: '#717182' }}>
              Every ticket includes your pick from the menu — no spooky upsells.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {menuItems.map((item, index) => (
              <Card key={index} className="overflow-hidden border-2 border-transparent hover:border-[#F8AFC8] transition-all hover:shadow-2xl group relative">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Floating icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: item.color }}>
                    <Sparkles className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                  </div>

                  {/* Halloween doodle in corner */}
                  <div className="absolute bottom-4 left-4 text-2xl opacity-70">
                    {item.doodle}
                  </div>
                </div>

                <div className="p-6 bg-white space-y-2">
                  <h3 className="text-lg" style={{ fontWeight: 700, color: '#1F1B24' }}>
                    {item.name}
                  </h3>
                  <p style={{ color: '#717182' }}>
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional note */}
          <div className="mt-12 text-center p-6 rounded-2xl bg-gradient-to-r from-[#FFE8F0] to-[#FFF5F0]">
            <p className="text-lg" style={{ color: '#1F1B24' }}>
              Plus all your favourite flavours from our regular menu! 🍦
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
