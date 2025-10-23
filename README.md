# The Scoop Company - Halloween Event Website

A Next.js website for The Scoop Company's "Scoop & Scream" Halloween movie night event with Stripe payment integration.

## Features

- Modern, responsive design with Tailwind CSS
- Stripe Checkout integration for ticket purchases
- TypeScript for type safety
- Mobile-first responsive layout
- Event details, FAQ, and location information

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Stripe account ([Sign up here](https://dashboard.stripe.com/register))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/thefifthwall/scoop-company.git
cd scoop-company
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your Stripe keys to `.env.local`:
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Copy your **Secret key** (starts with `sk_test_...`)
   - Copy your **Publishable key** (starts with `pk_test_...`)
   - Paste them into `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Stripe Setup

### Getting Your API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** in the left sidebar
3. Click **API keys**
4. You'll see two keys:
   - **Publishable key** (pk_test_...) - safe to use in client-side code
   - **Secret key** (sk_test_...) - keep this secure, server-side only

### Testing Payments

Use these test card numbers in development:
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- Use any future expiry date and any 3-digit CVC

[More test cards](https://stripe.com/docs/testing)

### Going Live

1. In Stripe Dashboard, toggle from **Test mode** to **Live mode**
2. Get your live API keys (they start with `sk_live_...` and `pk_live_...`)
3. Update your production environment variables

## Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel:
   - Go to your project settings
   - Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `.next` folder to Netlify

3. Set environment variables in Netlify dashboard

## Project Structure

```
scoop-company/
├── app/
│   ├── api/
│   │   └── create-checkout-session/
│   │       └── route.ts          # Stripe checkout API
│   ├── success/
│   │   └── page.tsx              # Payment success page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── Navigation.tsx            # Header/navigation
│   ├── Hero.tsx                  # Hero section
│   ├── Details.tsx               # Event details
│   ├── Tickets.tsx               # Ticket booking form
│   ├── Location.tsx              # Location/contact info
│   └── Footer.tsx                # Footer
├── .env.local.example            # Environment variables template
└── README.md
```

## Support

For questions or issues:
- Email: hello@thescoopcompany.co.uk
- Instagram: [@thescoopcompany_](https://instagram.com/thescoopcompany_)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Payments**: Stripe Checkout
- **Deployment**: Vercel-ready

---

Built with 🍨 for The Scoop Company
