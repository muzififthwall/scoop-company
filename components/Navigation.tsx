"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

// Shared across the whole site. The four marketing pages carry the same links
// in their own markup; keep them in step when a page is added.
const LINKS = [
  { href: "/", label: "Gelato Cakes", current: true },
  { href: "/cinema", label: "Kids Cinema" },
  { href: "/cart-hire", label: "Cart Hire" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/menus", label: "Menus" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);

  // Don't let the page scroll behind the open menu.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-50 backdrop-blur-sm border-b border-[#F8AFC8]/30"
        style={{ background: "rgba(248, 175, 200, 0.95)" }}
      >
        <div className="max-w-[1180px] mx-auto px-4">
          <div className="flex items-center justify-between gap-3 py-3">
            <a href="/" className="shrink-0" aria-label="The Scoop Company, home">
              {/* Same logo the four marketing pages use, so the header reads as
                  one site. The artwork is white, hence the pink bar behind it. */}
              <img
                src="/images/scoop-logo.png"
                alt="The Scoop Company"
                className="h-7 w-auto"
              />
            </a>

            {/* Desktop: links inline. Mobile: a burger, so nothing can push the
                page sideways the way a scrolling row of links did. */}
            <nav aria-label="The Scoop Company" className="hidden md:block">
              <ul className="flex items-center gap-1 list-none m-0 p-0">
                {LINKS.map(({ href, label, current }) => (
                  <li key={href}>
                    <a
                      href={href}
                      aria-current={current ? "page" : undefined}
                      className={`inline-block px-3 py-2 rounded-lg text-sm font-semibold no-underline whitespace-nowrap transition-colors ${
                        current ? "bg-white" : "hover:bg-white/60"
                      }`}
                      style={{ color: "#1F1B24" }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-white/70 hover:bg-white transition-colors"
              style={{ color: "#1F1B24" }}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-0 z-[60] md:hidden transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
        style={{ background: "#F8AFC8" }}
      >
        <div className="flex flex-col h-full px-6 pt-5 pb-8">
          <div className="flex items-center justify-between">
            <a href="/" onClick={() => setOpen(false)} aria-label="The Scoop Company, home">
              <img src="/images/scoop-logo.png" alt="The Scoop Company" className="h-6 w-auto" />
            </a>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex items-center justify-center w-11 h-11 rounded-full border border-[#1F1B24]/25 bg-white/40"
              style={{ color: "#1F1B24" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-8">
            <ul className="list-none m-0 p-0">
              {LINKS.map(({ href, label, current }) => (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 text-2xl font-bold no-underline border-b border-[#1F1B24]/15"
                    style={{ color: "#1F1B24", opacity: current ? 0.5 : 1 }}
                  >
                    {label}
                    <span aria-hidden="true">&rsaquo;</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
