export default function Navigation() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-[#F8AFC8]/30" style={{ background: 'rgba(248, 175, 200, 0.9)' }}>
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="flex items-center justify-between py-3.5">
          <div className="flex gap-2.5 items-center font-bold" style={{ color: '#1F1B24' }}>
            The Scoop Company
          </div>
          <div className="flex gap-3 items-center">
            <a
              href="/yule-log"
              className="inline-block px-4 py-3 rounded-xl border border-white/40 font-semibold no-underline bg-white hover:bg-gray-50 transition-colors"
              style={{ color: '#1F1B24' }}
            >
              Order Yule Log
            </a>
            <a
              href="/"
              className="inline-block px-4 py-3 rounded-xl border border-white/40 font-semibold no-underline bg-white hover:bg-gray-50 transition-colors"
              style={{ color: '#1F1B24' }}
            >
              Get Tickets
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
