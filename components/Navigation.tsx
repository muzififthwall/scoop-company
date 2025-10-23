export default function Navigation() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="flex items-center justify-between py-3.5">
          <div className="flex gap-2.5 items-center font-bold">
            The Scoop Company
          </div>
          <a
            href="#tickets"
            className="inline-block px-4 py-3 rounded-xl border border-border font-semibold no-underline bg-white text-ink hover:bg-gray-50 transition-colors"
          >
            Get Tickets
          </a>
        </div>
      </div>
    </header>
  );
}
