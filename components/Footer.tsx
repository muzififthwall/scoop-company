import { Instagram, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12" style={{ background: '#F8AFC8' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Top Section */}
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-2xl" style={{ fontWeight: 700, color: '#1F1B24' }}>
                The Scoop Company
              </h3>
              <p style={{ color: '#5C5C6B' }}>
                A sweet little cinema treat your kids will love. 🍦🎬
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-col items-center gap-3">
              <p style={{ fontWeight: 600, color: '#1F1B24' }}>Order Online</p>
              <a
                href="https://deliveroo.co.uk/menu/london/warlingham/the-scoop-company-369-limpsfield-road"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white rounded-full hover:shadow-lg transition-shadow flex items-center gap-2"
                style={{ color: '#1F1B24' }}
              >
                <ExternalLink className="w-4 h-4" />
                Deliveroo
              </a>
            </div>

            {/* Social */}
            <div className="flex flex-col items-center gap-3">
              <p style={{ fontWeight: 600, color: '#1F1B24' }}>Follow Us</p>
              <a
                href="https://www.instagram.com/thescoopcompany_/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-full hover:shadow-lg transition-all transform hover:scale-105"
                style={{ color: '#1F1B24' }}
              >
                <Instagram className="w-5 h-5" />
                <span style={{ fontWeight: 600 }}>@thescoopcompany_</span>
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t-2 border-white/30 text-center">
            <p style={{ color: '#1F1B24' }}>
              © 2025 The Scoop Company, Warlingham. All rights reserved. 💘
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
