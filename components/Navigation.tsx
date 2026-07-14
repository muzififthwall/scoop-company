// The cake site keeps its own look; only the links are shared with the four
// marketing pages, so the site browses as one thing rather than dead-ending.
const LINKS = [
  { href: "/", label: "Gelato Cakes", current: true },
  { href: "/cinema", label: "Kids Cinema" },
  { href: "/cart-hire", label: "Cart Hire" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/menus", label: "Menus" },
];

export default function Navigation() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-[#F8AFC8]/30" style={{ background: 'rgba(248, 175, 200, 0.95)' }}>
      <div className="max-w-[1180px] mx-auto px-4">
        {/* min-w-0 on the scrolling nav is what stops the links from forcing the
            whole page wider than a phone screen. */}
        <div className="flex items-center gap-3 py-3">
          <a
            href="/"
            className="font-bold no-underline shrink-0 hidden sm:block"
            style={{ color: '#1F1B24' }}
          >
            The Scoop Company
          </a>

          <nav aria-label="The Scoop Company" className="min-w-0 flex-1">
            <ul className="flex items-center gap-1 list-none m-0 p-0 overflow-x-auto sm:justify-end [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {LINKS.map(({ href, label, current }) => (
                <li key={href} className="shrink-0">
                  <a
                    href={href}
                    aria-current={current ? "page" : undefined}
                    className={`inline-block px-3 py-2 rounded-lg text-sm font-semibold no-underline whitespace-nowrap transition-colors ${
                      current ? "bg-white" : "hover:bg-white/60"
                    }`}
                    style={{ color: '#1F1B24' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
