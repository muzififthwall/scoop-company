import { Card } from "./ui/card";
import { Sparkles } from "lucide-react";

const menuItems = [
  {
    name: "S'mores Sundae",
    description: "Torched marshmallow, graham cracker crumble, chocolate gelato",
    image: "https://images.unsplash.com/photo-1633997455043-434ee7ca3e1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbW9yZXMlMjBkZXNzZXJ0JTIwbWFyc2htYWxsb3d8ZW58MXx8fHwxNzYxMjUwMTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "#F8AFC8"
  },
  {
    name: "Pumpkin-Spice Cone",
    description: "Whipped vanilla gelato with autumn spices & edible stars",
    image: "https://images.unsplash.com/photo-1696810146967-c16c6fd7d099?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdW1wa2luJTIwc3BpY2UlMjBkZXNzZXJ0fGVufDF8fHx8MTc2MTI1MDIwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "#FF8C42"
  },
  {
    name: "Hot Chocolate Cauldron",
    description: "Thick, creamy, decadent — served in a spooky mug",
    image: "https://images.unsplash.com/photo-1572839101084-3928fd0f63c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3QlMjBjaG9jb2xhdGUlMjBtdWclMjBjb3p5fGVufDF8fHx8MTc2MTI1MDIwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    color: "#F38DB5"
  }
];

export function MenuHighlightsSection() {
  return (
    <section className="py-20 bg-[#FFFBF8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#030213' }}>
              Halloween Menu Highlights
            </h2>
            <p className="text-xl" style={{ color: '#717182' }}>
              Choose any dessert from our full menu on the night ✨
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {menuItems.map((item, index) => (
              <Card key={index} className="overflow-hidden border-2 border-transparent hover:border-[#F8AFC8] transition-all hover:shadow-2xl group">
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
                </div>

                <div className="p-6 bg-white space-y-2">
                  <h3 className="text-xl" style={{ fontWeight: 700, color: '#030213' }}>
                    {item.name}
                  </h3>
                  <p style={{ color: '#717182' }}>
                    {item.description}
                  </p>
                </div>

                {/* Decorative doodle */}
                <div className="absolute top-2 left-2 text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  {index === 0 ? '🔥' : index === 1 ? '🎃' : '🍫'}
                </div>
              </Card>
            ))}
          </div>

          {/* Additional note */}
          <div className="mt-12 text-center p-6 rounded-2xl bg-gradient-to-r from-[#FFE8F0] to-[#FFF5F0]">
            <p className="text-lg" style={{ color: '#030213' }}>
              Plus all your favourite flavours from our regular menu! 🍦
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
