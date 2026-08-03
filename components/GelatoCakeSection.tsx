"use client";

import { useState } from "react";
import { FlavourCard } from "@/components/yule-log/FlavourCard";
import { OptionToggle } from "@/components/yule-log/OptionToggle";
import { CakePreview } from "@/components/yule-log/CakePreview";
import { OrderSummary, CartItem } from "@/components/yule-log/OrderSummary";
import { OrderForm } from "@/components/yule-log/OrderForm";
import { Button } from "@/components/ui/button";
import { Sparkles, Cake, ChevronDown, Check } from "lucide-react";
import { GELATO_CAKES_SOLD_OUT } from "@/lib/inventory";
import { StickyMobileHeader } from "@/components/cake/StickyMobileHeader";

// Size options with pricing
const SIZES = [
  { id: "small", name: "Small", serves: "6–8", price: 27.99, note: "Excludes chocolate & nut flavours" },
  { id: "large", name: "Large", serves: "10–12", price: 34.99, note: "All flavours available" }
] as const;

type SizeId = typeof SIZES[number]["id"];

// Buttercream options
const BUTTERCREAM_OPTIONS = [
  { id: "small", name: "Small Decorative", description: "Light decorative swirls", price: 0, dietary: "(Vg, GF)" },
  { id: "full", name: "Full Buttercream", description: "Fuller coverage", price: 2.00, dietary: "(Vg, GF)" },
  { id: "none", name: "No Buttercream", description: "Pure gelato experience", price: 0, dietary: "" }
] as const;

type ButtercreamId = typeof BUTTERCREAM_OPTIONS[number]["id"];

// Flavours with availability based on size
const FLAVOURS = [
  { id: 'pistachio', name: 'Pistachio', color: 'from-[#BBF7D0] to-[#86EFAC]', textColor: 'text-[#3D2B1F]', dietary: ['V', 'GF', 'D', 'N'], available: 'large-only' },
  { id: 'dark-chocolate', name: 'Dark Chocolate', color: 'from-[#78350F] to-[#451A03]', textColor: 'text-white', dietary: ['V', 'Vg', 'H', 'GF'], available: 'large-only' },
  { id: 'milk-chocolate', name: 'Milk Chocolate', color: 'from-[#A16207] to-[#854D0E]', textColor: 'text-white', dietary: ['V', 'H', 'GF', 'D', 'S'], available: 'large-only' },
  { id: 'jersey-cream', name: 'Jersey Cream', color: 'from-[#FEF9C3] to-[#FDE68A]', textColor: 'text-[#3D2B1F]', dietary: ['V', 'H', 'GF', 'D'], available: 'both' },
  { id: 'cherry-ripple', name: 'Cherry Ripple', color: 'from-[#FECDD3] to-[#FDA4AF]', textColor: 'text-[#3D2B1F]', dietary: ['V', 'GF', 'D'], available: 'both' },
  { id: 'strawberry', name: 'Strawberry', color: 'from-[#FBCFE8] to-[#F9A8D4]', textColor: 'text-[#3D2B1F]', dietary: ['V', 'Vg', 'H', 'GF'], available: 'both' },
  { id: 'mango', name: 'Mango', color: 'from-[#FED7AA] to-[#FDBA74]', textColor: 'text-[#3D2B1F]', dietary: ['V', 'Vg', 'H', 'GF'], available: 'both' },
  { id: 'salted-caramel', name: 'Salted Caramel', color: 'from-[#D4A574] to-[#C19A6B]', textColor: 'text-[#3D2B1F]', dietary: ['V', 'GF', 'D', 'S'], available: 'both' },
  { id: 'mint-chocolate', name: 'Mint Chocolate', color: 'from-[#A7F3D0] to-[#6EE7B7]', textColor: 'text-[#3D2B1F]', dietary: ['V', 'GF', 'D'], available: 'both' },
];

// Sauces
const SAUCES = [
  { id: 'milk-chocolate', name: 'Milk Chocolate', dietary: ['D', 'V', 'GF'] },
  { id: 'caramel', name: 'Caramel', dietary: ['D', 'V', 'GF'] },
  { id: 'strawberry', name: 'Strawberry', dietary: ['Vg', 'GF'] },
  { id: 'white-chocolate', name: 'White Chocolate', dietary: ['D', 'V', 'S', 'GF'] },
  { id: 'biscoff', name: 'Biscoff', dietary: ['Vg', 'G'] },
  { id: 'bueno', name: 'Bueno', dietary: ['D', 'V', 'S', 'N', 'GF'] },
];

// Toppings
const TOPPINGS = [
  { id: 'sprinkles', name: 'Sprinkles', emoji: '🌈', dietary: ['Vg', 'GF'] },
  { id: 'oreo-crumb', name: 'Oreo Crumb', emoji: '🍪', dietary: ['Vg', 'S', 'G'] },
  { id: 'mixed-nuts', name: 'Mixed Nuts', emoji: '🥜', dietary: ['Vg', 'N', 'GF'] },
  { id: 'biscoff-crumb', name: 'Biscoff Crumb', emoji: '🍪', dietary: ['Vg', 'S', 'G'] },
  { id: 'raspberry-crisp', name: 'Raspberry Crisp', emoji: '🍓', dietary: ['Vg', 'GF'] },
  { id: 'strawberry-popping-candy', name: 'Strawberry Popping Candy', emoji: '🍬', dietary: ['Vg', 'GF'] },
  { id: 'marshmallows', name: 'Mini Marshmallows', emoji: '☁️', dietary: ['GF'] },
];

export function GelatoCakeSection() {
  // Current item being built
  const [selectedSize, setSelectedSize] = useState<SizeId>("small");
  const [selectedButtercream, setSelectedButtercream] = useState<ButtercreamId>("small");
  const [selectedFlavour, setSelectedFlavour] = useState<string | null>(null);
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Order flow state
  const [showForm, setShowForm] = useState(false);

  // Calculate current item price
  const sizePrice = SIZES.find(s => s.id === selectedSize)?.price || 27.99;
  const buttercreamPrice = BUTTERCREAM_OPTIONS.find(b => b.id === selectedButtercream)?.price || 0;
  const currentItemPrice = selectedFlavour ? sizePrice + buttercreamPrice : 0;

  // When size changes, check if selected flavour is still valid
  const handleSizeChange = (newSize: SizeId) => {
    setSelectedSize(newSize);
    // If switching to small and current flavour is large-only, clear it
    if (newSize === "small" && selectedFlavour) {
      const flavour = FLAVOURS.find(f => f.id === selectedFlavour);
      if (flavour?.available === "large-only") {
        setSelectedFlavour(null);
      }
    }
  };

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
      size: selectedSize,
      buttercream: selectedButtercream,
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
    setSelectedSize("small");
    setSelectedButtercream("small");
    setSelectedFlavour(null);
    setSelectedSauces([]);
    setSelectedToppings([]);
  };

  const editCartItem = (itemId: string) => {
    const item = cart.find(i => i.id === itemId);
    if (item) {
      setSelectedSize(item.size);
      setSelectedButtercream(item.buttercream);
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
      setSelectedSize("small");
      setSelectedButtercream("small");
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
    setSelectedSize("small");
    setSelectedButtercream("small");
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
      {/* Sticky Mobile Header */}
      <StickyMobileHeader
        selectedSize={selectedSize}
        selectedButtercream={selectedButtercream}
        selectedFlavour={selectedFlavour}
        selectedSauces={selectedSauces}
        selectedToppings={selectedToppings}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#FFF8FB] via-[#F8AFC8]/10 to-[#FFF8FB]" />

        {/* Decorative blurred elements */}
        <div className="absolute inset-0 opacity-20 z-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-300 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-blue-300 rounded-full blur-xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div className="text-left md:text-left animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4 md:justify-start justify-center">
                <Sparkles className="w-8 h-8 text-[#E3C565]" />
                <Cake className="w-10 h-10 text-[#F8AFC8]" />
                <Sparkles className="w-8 h-8 text-[#E3C565]" />
              </div>

              <h1 className="mb-4 text-[#3D2B1F] text-4xl md:text-5xl lg:text-6xl font-bold">
                Build Your Perfect<br />Gelato Cake 🎂
              </h1>

              <p className="text-lg md:text-xl text-[#3D2B1F]/70 mb-8">
                Hand-crafted by <span className="font-semibold text-[#F8AFC8]">Gelato by Maria</span>. Smooth, rich and totally customisable for your celebration.
              </p>

              {GELATO_CAKES_SOLD_OUT ? (
                <div className="bg-red-100 border-2 border-red-400 rounded-xl p-6 text-center">
                  <p className="text-red-700 font-bold text-xl mb-2">Sold Out!</p>
                  <p className="text-red-600">
                    All Gelato Cakes are currently sold out. Please check back soon!
                  </p>
                </div>
              ) : (
                <Button
                  onClick={scrollToBuilder}
                  className="bg-[#F8AFC8] hover:bg-[#F8AFC8]/90 text-[#3D2B1F] px-8 py-6 text-lg shadow-xl"
                >
                  Start Building 🎉
                </Button>
              )}

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 mt-6 text-sm sm:text-base text-[#3D2B1F]/60">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#F8AFC8] rounded-full"></span>
                  Made fresh
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#F8AFC8] rounded-full"></span>
                  Customisable
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#F8AFC8] rounded-full"></span>
                  Celebration-ready
                </span>
              </div>
            </div>

            {/* Right - Cake Image */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/images/gelato-cake-image.png"
                  alt="The Scoop Company Gelato Cake"
                  className="w-full h-auto object-cover"
                />
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 text-6xl animate-bounce">
                  🎉
                </div>
                <div className="absolute -bottom-4 -left-4 text-5xl animate-pulse">
                  ✨
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-[#3D2B1F]/40" />
          </div>
        </div>
      </section>

      {/* Builder Section - Hidden when sold out */}
      {!GELATO_CAKES_SOLD_OUT && (
      <section id="builder" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Builder */}
            <div className="lg:col-span-2 space-y-8">
              {editingItemId && (
                <div className="bg-[#E3C565]/20 border-2 border-[#E3C565] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[#3D2B1F] font-semibold">✏️ Editing Gelato Cake</p>
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

              {/* Step 1: Choose Size */}
              <div className="bg-white rounded-3xl shadow-lg p-6 lg:p-8 border-2 border-[#F8AFC8]/20">
                <div className="mb-6">
                  <h2 className="text-[#3D2B1F] text-xl font-semibold mb-1">Step 1: Choose Your Size</h2>
                  <p className="text-sm text-[#3D2B1F]/60">Pick the perfect size for your celebration</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleSizeChange(size.id)}
                      className={`relative p-6 rounded-2xl border-2 transition-all ${
                        selectedSize === size.id
                          ? "border-[#F8AFC8] bg-[#F8AFC8]/10 shadow-lg"
                          : "border-gray-200 bg-white hover:border-[#F8AFC8]/50"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className={`p-4 rounded-full ${selectedSize === size.id ? "bg-[#F8AFC8]/30" : "bg-gray-100"}`}>
                          <Cake className={`w-8 h-8 ${selectedSize === size.id ? "text-[#F8AFC8]" : "text-gray-600"}`} />
                        </div>
                        <div>
                          <div className="font-semibold text-lg text-[#3D2B1F]">{size.name}</div>
                          <div className="text-sm text-[#3D2B1F]/60">Serves {size.serves}</div>
                          <div className="text-lg font-bold text-[#F8AFC8] mt-2">£{size.price.toFixed(2)}</div>
                          <div className="text-xs text-[#3D2B1F]/50 mt-1">{size.note}</div>
                        </div>
                      </div>
                      {selectedSize === size.id && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-[#F8AFC8] rounded-full flex items-center justify-center text-white text-sm">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Choose Buttercream */}
              <div className="bg-white rounded-3xl shadow-lg p-6 lg:p-8 border-2 border-[#F8AFC8]/20">
                <div className="mb-6">
                  <h2 className="text-[#3D2B1F] text-xl font-semibold mb-1">Step 2: Choose Your Buttercream</h2>
                  <p className="text-sm text-[#3D2B1F]/60">Select your preferred buttercream style</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {BUTTERCREAM_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedButtercream(option.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                        selectedButtercream === option.id
                          ? "border-[#F8AFC8] bg-[#F8AFC8]/10 shadow-md"
                          : "border-gray-200 bg-white hover:border-[#F8AFC8]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#3D2B1F]">{option.name}</span>
                            {option.dietary && (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                {option.dietary}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-[#3D2B1F]/60 mt-1">{option.description}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-semibold ${option.price > 0 ? "text-[#F8AFC8]" : "text-[#3D2B1F]/70"}`}>
                            {option.price > 0 ? `+£${option.price.toFixed(2)}` : "Included"}
                          </span>
                          {selectedButtercream === option.id && (
                            <div className="w-6 h-6 bg-[#F8AFC8] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Choose Gelato Flavour */}
              <div className="bg-white rounded-3xl shadow-lg p-6 lg:p-8 border-2 border-[#F8AFC8]/20">
                <div className="mb-6">
                  <h2 className="text-[#3D2B1F] text-xl font-semibold mb-1">Step 3: Choose Your Gelato Flavour</h2>
                  <p className="text-sm text-[#3D2B1F]/60">Select one delicious flavour</p>
                  <div className="flex flex-wrap gap-2 mt-3 text-xs text-[#3D2B1F]/50">
                    <span>V = Vegetarian</span>
                    <span>•</span>
                    <span>Vg = Vegan</span>
                    <span>•</span>
                    <span>GF = Gluten Free</span>
                    <span>•</span>
                    <span>D = Dairy Free</span>
                    <span>•</span>
                    <span>N = Contains Nuts</span>
                    <span>•</span>
                    <span>H = Halal</span>
                    <span>•</span>
                    <span>S = Contains Soya</span>
                    <span>•</span>
                    <span>G = Contains Gluten</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FLAVOURS.map((flavour) => {
                    const isDisabled = selectedSize === "small" && flavour.available === "large-only";

                    return (
                      <button
                        key={flavour.id}
                        onClick={() => !isDisabled && setSelectedFlavour(flavour.id)}
                        disabled={isDisabled}
                        className={`relative p-4 rounded-xl border-2 transition-all ${
                          isDisabled
                            ? "opacity-40 cursor-not-allowed border-gray-200 bg-gray-50"
                            : selectedFlavour === flavour.id
                            ? `bg-gradient-to-br ${flavour.color} border-[#F8AFC8] shadow-md`
                            : "border-gray-200 bg-white hover:border-[#F8AFC8]/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className={`font-semibold text-left ${selectedFlavour === flavour.id ? flavour.textColor : "text-[#3D2B1F]"}`}>
                              {flavour.name}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {flavour.dietary.map((diet) => (
                                <span
                                  key={diet}
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    selectedFlavour === flavour.id
                                      ? "bg-white/25 text-inherit"
                                      : diet === "V" || diet === "Vg"
                                      ? "text-green-700 bg-green-100"
                                      : diet === "GF"
                                      ? "text-blue-700 bg-blue-100"
                                      : diet === "D"
                                      ? "text-purple-700 bg-purple-100"
                                      : diet === "H"
                                      ? "text-teal-700 bg-teal-100"
                                      : diet === "S" || diet === "G"
                                      ? "text-amber-700 bg-amber-100"
                                      : "text-orange-700 bg-orange-100"
                                  }`}
                                >
                                  {diet}
                                </span>
                              ))}
                            </div>
                            {isDisabled && (
                              <div className="text-xs text-gray-500 mt-1">Large cakes only</div>
                            )}
                          </div>
                          {selectedFlavour === flavour.id && !isDisabled && (
                            <div className="w-6 h-6 bg-[#F8AFC8] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Choose Sauces */}
              <div className="bg-white rounded-3xl shadow-lg p-6 lg:p-8 border-2 border-[#F8AFC8]/20">
                <div className="mb-6">
                  <h2 className="text-[#3D2B1F] text-xl font-semibold mb-1">
                    Step 4: Choose Your Sauces
                    <span className="ml-2 text-sm font-normal text-[#3D2B1F]/60">
                      ({selectedSauces.length}/2 selected)
                    </span>
                  </h2>
                  <p className="text-sm text-[#3D2B1F]/60">Pick up to 2 delicious drizzles</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SAUCES.map((sauce) => {
                    const isSelected = selectedSauces.includes(sauce.id);
                    const isDisabled = !isSelected && selectedSauces.length >= 2;

                    return (
                      <button
                        key={sauce.id}
                        onClick={() => toggleSauce(sauce.id)}
                        disabled={isDisabled}
                        className={`relative p-4 rounded-xl border-2 transition-all ${
                          isDisabled
                            ? "opacity-40 cursor-not-allowed border-gray-200 bg-gray-50"
                            : isSelected
                            ? "border-[#F8AFC8] bg-[#F8AFC8]/10 shadow-md"
                            : "border-gray-200 bg-white hover:border-[#F8AFC8]/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-semibold text-left text-[#3D2B1F]">{sauce.name}</div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {sauce.dietary.map((diet) => (
                                <span
                                  key={diet}
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    diet === "V" || diet === "Vg"
                                      ? "text-green-700 bg-green-100"
                                      : diet === "GF"
                                      ? "text-blue-700 bg-blue-100"
                                      : diet === "D"
                                      ? "text-purple-700 bg-purple-100"
                                      : diet === "H"
                                      ? "text-teal-700 bg-teal-100"
                                      : diet === "S" || diet === "G"
                                      ? "text-amber-700 bg-amber-100"
                                      : "text-orange-700 bg-orange-100"
                                  }`}
                                >
                                  {diet}
                                </span>
                              ))}
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-[#F8AFC8] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedSauces.length === 0 && (
                  <div className="text-sm text-[#3D2B1F]/50 italic text-center p-3 bg-gray-50 rounded-lg mt-4">
                    No sauces selected yet. Choose up to 2!
                  </div>
                )}
              </div>

              {/* Step 5: Choose Toppings */}
              <div className="bg-white rounded-3xl shadow-lg p-6 lg:p-8 border-2 border-[#F8AFC8]/20">
                <div className="mb-6">
                  <h2 className="text-[#3D2B1F] text-xl font-semibold mb-1">
                    Step 5: Choose Your Toppings
                    <span className="ml-2 text-sm font-normal text-[#3D2B1F]/60">
                      ({selectedToppings.length}/2 selected)
                    </span>
                  </h2>
                  <p className="text-sm text-[#3D2B1F]/60">Pick up to 2 fun toppings</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {TOPPINGS.map((topping) => {
                    const isSelected = selectedToppings.includes(topping.id);
                    const isDisabled = !isSelected && selectedToppings.length >= 2;

                    return (
                      <button
                        key={topping.id}
                        onClick={() => toggleTopping(topping.id)}
                        disabled={isDisabled}
                        className={`relative p-4 rounded-xl border-2 transition-all ${
                          isDisabled
                            ? "opacity-40 cursor-not-allowed border-gray-200 bg-gray-50"
                            : isSelected
                            ? "border-[#F8AFC8] bg-[#F8AFC8]/10 shadow-md transform scale-105"
                            : "border-gray-200 bg-white hover:border-[#F8AFC8]/50 hover:scale-105"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-3xl">{topping.emoji}</span>
                          <span className="text-sm font-medium text-center text-[#3D2B1F]">{topping.name}</span>
                          {topping.dietary && topping.dietary.length > 0 && (
                            <div className="flex flex-wrap gap-1 justify-center">
                              {topping.dietary.map((d) => (
                                <span
                                  key={d}
                                  className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#3D2B1F]/5 text-[#3D2B1F]/60"
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-[#F8AFC8] rounded-full flex items-center justify-center text-white text-xs">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedToppings.length === 0 && (
                  <div className="text-sm text-[#3D2B1F]/50 italic text-center p-3 bg-gray-50 rounded-lg mt-4">
                    No toppings selected yet. Choose up to 2!
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              {selectedFlavour && (
                <div className="sticky bottom-6 z-10">
                  <Button
                    onClick={addToCart}
                    className="w-full bg-[#2E4E3F] hover:bg-[#2E4E3F]/90 text-white py-6 text-lg shadow-2xl"
                  >
                    {editingItemId ? "Update Gelato Cake" : "Add to Cart"} · £{currentItemPrice.toFixed(2)}
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column - Preview & Summary */}
            <div className="sticky top-8 self-start space-y-6">
              {/* Live Preview */}
              <div className="bg-white rounded-2xl border-2 border-[#E3C565]/30 p-6 shadow-xl">
                <h3 className="text-[#3D2B1F] font-semibold mb-4 text-center">Live Preview</h3>
                <CakePreview
                  selectedSize={selectedSize}
                  selectedButtercream={selectedButtercream}
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
      )}

      {/* Order Form Section - Hidden when sold out */}
      {!GELATO_CAKES_SOLD_OUT && showForm && (
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
        <p className="text-sm mt-2">Making celebrations sweeter, one gelato cake at a time 🎉</p>
        <p className="text-sm mt-2">
          <a href="/careers" className="underline underline-offset-2">We&apos;re hiring — join the team</a>
        </p>
        <div className="flex justify-center gap-4 text-xs text-[#3D2B1F]/50 mt-4">
          <span>🍦 Hand-crafted gelato</span>
          <span>•</span>
          <span>🎂 Made fresh daily</span>
          <span>•</span>
          <span>✨ Celebration specialists</span>
        </div>
      </footer>
    </div>
  );
}
