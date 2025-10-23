export default function Hero() {
  return (
    <section className="relative gradient-dark text-white overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-9 items-center py-16 md:py-20">
          {/* Left Column */}
          <div>
            <div className="inline-flex gap-2.5 items-center bg-pink-light text-[#9d3d6b] px-2.5 py-1.5 rounded-full text-xs font-bold">
              Halloween Special • Family Friendly
            </div>
            <h1 className="text-[42px] leading-tight mt-3.5 font-black">
              Scoop & Scream — <span className="text-pink">Halloween Movie Night</span>
            </h1>
            <p className="text-[#e7e7ea] text-lg mt-2.5">
              £10 per person • <strong>Any dessert</strong> + <strong>Any drink</strong> included. One frightfully sweet night in our cosy gelato parlour.
            </p>
            <div className="flex gap-3 mt-4.5 flex-wrap">
              <a
                href="#tickets"
                className="inline-block px-4.5 py-3 rounded-xl font-semibold no-underline bg-pink-deep text-white border-0 hover:brightness-95 transition-all"
              >
                Get Your Ticket 🎟️
              </a>
              <a
                href="#details"
                className="inline-block px-4.5 py-3 rounded-xl font-semibold no-underline bg-white text-ink border border-border hover:bg-gray-50 transition-colors"
              >
                See What&apos;s Included
              </a>
            </div>
            <div className="mt-3.5 text-[#c9c9cf] text-[13px]">
              Parlour of the Year • 5★ Hygiene • Made fresh daily by Gelato by Maria
            </div>
          </div>

          {/* Right Column - Poster */}
          <div className="border border-white/10 poster-gradient rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4">
              <div className="poster-card-gradient border border-white/10 rounded-2xl p-3.5 text-white">
                <div className="inline-flex gap-2 items-center border border-dashed border-white/25 rounded-xl px-2.5 py-1.5 text-xs">
                  🎬 Tonight&apos;s Vibe
                </div>
                <div className="mt-2 font-bold">Family Spooky Classics</div>
                <div className="text-gray-400 mt-1 text-sm">
                  Think <em>Hocus Pocus</em>, <em>Casper</em>, <em>Hotel Transylvania</em>
                </div>
              </div>
              <div className="poster-card-gradient border border-white/10 rounded-2xl p-3.5 text-white mt-2.5">
                <div className="inline-flex gap-2 items-center border border-dashed border-white/25 rounded-xl px-2.5 py-1.5 text-xs">
                  🍨 Included
                </div>
                <div className="text-gray-400 mt-1.5 text-sm">Any dessert from the menu</div>
                <div className="text-gray-400 mt-1 text-sm">Any drink (deluxe hot choc, coffee, etc.)</div>
              </div>
              <div className="poster-card-gradient border border-white/10 rounded-2xl p-3.5 text-white mt-2.5">
                <div className="inline-flex gap-2 items-center border border-dashed border-white/25 rounded-xl px-2.5 py-1.5 text-xs">
                  📍 When & Where
                </div>
                <div className="text-gray-400 mt-1.5 text-sm">
                  Fri–Sun, 6:00pm seating • The Scoop Company, Warlingham
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
