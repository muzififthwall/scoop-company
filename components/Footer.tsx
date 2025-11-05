import { Instagram, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12" style={{ background: '#F8AFC8' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Logo and tagline */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl mb-2" style={{ fontWeight: 800, color: '#030213' }}>
                The Scoop Company
              </h3>
              <p className="text-lg" style={{ color: '#030213' }}>
                It's not going to lick itself. 🍦
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-col items-center gap-3">
              <p style={{ fontWeight: 600, color: '#030213' }}>Order Online</p>
              <div className="flex gap-4">
                <a
                  href="https://deliveroo.co.uk/menu/london/warlingham/the-scoop-company-369-limpsfield-road"
                  className="px-4 py-2 bg-white rounded-full hover:shadow-lg transition-shadow flex items-center gap-2"
                  style={{ color: '#030213' }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Deliveroo
                </a>
              </div>
            </div>

            {/* Social */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <p className="w-full text-center" style={{ fontWeight: 600, color: '#030213' }}>Follow Us</p>
              <a
                href="https://www.instagram.com/thescoopcompany_/"
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-full hover:shadow-lg transition-all transform hover:scale-105"
                style={{ color: '#030213' }}
              >
                <Instagram className="w-5 h-5" />
                <span style={{ fontWeight: 600 }}>@thescoopcompany_</span>
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t-2 border-white/30 text-center">
            <p style={{ color: '#030213' }}>
              © 2025 The Scoop Company, Warlingham. All rights reserved. 🎄
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
