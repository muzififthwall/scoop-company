'use client';

import { useState } from 'react';

export default function Tickets() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    night: 'Friday 24 Oct — 6:00pm',
    tickets: 2,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tickets" className="bg-[#faf7fb] border-t border-b border-border py-15">
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-6 items-center">
          <div>
            <h2 className="m-0 mb-2 text-[30px] font-bold">Secure Your Spot</h2>
            <p className="text-muted">
              Pick your night, tell us how many tickets, and you&apos;re in. Your confirmation email is your entry — just show it at the door.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 grid gap-2.5 max-w-[480px]">
              <label className="block">
                <span className="block mb-1 text-sm font-medium">Full Name</span>
                <input
                  required
                  type="text"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-deep"
                />
              </label>
              <label className="block">
                <span className="block mb-1 text-sm font-medium">Email</span>
                <input
                  required
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-deep"
                />
              </label>
              <label className="block">
                <span className="block mb-1 text-sm font-medium">Choose a Night</span>
                <select
                  value={formData.night}
                  onChange={(e) => setFormData({ ...formData, night: e.target.value })}
                  className="w-full px-3 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-deep"
                >
                  <option>Friday 24 Oct — 6:00pm</option>
                  <option>Saturday 25 Oct — 6:00pm</option>
                  <option>Sunday 26 Oct — 6:00pm</option>
                </select>
              </label>
              <label className="block">
                <span className="block mb-1 text-sm font-medium">Tickets</span>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={formData.tickets}
                  onChange={(e) => setFormData({ ...formData, tickets: parseInt(e.target.value) })}
                  className="w-full px-3 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-deep"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="px-4.5 py-3 rounded-xl font-semibold bg-pink-deep text-white border-0 hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Pay £${formData.tickets * 10}`}
              </button>
              <div className="text-muted text-xs">
                Secure payment powered by Stripe. You&apos;ll receive a confirmation email with your tickets.
              </div>
            </form>
          </div>
          <div className="bg-white border border-border rounded-2xl p-4.5 shadow-sm">
            <h3 className="m-0 mb-1.5 font-bold text-lg">FAQ</h3>
            <div className="mt-2.5 space-y-2.5">
              <details open className="border border-border rounded-xl p-3 bg-white">
                <summary className="cursor-pointer font-medium">Is it suitable for kids?</summary>
                <div className="text-muted mt-2 text-sm">Yes — family‑friendly spooky movies.</div>
              </details>
              <details className="border border-border rounded-xl p-3 bg-white">
                <summary className="cursor-pointer font-medium">What&apos;s included in £10?</summary>
                <div className="text-muted mt-2 text-sm">Any dessert + any drink per ticket.</div>
              </details>
              <details className="border border-border rounded-xl p-3 bg-white">
                <summary className="cursor-pointer font-medium">Do we pick desserts in advance?</summary>
                <div className="text-muted mt-2 text-sm">Nope — choose on the night.</div>
              </details>
              <details className="border border-border rounded-xl p-3 bg-white">
                <summary className="cursor-pointer font-medium">Refunds?</summary>
                <div className="text-muted mt-2 text-sm">
                  We can transfer to another night if you contact us 24h in advance.
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
