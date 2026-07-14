/** @type {import('next').NextConfig} */

// The four marketing pages ship as self-contained HTML in a separate design
// system, with a distinct file per screen size. They live in public/pages and
// are served at clean URLs here; a small script in each file picks desktop or
// mobile by width. The gelato cake site stays a normal Next.js app at /.
const MARKETING_PAGES = [
  { route: '/cinema', file: 'kids-cinema-nights' },
  { route: '/cart-hire', file: 'gelato-cart-hire' },
  { route: '/wholesale', file: 'gelato-by-maria-wholesale' },
  { route: '/menus', file: 'scoop-menus' },
];

const nextConfig = {
  async rewrites() {
    return MARKETING_PAGES.flatMap(({ route, file }) => [
      { source: route, destination: `/pages/${file}.html` },
      { source: `${route}/mobile`, destination: `/pages/${file}-mobile.html` },
    ]);
  },

  async redirects() {
    return [
      // Printed QR codes point at /gelato-cake. The cake now opens the home page,
      // so this URL must keep working for every flyer already out there.
      // Deliberately temporary (307), not permanent (308): a 308 is cached hard by
      // the scanner's browser and can't be taken back if the cake ever moves.
      {
        source: '/gelato-cake',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
