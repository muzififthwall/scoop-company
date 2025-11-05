import { IceCreamCone, Film, Coffee } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-20 bg-[#FFFBF8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
            About the Event
          </h2>

          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#717182', lineHeight: '1.8' }}>
            Join us for Scoop & Sleigh — an event full of Christmas cheer, sweet desserts, and warm drinks inside our award-winning parlour. Watch Christmas classics while you indulge in our seasonal favourites. Perfect for kids, parents, and sweet-toothed elves alike.
          </p>

          {/* Icon grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#F8AFC8' }}>
                <IceCreamCone className="w-8 h-8" style={{ color: '#030213' }} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#1F1B24' }}>Premium Gelato</h3>
              <p style={{ color: '#717182' }}>Any dessert from our menu</p>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#C41E3A' }}>
                <Film className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#1F1B24' }}>Christmas Classics</h3>
              <p style={{ color: '#717182' }}>Family-friendly favourites</p>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#F38DB5' }}>
                <Coffee className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#1F1B24' }}>Any Drink</h3>
              <p style={{ color: '#717182' }}>From our full menu</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
