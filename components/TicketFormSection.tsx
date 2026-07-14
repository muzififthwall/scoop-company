'use client';

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { Ticket, Sparkles, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { TICKETS_SOLD_OUT, BOOKING_COMING_SOON } from "@/lib/inventory";

interface Availability {
  nightKey: string;
  displayName: string;
  value: string;
  kidTicketsRemaining: number;
  adultTicketsRemaining: number;
  isSoldOut: boolean;
  adultOnly?: boolean;
}

const MAX_KIDS = 20;
const MAX_ADULTS = 15;

// Declare fbq for TypeScript
declare global {
  interface Window {
    fbq?: (action: string, eventName: string, params?: any) => void;
  }
}

export function TicketFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    kidTickets: 0,
    adultTickets: 0
  });
  const [loading, setLoading] = useState(false);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedNightAvailability, setSelectedNightAvailability] = useState<Availability | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  // Fetch availability on component mount
  useEffect(() => {
    async function fetchAvailability() {
      try {
        setLoadingAvailability(true);
        const response = await fetch('/api/check-inventory');
        const data = await response.json();

        // Validate response is successful and data is an array
        if (response.ok && Array.isArray(data)) {
          setAvailabilities(data);
        } else {
          console.error('Invalid availability data:', data);
          toast.error("Unable to load availability. KV database may not be configured yet.");
          setAvailabilities([]); // Keep empty array to prevent crash
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        toast.error("Failed to load availability");
        setAvailabilities([]); // Ensure it stays as an array
      } finally {
        setLoadingAvailability(false);
      }
    }

    fetchAvailability();
  }, []);

  // Update selected night availability when date changes
  useEffect(() => {
    if (formData.date) {
      const availability = availabilities.find(a => a.value === formData.date);
      setSelectedNightAvailability(availability || null);
    } else {
      setSelectedNightAvailability(null);
    }
  }, [formData.date, availabilities]);

  const isAdultOnly = selectedNightAvailability?.adultOnly === true;

  const calculateTotal = () => {
    return (formData.kidTickets * 12) + (formData.adultTickets * 12);
  };

  const getTotalTickets = () => {
    return formData.kidTickets + formData.adultTickets;
  };

  const getRemainingKids = () => {
    return selectedNightAvailability ? selectedNightAvailability.kidTicketsRemaining : MAX_KIDS;
  };

  const getRemainingAdults = () => {
    return selectedNightAvailability ? selectedNightAvailability.adultTicketsRemaining : MAX_ADULTS;
  };

  const handleKidChange = (increment: boolean) => {
    const remaining = getRemainingKids();

    if (increment && formData.kidTickets < Math.min(8, remaining)) {
      setFormData({ ...formData, kidTickets: formData.kidTickets + 1 });
    } else if (!increment && formData.kidTickets > 0) {
      setFormData({ ...formData, kidTickets: formData.kidTickets - 1 });
    }
  };

  const handleAdultChange = (increment: boolean) => {
    const remaining = getRemainingAdults();

    if (increment && formData.adultTickets < Math.min(8, remaining)) {
      setFormData({ ...formData, adultTickets: formData.adultTickets + 1 });
    } else if (!increment && formData.adultTickets > 0) {
      setFormData({ ...formData, adultTickets: formData.adultTickets - 1 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.date) {
      toast.error("Please fill in all fields");
      return;
    }

    if (getTotalTickets() === 0) {
      toast.error("Please select at least one ticket");
      return;
    }


    setLoading(true);

    // Track InitiateCheckout event with Meta Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        currency: 'GBP',
        value: calculateTotal(),
        content_type: 'product',
        content_name: 'Kids Cinema Night Tickets',
        num_items: getTotalTickets(),
      });
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          night: formData.date,
          kidTickets: formData.kidTickets,
          adultTickets: formData.adultTickets
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        toast.error(error || "Something went wrong. Please try again.");
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

  // If booking is hidden while planning new dates, show coming soon message
  if (BOOKING_COMING_SOON) {
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
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#F8AFC8] text-white rounded-full">
                <Sparkles className="w-5 h-5" />
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>COMING SOON</span>
              </div>

              <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
                New Dates Coming Soon
              </h2>
              <p className="text-xl" style={{ color: '#717182' }}>
                We're planning something special for you
              </p>
            </div>

            <Card className="p-8 md:p-10 bg-white shadow-2xl border-2 border-[#F8AFC8]/30">
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🎬</div>

                <h3 className="text-2xl md:text-3xl" style={{ fontWeight: 700, color: '#1F1B24' }}>
                  Stay Tuned!
                </h3>

                <p className="text-lg" style={{ color: '#717182', lineHeight: '1.6' }}>
                  We're busy planning Kids Cinema Nights for you. Follow us on social media to be the first to know when tickets go on sale!
                </p>

                <div className="p-5 rounded-xl mt-6" style={{ background: '#F8AFC8', border: '2px solid #F38DB5' }}>
                  <p style={{ fontWeight: 600, color: 'white' }}>
                    New dates will be announced soon!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  // If tickets are sold out, show thank you message instead of form
  if (TICKETS_SOLD_OUT) {
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
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#1F1B24] text-white rounded-full">
                <Ticket className="w-5 h-5" />
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>SOLD OUT</span>
              </div>

              <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
                Thank You! 🎬
              </h2>
              <p className="text-xl" style={{ color: '#717182' }}>
                We've reached full capacity for all nights
              </p>
            </div>

            <Card className="p-8 md:p-10 bg-white shadow-2xl border-2 border-[#F8AFC8]/30">
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🍦</div>

                <h3 className="text-2xl md:text-3xl" style={{ fontWeight: 700, color: '#1F1B24' }}>
                  All Tickets Have Been Sold!
                </h3>

                <p className="text-lg" style={{ color: '#717182', lineHeight: '1.6' }}>
                  We're overwhelmed by the amazing response! Thank you to everyone who secured their tickets.
                  All cinema nights are now completely sold out.
                </p>

                <div className="p-5 rounded-xl mt-6" style={{ background: '#F8AFC8', border: '2px solid #F38DB5' }}>
                  <p style={{ fontWeight: 600, color: 'white' }}>
                    See you at The Scoop Company! 🍿🎬
                  </p>
                </div>

                <p className="text-sm pt-4" style={{ color: '#717182' }}>
                  If you have any questions about your booking, please check your confirmation email
                  or get in touch with us.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tickets" className="py-20 relative overflow-hidden" style={{ background: '#FFE8F0' }}>
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 text-9xl">⭐</div>
        <div className="absolute bottom-20 right-20 text-8xl">✨</div>
        <div className="absolute top-1/2 left-1/4 text-7xl">🎬</div>
        <div className="absolute top-32 right-16 text-8xl">🍿</div>
        <div className="absolute top-1/2 left-1/2 text-7xl transform -translate-x-1/2 -translate-y-1/2">🌟</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full">
              <Ticket className="w-5 h-5" style={{ color: '#F8AFC8' }} />
              <span style={{ fontWeight: 600, color: '#1F1B24' }}>Limited Availability</span>
            </div>

            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
              🎟️ Book Your Seats
            </h2>
            <p className="text-xl" style={{ color: '#717182' }}>
              Secure your spot for a magical movie night
            </p>
          </div>

          <Card className="p-8 md:p-10 bg-white shadow-2xl border-2" style={{ borderColor: '#F8AFC8' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Parent/Carer Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 border-2"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 border-2"
                  disabled={loading}
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number (UK) *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07123 456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-12 border-2"
                  disabled={loading}
                />
                <p className="text-sm" style={{ color: '#717182' }}>
                  Required for booking confirmation
                </p>
              </div>

              {/* Preferred Night */}
              <div className="space-y-2">
                <Label htmlFor="date">Choose Your Screening</Label>
                <Select
                  value={formData.date}
                  onValueChange={(value) => setFormData({ ...formData, date: value })}
                  disabled={loading || loadingAvailability}
                >
                  <SelectTrigger className="h-12 border-2">
                    <SelectValue placeholder={loadingAvailability ? "Loading availability..." : "Choose your movie night"} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(availabilities) && availabilities.length > 0 ? (
                      availabilities.map((availability) => (
                        <SelectItem
                          key={availability.nightKey}
                          value={availability.value}
                          disabled={availability.isSoldOut}
                        >
                          {availability.displayName}
                          {availability.isSoldOut && " - SOLD OUT"}
                          {!availability.isSoldOut && availability.adultTicketsRemaining <= 10 &&
                            ` (${availability.adultTicketsRemaining} tickets left)`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-dates" disabled>
                        {loadingAvailability ? "Loading..." : "No dates available"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Show availability info when date is selected */}
              {selectedNightAvailability && !selectedNightAvailability.isSoldOut && (
                <div className="p-3 rounded-lg" style={{ background: 'rgba(248, 175, 200, 0.15)', border: '1px solid #F8AFC8' }}>
                  <div className="flex items-start gap-2 text-sm">
                    <Ticket className="w-4 h-4 mt-0.5" style={{ color: '#F8AFC8' }} />
                    <div>
                      <p style={{ fontWeight: 600, color: '#1F1B24' }}>Availability for this night:</p>
                      {!isAdultOnly && (
                        <p style={{ color: '#717182' }}>
                          👧 {selectedNightAvailability.kidTicketsRemaining}/{MAX_KIDS} kids tickets remaining
                        </p>
                      )}
                      <p style={{ color: '#717182' }}>
                        🧑 {selectedNightAvailability.adultTicketsRemaining}/{MAX_ADULTS} adult tickets remaining
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ticket Selectors */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 style={{ fontWeight: 700, color: '#1F1B24' }}>Select Your Tickets</h3>
                </div>

                {/* Kids Tickets */}
                {!isAdultOnly && (
                  <div className="p-4 rounded-xl border-2 border-[#F8AFC8]/30 bg-[#F8AFC8]/5">
                    <Label htmlFor="kidTickets" className="flex items-center justify-between mb-2">
                      <span>🎟️ Kids Tickets · £12 each</span>
                    </Label>
                    <p className="text-sm mb-3" style={{ color: '#717182' }}>Any dessert + any drink</p>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        onClick={() => handleKidChange(false)}
                        disabled={formData.kidTickets === 0 || loading}
                        className="w-12 h-12 rounded-full disabled:opacity-30"
                        style={{ background: '#F8AFC8', color: 'white' }}
                      >
                        <Minus className="w-5 h-5" />
                      </Button>
                      <div className="flex-1 text-center">
                        <div className="text-2xl" style={{ fontWeight: 700, color: '#1F1B24' }}>
                          {formData.kidTickets}
                        </div>
                        <div className="text-sm" style={{ color: '#717182' }}>
                          {formData.kidTickets === 0 ? 'None' : `£${formData.kidTickets * 12}`}
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleKidChange(true)}
                        disabled={formData.kidTickets >= Math.min(8, getRemainingKids()) || loading}
                        className="w-12 h-12 rounded-full disabled:opacity-30"
                        style={{ background: '#F8AFC8', color: 'white' }}
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Adult Tickets */}
                <div className="p-4 rounded-xl border-2 border-[#E8A87C]/30 bg-[#E8A87C]/5">
                  <Label htmlFor="adultTickets" className="flex items-center justify-between mb-2">
                    <span>👨‍👩‍👧 Adult Tickets · £12 each</span>
                  </Label>
                  <p className="text-sm mb-3" style={{ color: '#717182' }}>Same great offer • Must book with child ticket</p>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      onClick={() => handleAdultChange(false)}
                      disabled={formData.adultTickets === 0 || loading}
                      className="w-12 h-12 rounded-full disabled:opacity-30"
                      style={{ background: '#D4526E', color: 'white' }}
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 text-center">
                      <div className="text-2xl" style={{ fontWeight: 700, color: '#1F1B24' }}>
                        {formData.adultTickets}
                      </div>
                      <div className="text-sm" style={{ color: '#717182' }}>
                        {formData.adultTickets === 0 ? 'None' : `£${formData.adultTickets * 12}`}
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleAdultChange(true)}
                      disabled={formData.adultTickets >= Math.min(8, getRemainingAdults()) || loading}
                      className="w-12 h-12 rounded-full disabled:opacity-30"
                      style={{ background: '#D4526E', color: 'white' }}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Total Display */}
              <div className="p-6 rounded-xl flex items-center justify-between" style={{ background: '#F8AFC8', color: 'white' }}>
                <div>
                  <span style={{ fontWeight: 700 }}>Total Amount:</span>
                  <p className="text-sm text-white/90">
                    {getTotalTickets()} ticket{getTotalTickets() !== 1 ? 's' : ''}
                    {formData.kidTickets > 0 && ` (${formData.kidTickets} child${formData.kidTickets !== 1 ? 'ren' : ''}`}
                    {formData.adultTickets > 0 && `, ${formData.adultTickets} adult${formData.adultTickets !== 1 ? 's' : ''})`}
                    {formData.kidTickets > 0 && formData.adultTickets === 0 && ')'}
                  </p>
                </div>
                <span className="text-3xl" style={{ fontWeight: 800 }}>
                  £{calculateTotal()}
                </span>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || loadingAvailability || getTotalTickets() === 0}
                className="w-full h-14 text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                style={{ background: '#1F1B24', color: 'white' }}
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Pay £{calculateTotal()}
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
