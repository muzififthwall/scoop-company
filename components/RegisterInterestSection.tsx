"use client";

import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Sparkles, Check } from "lucide-react";
import { toast } from "sonner";

// Keeps the id the cinema CTAs already scroll to, so "Book Your Seats" and the
// pricing buttons land here while ticket sales are off for the summer.
export function RegisterInterestSection() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/register-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setRegistered(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section id="tickets" className="py-20 relative overflow-hidden" style={{ background: '#FFE8F0' }}>
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 text-9xl">⭐</div>
        <div className="absolute bottom-20 right-20 text-9xl">🍦</div>
        <div className="absolute top-1/2 left-1/4 text-7xl">🎬</div>
        <div className="absolute top-32 right-16 text-6xl">🍿</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#F8AFC8] rounded-full" style={{ color: '#1F1B24' }}>
              <Sparkles className="w-5 h-5" />
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>BACK THIS WINTER</span>
            </div>

            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
              Kids Cinema Nights Return This Winter
            </h2>
            <p className="text-xl" style={{ color: '#5C5C6B' }}>
              Tickets are not on sale yet. Join the list and we&apos;ll email you the moment they are, before we announce it anywhere else.
            </p>
          </div>

          <Card className="p-8 md:p-10 bg-white shadow-2xl border-2 border-[#F8AFC8]/30">
            {registered ? (
              <div className="text-center space-y-5">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#F8AFC8] flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl md:text-3xl" style={{ fontWeight: 700, color: '#1F1B24' }}>
                  You&apos;re on the list! 🎬
                </h3>

                <p className="text-lg" style={{ color: '#5C5C6B', lineHeight: '1.6' }}>
                  Thanks {formData.name.split(" ")[0]}. We&apos;ll email you as soon as the winter dates are live.
                </p>

                <div className="p-5 rounded-xl mt-2" style={{ background: '#FFE8F0', border: '2px solid #F8AFC8' }}>
                  <p style={{ fontWeight: 600, color: '#1F1B24' }}>
                    Fancy something sweet in the meantime? Our gelato celebration cakes are available now.
                  </p>
                </div>

                <a href="/" className="inline-block underline" style={{ color: '#1F1B24', fontWeight: 600 }}>
                  Order a gelato cake →
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="interest-name">Parent/Carer Name</Label>
                  <Input
                    id="interest-name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interest-email">Email Address</Label>
                  <Input
                    id="interest-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interest-phone">Mobile Number (UK)</Label>
                  <Input
                    id="interest-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="07123 456789"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 text-lg rounded-xl"
                  style={{ background: '#F8AFC8', color: '#1F1B24', fontWeight: 700 }}
                >
                  {loading ? "Registering…" : "🎟️ Register My Interest"}
                </Button>

                <p className="text-center text-sm" style={{ color: '#5C5C6B' }}>
                  No payment now. You&apos;re just joining the list.
                </p>
              </form>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
