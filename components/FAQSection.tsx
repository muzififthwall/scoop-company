import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const faqs = [
  {
    question: "Can I bring kids?",
    answer: "Yes! We made this for families. Our movies are Halloween classics that everyone will enjoy."
  },
  {
    question: "What's included for adults?",
    answer: "Pick your ticket: drink-only (£5) or full treat with dessert + drink (£10)."
  },
  {
    question: "Can I pick my dessert now?",
    answer: "Nope, choose on the night. Your ticket gives you access to any item from our menu when you arrive."
  },
  {
    question: "What about refunds?",
    answer: "Life happens. We'll happily move you to another night if you can't make it. Just let us know in advance!"
  },
  {
    question: "How long is each movie night?",
    answer: "Each session runs approximately 90-120 minutes including the movie and dessert service. Perfect for a cosy family evening!"
  },
  {
    question: "Do you have dietary options?",
    answer: "Yes! We have dairy-free gelato, sorbets, and various drink options to accommodate different dietary needs."
  }
];

export function FAQSection() {
  return (
    <section className="py-20 bg-[#FFFBF8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl mt-4" style={{ color: '#717182' }}>
              Everything you need to know 🎃
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border-2 border-transparent hover:border-[#F8AFC8] rounded-xl px-6 shadow-sm hover:shadow-md transition-all"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span style={{ fontWeight: 600, color: '#1F1B24' }}>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6" style={{ color: '#717182' }}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Still have questions */}
          <div className="mt-12 text-center p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF5F0 100%)' }}>
            <p className="text-lg" style={{ color: '#1F1B24' }}>
              Still have questions? <a href="https://www.instagram.com/thescoopcompany_/" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ fontWeight: 600, color: '#F8AFC8' }}>DM us on Instagram!</a> 📱
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
