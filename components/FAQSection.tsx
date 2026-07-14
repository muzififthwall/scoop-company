import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { CINEMA_INTEREST_MODE } from "@/lib/cinema-mode";

const faqs = [
  ...(CINEMA_INTEREST_MODE
    ? [
        {
          question: "When are the cinema nights coming back?",
          answer:
            "This winter. We run them when the nights are dark and cold, so there is nothing on over the summer. We are working out the dates now."
        },
        {
          question: "Can I buy a ticket now?",
          answer:
            "Not yet. Tickets go on sale once the winter dates are confirmed. Register your interest and we will email you first, before we announce anything else."
        },
        {
          question: "Which films will be showing?",
          answer:
            "All your winter faves. We pick the line-up closer to the time and announce it with the dates."
        }
      ]
    : []),
  {
    question: "Are kids welcome?",
    answer: "Yes. These cinema nights are made for children and families."
  },
  {
    question: "What time should we arrive?",
    answer:
      "Please arrive 10 to 15 minutes before the film starts, so everyone is settled in good time. Start times go out with the dates."
  },
  {
    question: "Can parents stay with their children?",
    answer:
      "Of course. Parents and carers are welcome to stay and watch. Kids aged 13 and over can be left with us if they are happy to watch on their own."
  },
  {
    question: "What's included in the ticket?",
    answer: "Each ticket includes a dessert and a drink, chosen on the day."
  },
  {
    question: "Is there parking nearby?",
    answer: "Yes, there is free parking close by. You will find us at 369 Limpsfield Road, Warlingham."
  }
];

export function FAQSection() {
  return (
    <section className="py-20 bg-[#FFFBF8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
              💬 Frequently Asked Questions
            </h2>
            <p className="text-xl mt-4" style={{ color: '#5C5C6B' }}>
              {CINEMA_INTEREST_MODE ? 'The questions we get asked most while we are off season.' : 'Everything you need to know'}
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
                <AccordionContent className="pb-6" style={{ color: '#5C5C6B' }}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Still have questions */}
          <div className="mt-12 text-center p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF5F0 100%)' }}>
            <p className="text-lg" style={{ color: '#1F1B24' }}>
              Still have questions? <a href="https://www.instagram.com/thescoopcompany_/" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ fontWeight: 600, color: '#D4526E' }}>DM us on Instagram!</a> 📱
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
