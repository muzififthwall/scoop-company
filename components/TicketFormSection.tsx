'use client';

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { Ticket, Sparkles, Minus, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Availability {
  nightKey: string;
  displayName: string;
  value: string;
  kidTicketsRemaining: number;
  adultDrinkTicketsRemaining: number;
  adultFullTicketsRemaining: number;
  isSoldOut: boolean;
}

const MAX_KIDS = 15;
const MAX_ADULTS = 15;

export function TicketFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    kidTickets: 0,
    adultDrinkTickets: 0,
    adultFullTickets: 0
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

  const calculateTotal = () => {
    const kids = formData.kidTickets * 10;
    const adultDrink = formData.adultDrinkTickets * 5;
    const adultFull = formData.adultFullTickets * 10;
    return kids + adultDrink + adultFull;
  };

  const getTotalTickets = () => {
    return formData.kidTickets + formData.adultDrinkTickets + formData.adultFullTickets;
  };

  const getRemainingKids = () => {
    return selectedNightAvailability ? selectedNightAvailability.kidTicketsRemaining : MAX_KIDS;
  };

  const getRemainingAdults = () => {
    return selectedNightAvailability ? selectedNightAvailability.adultDrinkTicketsRemaining : MAX_ADULTS;
  };

  const handleKidsChange = (increment: boolean) => {
    const remaining = getRemainingKids();
    if (increment && formData.kidTickets < Math.min(MAX_KIDS, remaining)) {
      setFormData({ ...formData, kidTickets: formData.kidTickets + 1 });
    } else if (!increment && formData.kidTickets > 0) {
      const newKids = formData.kidTickets - 1;
      // If removing last kid ticket, reset adult tickets to 0
      if (newKids === 0) {
        setFormData({ ...formData, kidTickets: 0, adultDrinkTickets: 0, adultFullTickets: 0 });
        toast.error("Adult tickets removed - at least one child ticket is required");
      } else {
        setFormData({ ...formData, kidTickets: newKids });
      }
    }
  };

  const handleAdultDrinkChange = (increment: boolean) => {
    if (formData.kidTickets === 0) {
      toast.error("Please add at least one child ticket to book adult seats");
      return;
    }

    const totalAdults = formData.adultDrinkTickets + formData.adultFullTickets;
    const remaining = getRemainingAdults();

    if (increment && totalAdults < Math.min(MAX_ADULTS, remaining)) {
      setFormData({ ...formData, adultDrinkTickets: formData.adultDrinkTickets + 1 });
    } else if (!increment && formData.adultDrinkTickets > 0) {
      setFormData({ ...formData, adultDrinkTickets: formData.adultDrinkTickets - 1 });
    }
  };

  const handleAdultFullChange = (increment: boolean) => {
    if (formData.kidTickets === 0) {
      toast.error("Please add at least one child ticket to book adult seats");
      return;
    }

    const totalAdults = formData.adultDrinkTickets + formData.adultFullTickets;
    const remaining = getRemainingAdults();

    if (increment && totalAdults < Math.min(MAX_ADULTS, remaining)) {
      setFormData({ ...formData, adultFullTickets: formData.adultFullTickets + 1 });
    } else if (!increment && formData.adultFullTickets > 0) {
      setFormData({ ...formData, adultFullTickets: formData.adultFullTickets - 1 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.date) {
      toast.error("Please fill in all fields");
      return;
    }

    if (getTotalTickets() === 0) {
      toast.error("Please select at least one ticket");
      return;
    }

    if (formData.kidTickets < 1) {
      toast.error("You must book at least 1 kid ticket");
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
          kidTickets: formData.kidTickets,
          adultDrinkTickets: formData.adultDrinkTickets,
          adultFullTickets: formData.adultFullTickets
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

  return (
    <section id="tickets" className="py-20 relative overflow-hidden" style={{ background: '#FFE8F0' }}>
      {/* Decorative background with candy and cone icons */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 text-9xl">🎃</div>
        <div className="absolute bottom-20 right-20 text-9xl">🍦</div>
        <div className="absolute top-1/2 left-1/4 text-7xl">🍬</div>
        <div className="absolute top-32 right-16 text-6xl">🧁</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full">
              <Ticket className="w-5 h-5" style={{ color: '#F8AFC8' }} />
              <span style={{ fontWeight: 600, color: '#1F1B24' }}>Limited Availability</span>
            </div>

            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
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

              {/* Preferred Night */}
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Night</Label>
                <Select
                  value={formData.date}
                  onValueChange={(value) => setFormData({ ...formData, date: value })}
                  disabled={loading || loadingAvailability}
                >
                  <SelectTrigger className="h-12 border-2">
                    <SelectValue placeholder={loadingAvailability ? "Loading availability..." : "Choose a date"} />
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
                          {!availability.isSoldOut && availability.kidTicketsRemaining <= 5 &&
                            ` (${availability.kidTicketsRemaining} kid tickets left)`}
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
                <div className="p-3 rounded-lg" style={{ background: 'rgba(248, 175, 200, 0.1)', border: '1px solid #F8AFC8' }}>
                  <div className="flex items-start gap-2 text-sm">
                    <Ticket className="w-4 h-4 mt-0.5" style={{ color: '#F8AFC8' }} />
                    <div>
                      <p style={{ fontWeight: 600, color: '#1F1B24' }}>Availability for this night:</p>
                      <p style={{ color: '#717182' }}>
                        Kid tickets: {selectedNightAvailability.kidTicketsRemaining}/{15} remaining
                      </p>
                      <p style={{ color: '#717182' }}>
                        Adult tickets: {selectedNightAvailability.adultDrinkTicketsRemaining}/{15} remaining
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ticket Selectors */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 style={{ fontWeight: 700, color: '#1F1B24' }}>Select Your Tickets</h3>
                  {formData.date && (
                    <div className="text-sm" style={{ color: '#717182' }}>
                      <span style={{ fontWeight: 600 }}>Kids: {getRemainingKids()}/15 left</span>
                      {' · '}
                      <span style={{ fontWeight: 600 }}>Adults: {getRemainingAdults()}/15 left</span>
                    </div>
                  )}
                </div>

                {/* Kids Tickets */}
                <div className="p-4 rounded-xl border-2 border-[#F8AFC8]/30 bg-[#F8AFC8]/5">
                  <Label htmlFor="kidTickets" className="flex items-center justify-between mb-2">
                    <span>👧 Kids Tickets (£10 each)</span>
                  </Label>
                  <p className="text-sm mb-3" style={{ color: '#717182' }}>Any dessert + any drink</p>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      onClick={() => handleKidsChange(false)}
                      disabled={formData.kidTickets === 0 || loading}
                      className="w-12 h-12 rounded-full disabled:opacity-30"
                      style={{ background: '#F8AFC8', color: '#1F1B24' }}
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 text-center">
                      <div className="text-2xl" style={{ fontWeight: 700, color: '#1F1B24' }}>
                        {formData.kidTickets}
                      </div>
                      <div className="text-sm" style={{ color: '#717182' }}>
                        {formData.kidTickets === 0 ? 'None' : `£${formData.kidTickets * 10}`}
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleKidsChange(true)}
                      disabled={formData.kidTickets >= Math.min(MAX_KIDS, getRemainingKids()) || loading}
                      className="w-12 h-12 rounded-full disabled:opacity-30"
                      style={{ background: '#F8AFC8', color: '#1F1B24' }}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Adult Drink Tickets */}
                <div className={`p-4 rounded-xl border-2 border-[#FF8C42]/30 bg-[#FF8C42]/5 ${formData.kidTickets === 0 ? 'opacity-50' : ''}`}>
                  <Label htmlFor="adultDrinkTickets" className="flex items-center justify-between mb-2">
                    <span>🧑 Adults — Drink Only (£5 each)</span>
                  </Label>
                  <p className="text-sm mb-3" style={{ color: '#717182' }}>Any drink from the menu</p>
                  {formData.kidTickets === 0 && (
                    <div className="flex items-start gap-2 text-sm mb-3 px-3 py-2 rounded-lg" style={{ background: '#FFF3CD' }}>
                      <AlertCircle className="w-4 h-4 mt-0.5" style={{ color: '#856404' }} />
                      <p style={{ color: '#856404', fontWeight: 600 }}>
                        Add at least one child ticket first
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      onClick={() => handleAdultDrinkChange(false)}
                      disabled={formData.kidTickets === 0 || formData.adultDrinkTickets === 0 || loading}
                      className="w-12 h-12 rounded-full disabled:opacity-30"
                      style={{ background: '#FF8C42', color: 'white' }}
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 text-center">
                      <div className="text-2xl" style={{ fontWeight: 700, color: '#1F1B24' }}>
                        {formData.adultDrinkTickets}
                      </div>
                      <div className="text-sm" style={{ color: '#717182' }}>
                        {formData.adultDrinkTickets === 0 ? 'None' : `£${formData.adultDrinkTickets * 5}`}
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleAdultDrinkChange(true)}
                      disabled={formData.kidTickets === 0 || (formData.adultDrinkTickets + formData.adultFullTickets) >= Math.min(MAX_ADULTS, getRemainingAdults()) || loading}
                      className="w-12 h-12 rounded-full disabled:opacity-30"
                      style={{ background: '#FF8C42', color: 'white' }}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Adult Full Tickets */}
                <div className={`p-4 rounded-xl border-2 border-[#F38DB5]/40 bg-[#F38DB5]/5 ${formData.kidTickets === 0 ? 'opacity-50' : ''}`}>
                  <Label htmlFor="adultFullTickets" className="flex items-center justify-between mb-2">
                    <span>🧑 Adults — Full Treat (£10 each)</span>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#F38DB5', color: 'white' }}>Popular</span>
                  </Label>
                  <p className="text-sm mb-3" style={{ color: '#717182' }}>Any dessert + any drink</p>
                  {formData.kidTickets === 0 && (
                    <div className="flex items-start gap-2 text-sm mb-3 px-3 py-2 rounded-lg" style={{ background: '#FFF3CD' }}>
                      <AlertCircle className="w-4 h-4 mt-0.5" style={{ color: '#856404' }} />
                      <p style={{ color: '#856404', fontWeight: 600 }}>
                        Add at least one child ticket first
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      onClick={() => handleAdultFullChange(false)}
                      disabled={formData.kidTickets === 0 || formData.adultFullTickets === 0 || loading}
                      className="w-12 h-12 rounded-full disabled:opacity-30"
                      style={{ background: '#F38DB5', color: 'white' }}
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 text-center">
                      <div className="text-2xl" style={{ fontWeight: 700, color: '#1F1B24' }}>
                        {formData.adultFullTickets}
                      </div>
                      <div className="text-sm" style={{ color: '#717182' }}>
                        {formData.adultFullTickets === 0 ? 'None' : `£${formData.adultFullTickets * 10}`}
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleAdultFullChange(true)}
                      disabled={formData.kidTickets === 0 || (formData.adultDrinkTickets + formData.adultFullTickets) >= Math.min(MAX_ADULTS, getRemainingAdults()) || loading}
                      className="w-12 h-12 rounded-full disabled:opacity-30"
                      style={{ background: '#F38DB5', color: 'white' }}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Total Display */}
              <div className="p-5 rounded-xl" style={{ background: '#F8AFC8', border: '2px solid #F38DB5' }}>
                <div className="flex justify-between items-center">
                  <div>
                    <span style={{ fontWeight: 700, color: '#1F1B24' }}>Total Amount:</span>
                    <p className="text-sm" style={{ color: '#1F1B24', opacity: 0.8 }}>
                      {getTotalTickets()} ticket{getTotalTickets() !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="text-3xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
                    £{calculateTotal()}
                  </span>
                </div>
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
