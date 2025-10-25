# Troubleshooting: Ticket Counter Not Updating

## Problems

This guide covers two related issues that may occur:

### Problem 1: Ticket Counter Not Updating

Customers have successfully purchased tickets, but the website still shows 15/15 tickets available for all dates.

### Problem 2: Customers Not Receiving Confirmation Emails

Customers complete their purchase but don't receive any confirmation email from Stripe.

## Root Causes

### Cause 1: Wrong Webhook Events

The webhook is listening to `payment_intent.*` events instead of `checkout.session.*` events. The app only processes checkout session events, which contain the booking metadata (date, tickets, etc.).

### Cause 2: Missing Payment Intent Data

Email and metadata were only attached to Checkout Sessions, not Payment Intents. This prevented:
- Stripe from sending automatic receipt emails
- Metadata from appearing in Stripe Dashboard > Payments
- The webhook from having access to booking details

## Quick Fix (4 Steps)

### Step 1: Add Correct Webhook Events

1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click on your existing webhook endpoint (the one pointing to `/api/webhooks/stripe`)
3. Click the **"..."** menu > **"Update details"** or **"Edit"**
4. In the **"Events to send"** section, **ADD** these events (keep existing ones - don't delete them):
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.expired`
   - ✅ `checkout.session.async_payment_failed`
5. Click **"Save"** or **"Update endpoint"**
6. Note down your **Signing secret** (starts with `whsec_...`) if you don't have it already

### Step 2: Verify Webhook Secret in Vercel

1. Go to your Vercel project
2. Click **Settings** > **Environment Variables**
3. Check if `STRIPE_WEBHOOK_SECRET` exists with the correct signing secret
4. If missing or incorrect, add/update it
5. Click **Save**

### Step 3: Deploy Code Updates

The code has been updated to fix the email issue. You need to deploy these changes:

1. Commit the updated code to your repository:
```bash
git add .
git commit -m "Fix email delivery and metadata issues"
git push
```

2. Vercel will automatically deploy, or manually trigger a redeploy in Vercel Dashboard

**What was fixed:**
- Added `payment_intent_data` to checkout sessions
- This ensures emails and metadata are attached to both checkout sessions AND payment intents
- Future customers will automatically receive receipts

### Step 4: Sync Existing Sales

Since past purchases didn't update the inventory, you need to sync it manually:

**Option A: Using curl (recommended)**

```bash
# First, check the discrepancy
curl https://your-vercel-domain.vercel.app/api/admin/sync-inventory \
  -u admin:changeme

# If it shows discrepancies, fix them
curl -X POST https://your-vercel-domain.vercel.app/api/admin/sync-inventory \
  -u admin:changeme
```

**Option B: Using your browser**

1. Open: `https://your-vercel-domain.vercel.app/api/admin/sync-inventory`
2. Enter username: `admin`
3. Enter password: `changeme` (or whatever you set in `ADMIN_PASSWORD`)
4. This will show you the discrepancies
5. To fix them, use curl with POST method (see Option A)

**Note:** Replace `changeme` with your actual `ADMIN_PASSWORD` from environment variables.

### Step 5: Send Receipts to Past Customers (Optional but Recommended)

Since past customers didn't receive confirmation emails, you should send them manually:

**Option A: Export customer list and send from Stripe**

```bash
# Download CSV with all customer orders
curl -X POST https://your-vercel-domain.vercel.app/api/admin/send-receipts \
  -u admin:changeme \
  -o customers.csv
```

Then:
1. Open the CSV file
2. For each customer, go to [Stripe Dashboard > Payments](https://dashboard.stripe.com/payments)
3. Find the payment by customer email or amount
4. Click "Send receipt"
5. Email will be pre-filled - just click Send

**Option B: Check which customers need receipts**

```bash
# See list of orders without receipts
curl https://your-vercel-domain.vercel.app/api/admin/send-receipts \
  -u admin:changeme
```

This shows you exactly which customers still need receipts.

**Option C: Enable Stripe's automatic emails**

1. Go to [Stripe Dashboard > Settings > Emails](https://dashboard.stripe.com/settings/emails)
2. Find **"Successful payments"** toggle
3. Turn it **ON**
4. This won't send emails for past purchases, but ensures future purchases get automatic emails

**Note:** After deploying the code fix (Step 3), all NEW customers will automatically receive emails!

## Verification

After completing all steps:

1. **Test the webhook:**
   - In Stripe Dashboard, go to Webhooks
   - Click on your endpoint
   - Click **"Send test webhook"**
   - Select `checkout.session.completed`
   - Click **"Send test webhook"**
   - Check it shows "Succeeded"

2. **Make a test purchase:**
   - Go to your website
   - Select a date and tickets
   - Complete a test purchase using card: `4242 4242 4242 4242`
   - Refresh the page
   - The ticket counter should now decrease!

## Understanding the Metadata

Each Stripe payment contains metadata that shows which date the tickets were purchased for:

1. Go to [Stripe Dashboard > Payments](https://dashboard.stripe.com/payments)
2. Click on any payment
3. Scroll to the **Metadata** section
4. You'll see:
   - `event_night`: "Wednesday 29 Oct — 5:30pm" (human-readable date)
   - `night_key`: "wednesday_29_oct_2025" (internal identifier)
   - `kid_tickets`: Number of kid tickets
   - `adult_drink_tickets`: Number of drink-only tickets
   - `adult_full_tickets`: Number of full-treat tickets

## Common Issues

### "Authorization required" error when calling sync-inventory

**Solution:** Make sure you're using Basic Auth with the correct credentials:
- Username: `admin`
- Password: Your `ADMIN_PASSWORD` environment variable (default is `changeme`)

### Webhook still failing after setup

**Check these:**
1. Is `STRIPE_WEBHOOK_SECRET` set in Vercel environment variables?
2. Did you redeploy after adding the environment variable?
3. Is the webhook endpoint URL correct?
4. Are you in test mode or live mode in Stripe? Make sure they match!

### Inventory shows incorrect numbers after sync

**Solution:** The sync uses Stripe as the source of truth. If Stripe shows different numbers than expected:
1. Check all payments in Stripe Dashboard
2. Look at the metadata to see which dates each payment was for
3. The sync-inventory endpoint will show you exactly what it found

### No metadata or email showing on past payments

**Why this happens:** Past orders (before the code fix) only had metadata on Checkout Sessions, not Payment Intents.

**Where to find the data:**
- **Payment Intents** (Stripe Dashboard > Payments) = Shows transaction, but NO metadata for old orders
- **Checkout Sessions** (via API or webhook logs) = Has ALL the metadata

**Solution:**
- For NEW orders (after deploying the fix): Metadata will show in both places ✅
- For OLD orders: Use the `sync-inventory` or `send-receipts` endpoints which pull from Checkout Sessions
- The metadata IS there, just in a different place!

### Customers still not receiving emails

**Check these:**
1. Did you deploy the code changes (Step 3)?
2. Is the Stripe "Successful payments" email toggle turned ON?
3. Are customers checking their spam folders?
4. Try a test purchase with your own email to verify

**Stripe Email Settings:**
- Go to [Settings > Emails](https://dashboard.stripe.com/settings/emails)
- Ensure "Successful payment receipts" is enabled
- Ensure "Customers will receive receipts..." is NOT checked

## Prevention

To prevent this from happening again:

1. ✅ Keep `STRIPE_WEBHOOK_SECRET` up to date
2. ✅ Monitor webhook delivery in Stripe Dashboard (Developers > Webhooks > View logs)
3. ✅ Set up email alerts in Stripe for failed webhooks
4. ✅ Periodically run the sync-inventory GET endpoint to check for discrepancies

## Need More Help?

1. Check Vercel logs: `vercel logs` or in Vercel Dashboard
2. Check Stripe webhook logs: Stripe Dashboard > Developers > Webhooks > [Your endpoint] > Logs
3. Contact support at thescoopcompany@mail.com
