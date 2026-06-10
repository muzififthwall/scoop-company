"use client";

import { useState, useEffect } from "react";
import { Cake } from "lucide-react";

interface StickyMobileHeaderProps {
  selectedSize: "small" | "large" | null;
  selectedButtercream?: "small" | "full" | "none";
  selectedFlavour: string | null;
  selectedSauces: string[];
  selectedToppings: string[];
  getFlavourName?: (id: string) => string;
}

// Default flavour name mapping
const defaultGetFlavourName = (flavourId: string) => {
  const names: { [key: string]: string } = {
    'pistachio': 'Pistachio',
    'dark-chocolate': 'Dark Chocolate',
    'milk-chocolate': 'Milk Chocolate',
    'jersey-cream': 'Jersey Cream',
    'cherry-ripple': 'Cherry Ripple',
    'strawberry': 'Strawberry',
    'mango': 'Mango',
    'salted-caramel': 'Salted Caramel',
    'mint-chocolate': 'Mint Chocolate',
  };
  return names[flavourId] || flavourId;
};

export function StickyMobileHeader({
  selectedSize,
  selectedButtercream = "small",
  selectedFlavour,
  selectedSauces,
  selectedToppings,
  getFlavourName = defaultGetFlavourName,
}: StickyMobileHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show header after scrolling past the hero section (roughly 100vh)
      const heroHeight = window.innerHeight;
      setIsVisible(window.scrollY > heroHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render on desktop or when not visible
  if (!isVisible) return null;

  const hasSelection = selectedFlavour || selectedSauces.length > 0 || selectedToppings.length > 0;

  const basePrice = selectedSize === "large" ? 34.99 : 27.99;
  const buttercreamPrice = selectedButtercream === "full" ? 2.00 : 0;
  const totalPrice = basePrice + buttercreamPrice;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white/95 backdrop-blur-sm border-b border-[#F8AFC8]/30 shadow-sm px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-[#F8AFC8]/20">
            <Cake className="w-5 h-5 text-[#F8AFC8]" />
          </div>
          <div className="flex-1 min-w-0">
            {hasSelection ? (
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-[#3D2B1F] truncate">
                  {selectedFlavour ? getFlavourName(selectedFlavour) : "No flavour selected"}
                </p>
                <p className="text-xs text-[#3D2B1F]/60 truncate">
                  {selectedSize === "small" ? "Small" : "Large"}
                  {selectedButtercream !== "none" && ` · ${selectedButtercream === "full" ? "Full" : "Small"} buttercream`}
                  {selectedSauces.length > 0 && ` · ${selectedSauces.length} sauce${selectedSauces.length > 1 ? 's' : ''}`}
                  {selectedToppings.length > 0 && ` · ${selectedToppings.length} topping${selectedToppings.length > 1 ? 's' : ''}`}
                </p>
              </div>
            ) : (
              <p className="text-sm text-[#3D2B1F]/60">
                Build your gelato cake below
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="text-lg font-bold text-[#F8AFC8]">{'\u00A3'}{totalPrice.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
