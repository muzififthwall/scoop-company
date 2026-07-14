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

// The marketing pages' design tokens, so both halves of the site match.
const INK = "#43202F";
const BLOSSOM = "#FFB5D7";
const CREAM = "#FFF7FB";

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
      <div className="sticky top-0 z-50">
        {/* Dark site bar, same as the marketing pages. Desktop only: on mobile
            those pages drop it too, and the burger carries the links. */}
        <nav
          aria-label="The Scoop Company"
          className="hidden md:block"
          style={{ background: INK }}
        >
          <ul className="flex items-center list-none m-0 mx-auto px-3 max-w-[1180px] h-11">
            {LINKS.map(({ href, label, current }) => (
              <li key={href}>
                <a
                  href={href}
                  aria-current={current ? "page" : undefined}
                  className="flex items-center h-11 px-3.5 text-sm font-semibold no-underline whitespace-nowrap border-b-2 transition-colors"
                  style={{
                    color: current ? BLOSSOM : CREAM,
                    borderBottomColor: current ? BLOSSOM : "transparent",
                    opacity: current ? 1 : 0.78,
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Pink logo bar */}
        <header
          className="border-b border-white/45"
          style={{ background: BLOSSOM }}
        >
          {/* padding + logo height matched to the marketing pages, measured */}
          <div className="max-w-[1180px] mx-auto px-5 md:px-6">
            <div className="flex items-center justify-between gap-3 h-[76px]">
              <a href="/" className="shrink-0" aria-label="The Scoop Company, home">
                <img
                  src="/images/scoop-logo.png"
                  alt="The Scoop Company"
                  className="h-[34px] w-auto"
                />
              </a>

              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-white/40 hover:bg-white/70 transition-colors"
                style={{ color: INK }}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile menu */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-0 z-[60] md:hidden transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
        style={{ background: BLOSSOM }}
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
              className="flex items-center justify-center w-11 h-11 rounded-full border bg-white/40"
              style={{ color: INK, borderColor: "rgba(67,32,47,.3)" }}
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
                    className="flex items-center justify-between py-4 text-2xl font-bold no-underline border-b"
                    style={{
                      color: INK,
                      borderBottomColor: "rgba(67,32,47,.14)",
                      opacity: current ? 0.5 : 1,
                    }}
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
