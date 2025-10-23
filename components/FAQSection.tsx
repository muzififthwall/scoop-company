import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const faqs = [
  {
    question: "Is it kid-friendly?",
    answer: "Absolutely — we keep it cute, not creepy. All our movies are family-friendly Halloween classics perfect for all ages!"
  },
  {
    question: "Do I pick my dessert now?",
    answer: "Nope, choose on the night! Your ticket includes ANY dessert from our full menu, so you can decide when you arrive."
  },
  {
    question: "What drinks are included?",
    answer: "Any drink from our menu! From artisan coffee to hot chocolate, smoothies to sodas — it's all included in your ticket."
  },
  {
    question: "Can I bring my own snacks?",
    answer: "We'd prefer you didn't — but with unlimited gelato and drinks included, you won't need to! 🍦"
  },
  {
    question: "How long is each movie night?",
    answer: "Each session runs approximately 90-120 minutes including the movie and dessert service. Perfect for a cosy evening!"
  },
  {
    question: "Do you have dairy-free options?",
    answer: "Yes! We have a selection of delicious dairy-free gelato and sorbet options available."
  }
];

export function FAQSection() {
  return (
    <section className="py-20 bg-[#FFFBF8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#030213' }}>
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
                  <span style={{ fontWeight: 600, color: '#030213' }}>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6" style={{ color: '#717182' }}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Still have questions */}
          <div className="mt-12 text-center p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF5F0 100%)' }}>
            <p className="text-lg" style={{ color: '#030213' }}>
              Still have questions? <span style={{ fontWeight: 600, color: '#F8AFC8' }}>DM us on Instagram!</span> 📱
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
