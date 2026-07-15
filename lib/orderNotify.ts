// Order notifications for cake orders. Two independent, best-effort channels,
// each turned on only when its env vars are set, so nothing fires until the
// keys are in place — and a failure in one never blocks the Stripe webhook.

export interface CakeOrder {
  sessionId: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  collectionDate: string;
  deliveryOption: string;
  orderSummary: string;
  totalAmount: string;
}

function orderLines(o: CakeOrder): string {
  return [
    `Name: ${o.customerName}`,
    o.customerEmail ? `Email: ${o.customerEmail}` : null,
    o.customerPhone ? `Phone: ${o.customerPhone}` : null,
    `${o.deliveryOption === 'delivery' ? 'Delivery' : 'Collection'} date: ${o.collectionDate}`,
    `Total: £${o.totalAmount}`,
    '',
    'Order:',
    o.orderSummary,
  ]
    .filter((l) => l !== null)
    .join('\n');
}

// 1) Email the shop via Resend. No-op unless RESEND_API_KEY is set.
async function emailShop(o: CakeOrder): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const to = process.env.ORDER_NOTIFY_EMAIL || 'thescoopcompany1@gmail.com';
  // Must be a Resend-verified sender; onboarding@resend.dev works before the
  // domain is verified.
  const from = process.env.ORDER_NOTIFY_FROM || 'onboarding@resend.dev';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: o.customerEmail || undefined,
      subject: `New gelato cake order — ${o.customerName} (£${o.totalAmount})`,
      text: orderLines(o),
    }),
  });

  if (!res.ok) {
    console.error('Order email failed:', res.status, await res.text());
  }
}

// 2) Push the order into Scoop Inbox as a conversation, via its Forms webhook.
// No-op unless SCOOP_INBOX_URL and SCOOP_INBOX_FORMS_SECRET are set.
async function pushToScoopInbox(o: CakeOrder): Promise<void> {
  const base = process.env.SCOOP_INBOX_URL;
  const secret = process.env.SCOOP_INBOX_FORMS_SECRET;
  if (!base || !secret) return;

  const res = await fetch(`${base.replace(/\/$/, '')}/webhooks/forms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret,
      name: o.customerName,
      email: o.customerEmail,
      subject: `Gelato cake order — £${o.totalAmount}`,
      message: orderLines(o),
      fields: {
        Phone: o.customerPhone || '',
        [o.deliveryOption === 'delivery' ? 'Delivery date' : 'Collection date']: o.collectionDate,
        Total: `£${o.totalAmount}`,
        'Stripe session': o.sessionId,
      },
    }),
  });

  if (!res.ok) {
    console.error('Scoop Inbox push failed:', res.status, await res.text());
  }
}

// Run both channels; never throw, so notification problems can't fail the order.
export async function notifyCakeOrder(order: CakeOrder): Promise<void> {
  const results = await Promise.allSettled([emailShop(order), pushToScoopInbox(order)]);
  for (const r of results) {
    if (r.status === 'rejected') console.error('Order notify error:', r.reason);
  }
}
