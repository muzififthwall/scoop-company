/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Printed QR codes point at /gelato-cake. The cake now opens the home page,
      // so this URL must keep working for every flyer already out there.
      // Deliberately temporary (307), not permanent (308): a 308 is cached hard by
      // the scanner's browser and can't be taken back if the cake ever moves.
      {
        source: "/gelato-cake",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
