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

### Setting Up Webhooks (CRITICAL!)

**Without webhooks, ticket inventory won't update when customers make purchases!**

1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. **If you already have a webhook endpoint:**
   - Click on your existing webhook that points to `/api/webhooks/stripe`
   - Click **"..."** menu > **"Update details"** or **"Edit"**
   - In the **"Events to send"** section, **ADD** these events (keep existing ones):
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `checkout.session.async_payment_failed`
   - Save changes
3. **If you don't have a webhook yet:**
   - Click **"Add endpoint"**
   - Set the endpoint URL to: `https://your-vercel-domain.vercel.app/api/webhooks/stripe`
   - Click **"Select events"** and choose:
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `checkout.session.async_payment_failed`
   - Click **"Add endpoint"**
4. Copy the **Signing secret** (starts with `whsec_...`)
5. Add it to your environment variables:
   - In `.env.local` for local development: `STRIPE_WEBHOOK_SECRET=whsec_...`
   - In Vercel: Project Settings > Environment Variables > Add `STRIPE_WEBHOOK_SECRET`
6. **Redeploy your Vercel app** after adding the environment variable

**Verification:**
- After adding the events, click "Send test webhook" in Stripe Dashboard
- Select `checkout.session.completed` as the event type
- Check your Vercel logs to confirm the webhook was received successfully (should show 200, not 400)

### Testing Payments

Use these test card numbers in development:
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- Use any future expiry date and any 3-digit CVC

[More test cards](https://stripe.com/docs/testing)

### Going Live

1. In Stripe Dashboard, toggle from **Test mode** to **Live mode**
2. Get your live API keys (they start with `sk_live_...` and `pk_live_...`)
3. Create a new webhook endpoint for production (same steps as above)
4. Update your production environment variables with live keys and webhook secret

## Vercel KV Setup (Inventory Management)

The app uses Vercel KV (Redis) to manage ticket inventory in real-time.

1. In your Vercel project, go to **Storage** tab
2. Click **Create Database** > **KV**
3. Give it a name (e.g., "scoop-inventory")
4. Click **Create**
5. Vercel will automatically add `KV_REST_API_URL` and `KV_REST_API_TOKEN` to your environment variables
6. The database is now ready to use!

**Note:** Local development won't have working KV unless you manually add the KV credentials to `.env.local`

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
   - Go to your project settings > Environment Variables
   - Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Add `STRIPE_WEBHOOK_SECRET` (from Stripe webhook setup)
   - Add `ADMIN_PASSWORD` (for admin endpoints)
   - `KV_REST_API_URL` and `KV_REST_API_TOKEN` are auto-added when you create a KV database

4. Set up Vercel KV (see section above)

5. Configure Stripe webhooks (see Stripe Setup section)

### Deploy to Netlify

**Note:** This app requires Vercel KV for inventory management. If deploying to Netlify, you'll need to replace the KV implementation with another Redis provider.

1. Build the project:
```bash
npm run build
```

2. Deploy the `.next` folder to Netlify

3. Set environment variables in Netlify dashboard

## Admin Endpoints

The app includes admin endpoints for managing inventory. All admin endpoints require Basic Auth with username `admin` and the password set in `ADMIN_PASSWORD` environment variable.

### Initialize Inventory

Resets all ticket counts to 0 for all event nights.

```bash
curl -X POST https://your-domain.vercel.app/api/admin/init-inventory \
  -u admin:your_admin_password
```

### Sync Inventory with Stripe

**Use this to fix inventory if webhooks weren't working!**

This endpoint fetches all successful payments from Stripe and synchronizes the inventory to match actual sales.

**Check current status (GET):**
```bash
curl https://your-domain.vercel.app/api/admin/sync-inventory \
  -u admin:your_admin_password
```

This will show you:
- How many tickets have actually been sold (from Stripe)
- Current inventory counts (from database)
- Any discrepancies between them

**Fix inventory (POST):**
```bash
curl -X POST https://your-domain.vercel.app/api/admin/sync-inventory \
  -u admin:your_admin_password
```

This will update the inventory to match actual Stripe sales.

### Send Receipts to Customers

**Use this if customers didn't receive confirmation emails!**

This endpoint helps you identify orders without receipts and export customer data.

**Check which customers need receipts (GET):**
```bash
curl https://your-domain.vercel.app/api/admin/send-receipts \
  -u admin:your_admin_password
```

This will show you:
- Total number of orders
- How many orders don't have receipts sent
- Full list of all orders with email addresses

**Export customer list as CSV (POST):**
```bash
curl -X POST https://your-domain.vercel.app/api/admin/send-receipts \
  -u admin:your_admin_password \
  -o customers.csv
```

This downloads a CSV file with all customer orders that you can:
- Open in Excel/Google Sheets
- Use to manually send receipts from Stripe Dashboard
- Use for customer outreach if needed

**To manually send receipts from Stripe:**
1. Go to [Stripe Dashboard > Payments](https://dashboard.stripe.com/payments)
2. Click on each payment
3. Click "Send receipt" button
4. Email will be pre-filled (if available)
5. Click "Send"

**Note:** After deploying the latest code update, all NEW purchases will automatically receive receipts!

### Viewing Sales by Date in Stripe

To see which dates customers purchased tickets for:

1. Go to [Stripe Dashboard > Payments](https://dashboard.stripe.com/payments)
2. Click on any payment
3. Scroll down to **Metadata** section
4. You'll see:
   - `event_night`: The display name of the event date
   - `night_key`: The internal key for the night
   - `kid_tickets`: Number of kid tickets purchased
   - `adult_drink_tickets`: Number of drink-only adult tickets
   - `adult_full_tickets`: Number of full-treat adult tickets

## Project Structure

```
scoop-company/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── init-inventory/     # Initialize inventory
│   │   │   └── sync-inventory/     # Sync with Stripe sales
│   │   ├── check-inventory/        # Check ticket availability
│   │   ├── create-checkout-session/ # Stripe checkout API
│   │   └── webhooks/
│   │       └── stripe/             # Stripe webhook handler
│   ├── success/
│   │   └── page.tsx              # Payment success page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   ├── Navigation.tsx            # Header/navigation
│   ├── HeroSection.tsx           # Hero section
│   ├── TicketFormSection.tsx     # Ticket booking form
│   ├── FAQSection.tsx            # FAQ section
│   └── Footer.tsx                # Footer
├── lib/
│   └── inventory.ts              # Inventory management logic
├── .env.local.example            # Environment variables template
└── README.md
```

## Support

For questions or issues:
- Email: thescoopcompany@mail.com
- Instagram: [@thescoopcompany_](https://instagram.com/thescoopcompany_)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Payments**: Stripe Checkout
- **Deployment**: Vercel-ready

---

Built with 🍨 for The Scoop Company
