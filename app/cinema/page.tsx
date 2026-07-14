import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { PricingSection } from "@/components/PricingSection";
import { EventDetailsSection } from "@/components/EventDetailsSection";
import { MenuHighlightsSection } from "@/components/MenuHighlightsSection";
import { TicketFormSection } from "@/components/TicketFormSection";
import { RegisterInterestSection } from "@/components/RegisterInterestSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { CINEMA_INTEREST_MODE } from "@/lib/cinema-mode";

export const metadata: Metadata = {
  title: "Kids Cinema Nights — The Scoop Company",
  description:
    "After-school films, sweet treats and cosy vibes. Kids Cinema Nights return this winter — register your interest to hear first when tickets go on sale.",
};

export default function Cinema() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <PricingSection />
      {/* Winter-only event: collect interest out of season, sell tickets in it.
          Toggle CINEMA_INTEREST_MODE in lib/interest.ts to switch. */}
      {CINEMA_INTEREST_MODE ? <RegisterInterestSection /> : <TicketFormSection />}
      <MenuHighlightsSection />
      <EventDetailsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
