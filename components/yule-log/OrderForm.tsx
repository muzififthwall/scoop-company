"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import type { CartItem } from "./OrderSummary";

interface OrderFormProps {
  cart: CartItem[];
  onBack: () => void;
  // Optional hard floor for the collection date, as 'YYYY-MM-DD'. When set, the
  // calendar won't offer any earlier date (e.g. during a holiday closure).
  earliestCollection?: string;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  collectionDate: Date | null;
  deliveryOption: "collect" | "delivery";
}

// Pricing constants (same as in OrderSummary)
const SIZE_PRICES = {
  small: 27.99,
  large: 34.99
};

const BUTTERCREAM_PRICES = {
  small: 0,
  full: 2.00,
  none: 0
};

const calculateItemPrice = (item: CartItem) => {
  const sizePrice = SIZE_PRICES[item.size];
  const buttercreamPrice = BUTTERCREAM_PRICES[item.buttercream];
  return sizePrice + buttercreamPrice;
};

export function OrderForm({ cart, onBack, earliestCollection }: OrderFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    collectionDate: null,
    deliveryOption: "collect"
  });

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3); // 72 hours from now
  // Raise the floor if collection is closed until a later date (e.g. holiday).
  if (earliestCollection) {
    const floor = new Date(earliestCollection + "T00:00:00");
    if (floor.getTime() > minDate.getTime()) minDate.setTime(floor.getTime());
  }

  const earliestCollectionLabel = earliestCollection
    ? new Date(earliestCollection + "T12:00:00").toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  // Calculate cart total for Meta Pixel tracking
  const cartTotal = cart.reduce((total, item) => {
    return total + calculateItemPrice(item) * item.quantity;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setError(null);

    // Track InitiateCheckout event with Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        currency: 'GBP',
        value: cartTotal,
        content_type: 'product',
        content_name: 'Gelato Cake',
        num_items: cart.reduce((sum, item) => sum + item.quantity, 0),
      });
    }

    try {
      const response = await fetch("/api/create-gelato-cake-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cart,
          customerInfo: formData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.collectionDate !== null
    );
  };

  return (
    <Card className="p-8 bg-white border-2 border-[#E3C565]/30 shadow-xl max-w-2xl mx-auto">
      <h3 className="text-[#3D2B1F] text-2xl font-bold mb-6">Complete Your Order</h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#3D2B1F]">
            Full Name *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border-[#E3C565]/30 focus:border-[#F8AFC8]"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#3D2B1F]">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border-[#E3C565]/30 focus:border-[#F8AFC8]"
            placeholder="your@email.com"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[#3D2B1F]">
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="border-[#E3C565]/30 focus:border-[#F8AFC8]"
            placeholder="+44 7xxx xxx xxx"
            required
          />
        </div>

        {/* Collection Date */}
        <div className="space-y-2">
          <Label className="text-[#3D2B1F]">
            Collection Date *
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left border-[#E3C565]/30 hover:border-[#F8AFC8]"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.collectionDate ? (
                  format(formData.collectionDate, "PPP")
                ) : (
                  <span className="text-[#3D2B1F]/50">Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.collectionDate || undefined}
                onSelect={(date) => {
                  setFormData({ ...formData, collectionDate: date || null });
                  setCalendarOpen(false);
                }}
                disabled={(date) => date < minDate}
                defaultMonth={minDate}
                fromDate={minDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-[#3D2B1F]/60 flex items-center gap-1">
            <Info className="w-3 h-3" />
            {earliestCollection
              ? `Earliest collection is ${earliestCollectionLabel} (we're on a short break)`
              : "Minimum 72 hours notice required"}
          </p>
        </div>

        {/* Collection Option */}
        <div className="space-y-3">
          <Label className="text-[#3D2B1F]">Collection Option</Label>
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, deliveryOption: "collect" })}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                formData.deliveryOption === "collect"
                  ? "border-[#2E4E3F] bg-[#2E4E3F]/5"
                  : "border-[#E3C565]/20 hover:border-[#E3C565]/50"
              }`}
            >
              <span className="block">🏪 Collect from Oxted</span>
              <span className="block text-sm text-[#3D2B1F]/60 mt-0.5">55 Station Road East, Oxted RH8 0AX</span>
            </button>
          </div>
          <div className="p-3 bg-[#E3C565]/10 rounded-lg border border-[#E3C565]/30">
            <p className="text-sm text-[#3D2B1F]">
              <Info className="w-4 h-4 inline mr-1" />
              We&apos;ll confirm your collection time window via email.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 border-[#E3C565]/30"
            disabled={isSubmitting}
          >
            Back to Customisation
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className="flex-1 bg-[#2E4E3F] hover:bg-[#2E4E3F]/90 text-white"
          >
            {isSubmitting ? "Processing..." : "Proceed to Payment 🎂"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
