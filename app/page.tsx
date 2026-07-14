import { GelatoCakeSection } from "@/components/GelatoCakeSection";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { PricingSection } from "@/components/PricingSection";
import { EventDetailsSection } from "@/components/EventDetailsSection";
import { MenuHighlightsSection } from "@/components/MenuHighlightsSection";
import { TicketFormSection } from "@/components/TicketFormSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <GelatoCakeSection />
      <HeroSection />
      <AboutSection />
      <PricingSection />
      <TicketFormSection />
      <MenuHighlightsSection />
      <EventDetailsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
