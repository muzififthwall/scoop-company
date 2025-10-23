export default function Details() {
  return (
    <section id="details" className="py-15">
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-4.5">
          <div className="bg-white border border-border rounded-2xl p-4.5 shadow-sm">
            <h3 className="m-0 mb-1.5 font-bold text-lg">What You Get</h3>
            <ul className="mt-2.5 pl-4.5 text-muted space-y-1.5">
              <li>Any dessert (sundaes, waffles, gelato cones, cookie dough)</li>
              <li>Any drink (deluxe hot chocolate, coffee, teas, softs)</li>
              <li>A cosy seat to watch a family‑friendly Halloween classic</li>
            </ul>
          </div>
          <div className="bg-white border border-border rounded-2xl p-4.5 shadow-sm">
            <h3 className="m-0 mb-1.5 font-bold text-lg">Dates & Times</h3>
            <div className="text-muted">
              Fri 24–Sun 26 October · Early seating from 6:00pm · Movie starts 6:30pm
            </div>
            <div className="inline-flex items-center gap-2 bg-white border border-border rounded-xl px-2.5 py-2 mt-2.5">
              🎟️ £10 per person — includes dessert + drink
            </div>
          </div>
          <div className="bg-white border border-border rounded-2xl p-4.5 shadow-sm">
            <h3 className="m-0 mb-1.5 font-bold text-lg">Menu Highlights</h3>
            <ul className="mt-2.5 pl-4.5 text-muted space-y-1.5">
              <li>S&apos;mores Sundae (torched marshmallow, choc sauce)</li>
              <li>Pumpkin‑Spice Gelato Cone</li>
              <li>Deluxe Hot Chocolate &quot;Cauldron&quot;</li>
              <li>Trick‑or‑Treat Mini Tubs for kids</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
