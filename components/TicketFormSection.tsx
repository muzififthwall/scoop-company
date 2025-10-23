'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { Ticket, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function TicketFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    tickets: "1"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.date) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          night: formData.date,
          tickets: parseInt(formData.tickets)
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        toast.error("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section id="tickets" className="py-20 relative overflow-hidden" style={{ background: '#FFE8F0' }}>
      {/* Decorative pumpkin outlines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 text-9xl">🎃</div>
        <div className="absolute bottom-20 right-20 text-9xl">🎃</div>
        <div className="absolute top-1/2 left-1/4 text-7xl">🍦</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full">
              <Ticket className="w-5 h-5" style={{ color: '#F8AFC8' }} />
              <span style={{ fontWeight: 600, color: '#030213' }}>Limited Availability</span>
            </div>

            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#030213' }}>
              Secure Your Spot 🎟️
            </h2>
            <p className="text-xl" style={{ color: '#717182' }}>
              Book now before seats run out!
            </p>
          </div>

          <Card className="p-8 md:p-10 bg-white shadow-2xl border-2 border-[#F8AFC8]/30">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 border-2 focus:border-[#F8AFC8]"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 border-2 focus:border-[#F8AFC8]"
                  disabled={loading}
                />
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <Select value={formData.date} onValueChange={(value) => setFormData({ ...formData, date: value })} disabled={loading}>
                  <SelectTrigger className="h-12 border-2">
                    <SelectValue placeholder="Choose a date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monday 27 Oct — 6:00pm">Monday, October 27th - 6PM</SelectItem>
                    <SelectItem value="Tuesday 28 Oct — 6:00pm">Tuesday, October 28th - 6PM</SelectItem>
                    <SelectItem value="Wednesday 29 Oct — 6:00pm">Wednesday, October 29th - 6PM</SelectItem>
                    <SelectItem value="Thursday 30 Oct — 6:00pm">Thursday, October 30th - 6PM</SelectItem>
                    <SelectItem value="Friday 31 Oct — 6:00pm">Friday, October 31st - 6PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Tickets */}
              <div className="space-y-2">
                <Label htmlFor="tickets">Number of Tickets</Label>
                <Select value={formData.tickets} onValueChange={(value) => setFormData({ ...formData, tickets: value })} disabled={loading}>
                  <SelectTrigger className="h-12 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'ticket' : 'tickets'} - £{num * 10}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Total Display */}
              <div className="p-4 rounded-xl" style={{ background: 'rgba(248, 175, 200, 0.1)', border: '2px solid #F8AFC8' }}>
                <div className="flex justify-between items-center">
                  <span style={{ fontWeight: 600, color: '#030213' }}>Total:</span>
                  <span className="text-2xl" style={{ fontWeight: 800, color: '#030213' }}>
                    £{parseInt(formData.tickets) * 10}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                style={{ background: '#F8AFC8', color: '#030213' }}
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Pay £{parseInt(formData.tickets) * 10}
                  </>
                )}
              </Button>

              <p className="text-sm text-center" style={{ color: '#717182' }}>
                Secure payment powered by Stripe. You'll receive a confirmation email with your tickets.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
