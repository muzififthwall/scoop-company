'use client';

import { Card } from "./ui/card";
import { Check } from "lucide-react";

const tickets = [
  {
    type: "👧 Kids",
    price: "£10",
    includes: "Any dessert + any drink",
    features: [
      "Full dessert menu access",
      "All drinks included",
      "Perfect for children",
      "Sweet movie experience"
    ],
    color: "#F8AFC8"
  },
  {
    type: "🧑 Adults",
    price: "£5",
    includes: "Any drink",
    features: [
      "All hot & cold drinks",
      "Coffee, tea, sodas",
      "Hot chocolate included",
      "Great for lighter option"
    ],
    color: "#FF8C42"
  },
  {
    type: "🧑 Adults (Full Treat)",
    price: "£10",
    includes: "Any dessert + any drink",
    features: [
      "Full dessert menu access",
      "All drinks included",
      "Complete experience",
      "Best value option"
    ],
    color: "#F38DB5",
    popular: true
  }
];

export function PricingSection() {
  const scrollToTickets = () => {
    document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF5F0 100%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
              Pricing & Details
            </h2>
            <p className="text-xl" style={{ color: '#717182' }}>
              Choose the perfect ticket for your night
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {tickets.map((ticket, index) => (
              <Card
                key={index}
                className={`relative p-6 bg-white border-2 transition-all hover:shadow-2xl cursor-pointer ${
                  ticket.popular ? 'border-[#F38DB5] shadow-xl scale-105' : 'border-transparent hover:border-[#F8AFC8]'
                }`}
                onClick={scrollToTickets}
              >
                {ticket.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm" style={{ background: '#F38DB5', color: 'white', fontWeight: 600 }}>
                    Most Popular
                  </div>
                )}

                <div className="text-center space-y-4">
                  <div className="text-3xl">{ticket.type.split(' ')[0]}</div>

                  <h3 className="text-xl" style={{ fontWeight: 700, color: '#1F1B24' }}>
                    {ticket.type}
                  </h3>

                  <div className="py-4">
                    <div className="text-5xl" style={{ fontWeight: 800, color: ticket.color }}>
                      {ticket.price}
                    </div>
                    <p className="mt-2" style={{ color: '#717182' }}>
                      per person
                    </p>
                  </div>

                  <div className="p-3 rounded-lg" style={{ background: `${ticket.color}15` }}>
                    <p style={{ fontWeight: 600, color: '#1F1B24' }}>
                      {ticket.includes}
                    </p>
                  </div>

                  <div className="pt-4 space-y-3 text-left">
                    {ticket.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-2">
                        <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: ticket.color }} />
                        <span style={{ color: '#717182' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Event Details */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="p-6 bg-white/80 backdrop-blur-sm text-center">
              <div className="text-3xl mb-2">🗓</div>
              <h4 style={{ fontWeight: 700, color: '#1F1B24' }}>When</h4>
              <p style={{ color: '#717182' }}>Mon 27th – Fri 31st Oct</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm text-center">
              <div className="text-3xl mb-2">📍</div>
              <h4 style={{ fontWeight: 700, color: '#1F1B24' }}>Where</h4>
              <p style={{ color: '#717182' }}>The Scoop Company, Warlingham</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm text-center">
              <div className="text-3xl mb-2">🕕</div>
              <h4 style={{ fontWeight: 700, color: '#1F1B24' }}>Time</h4>
              <p style={{ color: '#717182' }}>Seating 4:45PM · Film starts 5:00PM</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
