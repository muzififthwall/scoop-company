import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const faqs = [
  {
    question: "Can we bring babies?",
    answer: "Absolutely! Babies under 1 are more than welcome — there's no ticket needed for them. We just ask that they stay seated with you during the movie so everyone can enjoy the festive fun. 👶✨"
  },
  {
    question: "Can Children come on their own?",
    answer: "Yes! Children aged 13 and over are welcome to attend on their own."
  },
  {
    question: "Can kids sit with parents?",
    answer: "Kids sit at the front, and parents just behind. This helps us maximise space and make sure the little ones have a clear view of the screen."
  },
  {
    question: "Can I pick my dessert in advance?",
    answer: "Yes, please! Check out our menu which you will receive in your email confirmation and decide before you arrive to help our team serve you faster."
  },
  {
    question: "Do I need to print my ticket?",
    answer: "Nope! Just give your name at the counter when you arrive — we'll have your booking ready."
  },
  {
    question: "Can I change or cancel my booking?",
    answer: "If you need to make any changes, please contact us at least 24 hours before your movie night."
  },
  {
    question: "Do babies or toddlers need tickets?",
    answer: "Only children aged 1 and over need a ticket. Babies under 1 are free."
  },
  {
    question: "Can I arrive late?",
    answer: "Please try to arrive on time — we can't guarantee seating once the movie has started."
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
              Everything you need to know 🎄
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
