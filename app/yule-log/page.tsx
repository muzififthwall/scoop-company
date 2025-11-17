"use client";

import { useState } from "react";
import { FlavourCard } from "@/components/yule-log/FlavourCard";
import { OptionToggle } from "@/components/yule-log/OptionToggle";
import { YuleLogPreview } from "@/components/yule-log/YuleLogPreview";
import { OrderSummary, CartItem } from "@/components/yule-log/OrderSummary";
import { OrderForm } from "@/components/yule-log/OrderForm";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, ChevronDown } from "lucide-react";

const FLAVOURS = [
  { name: "Milk Chocolate", color: "from-[#8B4513] to-[#654321]", textColor: "text-white" },
  { name: "Dark Chocolate", color: "from-[#3E2723] to-[#1B0000]", textColor: "text-white" },
  { name: "Sticky Toffee", color: "from-[#D4A574] to-[#C19A6B]", textColor: "text-[#3D2B1F]" },
  { name: "Oreo", color: "from-[#2C2C2C] to-[#1A1A1A]", textColor: "text-white" },
  { name: "Candy Cane", color: "from-[#FF6B6B] to-[#FF4757]", textColor: "text-white" },
  { name: "Pistachio", color: "from-[#93C572] to-[#6FA54B]", textColor: "text-white" },
  { name: "Christmas Pudding", color: "from-[#5D4037] to-[#3E2723]", textColor: "text-white" }
];

const SAUCES = [
  { name: "Strawberry" },
  { name: "Biscoff" },
  { name: "Cherry" },
  { name: "Nutella" },
  { name: "Luxury White Chocolate" },
  { name: "Classic Chocolate" },
  { name: "Bubblegum" },
  { name: "Raspberry" },
  { name: "Bueno" },
  { name: "Lemon Curd" },
  { name: "Caramel" },
  { name: "Pistachio Cream" },
  { name: "Luxury Milk Chocolate" }
];

const TOPPINGS = [
  { name: "Cheesecake Crumb" },
  { name: "Seasonal Sprinkles" },
  { name: "Biscoff Crumb" },
  { name: "Caramelised Nuts" },
  { name: "Unicorn Poop" },
  { name: "Mixed Nuts" },
  { name: "Oreo Crumb" },
  { name: "Cadbury Pieces" },
  { name: "Honeycomb Bites" }
];

const BASE_PRICE = 29.99;

export default function YuleLogPage() {
  // Current item being built
  const [selectedFlavour, setSelectedFlavour] = useState<string | null>(null);
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Order flow state
  const [showForm, setShowForm] = useState(false);

  const currentItemPrice = selectedFlavour ? BASE_PRICE : 0;

  const toggleSauce = (sauce: string) => {
    setSelectedSauces((prev) => {
      if (prev.includes(sauce)) {
        return prev.filter((s) => s !== sauce);
      } else if (prev.length < 2) {
        return [...prev, sauce];
      }
      return prev;
    });
  };

  const toggleTopping = (topping: string) => {
    setSelectedToppings((prev) => {
      if (prev.includes(topping)) {
        return prev.filter((t) => t !== topping);
      } else if (prev.length < 2) {
        return [...prev, topping];
      }
      return prev;
    });
  };

  const addToCart = () => {
    if (!selectedFlavour) return;

    const newItem: CartItem = {
      id: editingItemId || Date.now().toString(),
      flavour: selectedFlavour,
      sauces: [...selectedSauces],
      toppings: [...selectedToppings],
      quantity: 1
    };

    if (editingItemId) {
      setCart(cart.map(item => item.id === editingItemId ? newItem : item));
      setEditingItemId(null);
    } else {
      setCart([...cart, newItem]);
    }

    // Reset builder
    setSelectedFlavour(null);
    setSelectedSauces([]);
    setSelectedToppings([]);
  };

  const editCartItem = (itemId: string) => {
    const item = cart.find(i => i.id === itemId);
    if (item) {
      setSelectedFlavour(item.flavour);
      setSelectedSauces([...item.sauces]);
      setSelectedToppings([...item.toppings]);
      setEditingItemId(itemId);

      // Scroll to builder
      setTimeout(() => {
        document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const removeCartItem = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
    if (editingItemId === itemId) {
      setEditingItemId(null);
      setSelectedFlavour(null);
      setSelectedSauces([]);
      setSelectedToppings([]);
    }
  };

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 10) return;
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setSelectedFlavour(null);
    setSelectedSauces([]);
    setSelectedToppings([]);
  };

  const handleCheckout = () => {
    setShowForm(true);
    setTimeout(() => {
      document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const scrollToBuilder = () => {
    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8FB] via-[#F8AFC8]/5 to-[#FFF8FB]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#FFF8FB] via-[#F8AFC8]/10 to-[#FFF8FB]" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="text-left md:text-left animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4 md:justify-start justify-center">
                <Sparkles className="w-8 h-8 text-[#E3C565]" />
                <Gift className="w-10 h-10 text-[#F8AFC8]" />
                <Sparkles className="w-8 h-8 text-[#E3C565]" />
              </div>

              <h1 className="mb-4 text-[#3D2B1F] text-4xl md:text-5xl lg:text-6xl font-bold">
                Build Your Perfect<br />Gelato Yule Log 🎅🏼
              </h1>

              <p className="text-lg md:text-xl text-[#3D2B1F]/70 mb-8">
                Hand-crafted by Gelato by Maria — smooth, rich, and totally customisable.
              </p>

              <Button
                onClick={scrollToBuilder}
                className="bg-[#F8AFC8] hover:bg-[#F8AFC8]/90 text-[#3D2B1F] px-8 py-6 text-lg shadow-xl"
              >
                Start Building 🎁
              </Button>
            </div>

            {/* Right - Yule Log Image */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/images/yule-log-image.png"
                  alt="The Scoop Company Gelato Yule Log"
                  className="w-full h-auto object-cover"
                />
                {/* Decorative elements */}
                <div className="absolute -top-8 -right-8 text-5xl animate-spin-slow">
                  ✨
                </div>
                <div className="absolute -bottom-6 -left-6 text-4xl animate-spin-reverse">
                  🎄
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-[#3D2B1F]/40" />
          </div>
        </div>
      </section>

      {/* Builder Section */}
      <section id="builder" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Builder */}
            <div className="lg:col-span-2 space-y-12">
              {editingItemId && (
                <div className="bg-[#E3C565]/20 border-2 border-[#E3C565] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[#3D2B1F] font-semibold">✏️ Editing Yule Log</p>
                    <p className="text-sm text-[#3D2B1F]/60">Make your changes below</p>
                  </div>
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    className="border-[#3D2B1F]/30"
                  >
                    Cancel Edit
                  </Button>
                </div>
              )}

              {/* Choose Base Flavour */}
              <div className="relative">
                <div className="absolute -top-4 -right-4 text-3xl opacity-50 pointer-events-none hidden md:block">
                  🍨
                </div>

                <div className="mb-6">
                  <h2 className="text-[#3D2B1F] text-2xl font-bold mb-2">Choose Your Base Flavour</h2>
                  <p className="text-[#3D2B1F]/60">Pick one delicious foundation</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {FLAVOURS.map((flavour) => (
                    <FlavourCard
                      key={flavour.name}
                      name={flavour.name}
                      isSelected={selectedFlavour === flavour.name}
                      onClick={() => setSelectedFlavour(flavour.name)}
                      color={flavour.color}
                      textColor={flavour.textColor}
                    />
                  ))}
                </div>
              </div>

              {/* Choose Sauces */}
              <div>
                <div className="mb-6">
                  <h2 className="text-[#3D2B1F] text-2xl font-bold mb-2">Choose Your Sauces</h2>
                  <p className="text-[#3D2B1F]/60">
                    Pick up to 2 sauces to drizzle over your Yule Log 🎅
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SAUCES.map((sauce) => (
                    <OptionToggle
                      key={sauce.name}
                      name={sauce.name}
                      isSelected={selectedSauces.includes(sauce.name)}
                      onClick={() => toggleSauce(sauce.name)}
                    />
                  ))}
                </div>
              </div>

              {/* Choose Toppings */}
              <div>
                <div className="mb-6">
                  <h2 className="text-[#3D2B1F] text-2xl font-bold mb-2">Choose Your Toppings</h2>
                  <p className="text-[#3D2B1F]/60">
                    Pick up to 2 toppings to finish your masterpiece ✨
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TOPPINGS.map((topping) => (
                    <OptionToggle
                      key={topping.name}
                      name={topping.name}
                      isSelected={selectedToppings.includes(topping.name)}
                      onClick={() => toggleTopping(topping.name)}
                    />
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              {selectedFlavour && (
                <div className="sticky bottom-6 z-10">
                  <Button
                    onClick={addToCart}
                    className="w-full bg-[#2E4E3F] hover:bg-[#2E4E3F]/90 text-white py-6 text-lg shadow-2xl"
                  >
                    {editingItemId ? "Update Yule Log" : "Add to Cart"} — £{currentItemPrice.toFixed(2)}
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column - Preview & Summary */}
            <div className="sticky top-8 self-start space-y-6">
              {/* Live Preview */}
              <div className="bg-white rounded-2xl border-2 border-[#E3C565]/30 p-6 shadow-xl">
                <h3 className="text-[#3D2B1F] font-semibold mb-4 text-center">Live Preview</h3>
                <YuleLogPreview
                  selectedFlavour={selectedFlavour}
                  selectedSauces={selectedSauces}
                  selectedToppings={selectedToppings}
                />
              </div>

              {/* Order Summary */}
              <OrderSummary
                cart={cart}
                onEditItem={editCartItem}
                onRemoveItem={removeCartItem}
                onUpdateQuantity={updateCartItemQuantity}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      {showForm && (
        <section id="order-form" className="py-16 px-6 bg-[#F8AFC8]/5">
          <div className="max-w-7xl mx-auto">
            <OrderForm
              cart={cart}
              onBack={() => setShowForm(false)}
            />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-[#3D2B1F]/60 border-t border-[#E3C565]/20">
        <p>The Scoop Company · Gelato by Maria</p>
        <p className="text-sm mt-2">Making Christmas sweeter, one Yule Log at a time 🎄</p>
      </footer>
    </div>
  );
}
