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
  title: "Kids Cinema Nights at The Scoop Company",
  description:
    "After-school films, sweet treats and cosy vibes. Kids Cinema Nights are back this winter. Register your interest to hear first when tickets go on sale.",
};

export default function Cinema() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* Out of season there is nothing showing, so the film listings are hidden
          and the page opens on How It Works. Both come back with the dates. */}
      {!CINEMA_INTEREST_MODE && <AboutSection />}
      <PricingSection />
      {CINEMA_INTEREST_MODE ? <RegisterInterestSection /> : <TicketFormSection />}
      <MenuHighlightsSection />
      <EventDetailsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
