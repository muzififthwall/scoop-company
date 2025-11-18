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
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  collectionDate: Date | null;
  deliveryOption: "collect" | "delivery";
}

export function OrderForm({ cart, onBack }: OrderFormProps) {
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

  // Christmas Eve date
  const christmasEve = new Date(2025, 11, 24); // December 24, 2025
  const isChristmasEveAvailable = christmasEve >= minDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setError(null);

    // Track InitiateCheckout event with Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        currency: 'GBP',
        value: cart.reduce((sum, item) => sum + (29.99 * item.quantity), 0),
        content_type: 'product',
        content_name: 'Gelato Yule Log',
        num_items: cart.reduce((sum, item) => sum + item.quantity, 0),
      });
    }

    try {
      const response = await fetch("/api/create-yule-log-checkout", {
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

  const isChristmasEveSelected = formData.collectionDate &&
    formData.collectionDate.getTime() === christmasEve.getTime();

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
                  isChristmasEveSelected ? "Christmas Eve 🎄" : format(formData.collectionDate, "PPP")
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
                  setFormData({ ...formData, collectionDate: date || null, deliveryOption: "collect" });
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
            Minimum 72 hours notice required
          </p>
        </div>

        {/* Collection Option */}
        <div className="space-y-3">
          <Label className="text-[#3D2B1F]">Collection Option</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, deliveryOption: "collect" })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.deliveryOption === "collect"
                  ? "border-[#2E4E3F] bg-[#2E4E3F]/5"
                  : "border-[#E3C565]/20 hover:border-[#E3C565]/50"
              }`}
            >
              🏪 Collect In-Store
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, deliveryOption: "delivery", collectionDate: christmasEve })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.deliveryOption === "delivery"
                  ? "border-[#2E4E3F] bg-[#2E4E3F]/5"
                  : "border-[#E3C565]/20 hover:border-[#E3C565]/50"
              }`}
              disabled={!isChristmasEveAvailable}
            >
              🎄 Christmas Eve Collection
            </button>
          </div>
          {formData.deliveryOption === "delivery" && (
            <div className="mt-3 p-3 bg-[#E3C565]/10 rounded-lg border border-[#E3C565]/30">
              <p className="text-sm text-[#3D2B1F]">
                <Info className="w-4 h-4 inline mr-1" />
                Collection slots are limited — we&apos;ll confirm your time window via email.
              </p>
            </div>
          )}
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
            {isSubmitting ? "Processing..." : "Proceed to Payment 🎁"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
