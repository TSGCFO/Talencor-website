import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { generateFAQStructuredData } from "@/lib/seo";

interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

const STAFFING_FAQS: FAQ[] = [
  {
    question: "What is a staffing agency and how does it work?",
    answer: "A staffing agency is a professional service that connects qualified job seekers with employers looking to fill temporary, permanent, or contract positions. We handle recruitment, screening, training, and placement of candidates, managing all administrative tasks including payroll and benefits.",
    category: "general"
  },
  {
    question: "How much does it cost to use Talencor Staffing services?",
    answer: "Our pricing is competitive and transparent. For temporary staffing, we charge a markup on the employee's hourly rate. For permanent placements, we use a success-based fee structure. Contact us for a free consultation and customized quote based on your specific needs.",
    category: "pricing"
  },
  {
    question: "How quickly can you provide temporary staff?",
    answer: "We can typically provide qualified temporary staff within 24-48 hours for most positions. Our extensive pool of pre-screened candidates and Profile-Matching System allows us to respond quickly to urgent staffing needs while maintaining quality standards.",
    category: "timing"
  },
  {
    question: "What industries does Talencor Staffing serve in Toronto and GTA?",
    answer: "We specialize in multiple industries including manufacturing, warehouse and logistics, construction, administrative and office, healthcare support, hospitality, technical trades, and general labor. Our team has deep expertise across these sectors.",
    category: "industries"
  },
  {
    question: "Do you provide training and certification for employees?",
    answer: "Yes, we offer comprehensive training programs including free WHMIS certification, workplace safety training, and job-specific skills development. All our placed employees receive training to ensure they meet your specific requirements and industry standards.",
    category: "training"
  },
  {
    question: "What is your candidate screening process?",
    answer: "Our rigorous screening process includes background checks, skills assessments, reference verification, and interviews. We use our Profile-Matching System to ensure candidates fit both your technical requirements and company culture.",
    category: "screening"
  },
  {
    question: "Can temporary employees become permanent?",
    answer: "Absolutely! We encourage temp-to-perm transitions. 85% of our temporary placements who are offered permanent positions accept and succeed long-term. This allows you to evaluate candidates before making a permanent commitment.",
    category: "permanent"
  },
  {
    question: "What areas in the GTA do you serve?",
    answer: "We serve the entire Greater Toronto Area including Toronto, Mississauga, Brampton, Markham, Vaughan, Richmond Hill, Oakville, Burlington, Hamilton, and surrounding areas. Our office is located in Mississauga's Airport Business Complex.",
    category: "location"
  },
  {
    question: "What is WHMIS training and why is it important?",
    answer: "WHMIS (Workplace Hazardous Materials Information System) is mandatory training for employees who work with or around hazardous materials. It teaches workers to identify hazards, understand safety data sheets, and maintain a safe work environment. We provide free WHMIS certification through our training partner.",
    category: "safety"
  },
  {
    question: "How do you ensure payroll compliance and accuracy?",
    answer: "We handle all payroll processing, tax deductions, CRA remittances, vacation pay, sick leave, and employment standards compliance. Our experienced team ensures accurate, timely payments while maintaining full regulatory compliance.",
    category: "payroll"
  }
];

interface FAQSectionProps {
  category?: string;
  maxItems?: number;
  showStructuredData?: boolean;
}

export default function FAQSection({ 
  category, 
  maxItems = 10, 
  showStructuredData = true 
}: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const filteredFAQs = category 
    ? STAFFING_FAQS.filter(faq => faq.category === category)
    : STAFFING_FAQS;

  const displayFAQs = filteredFAQs.slice(0, maxItems);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqStructuredData = showStructuredData ? generateFAQStructuredData(
    displayFAQs.map(faq => ({
      question: faq.question,
      answer: faq.answer
    }))
  ) : null;

  return (
    <>
      {showStructuredData && faqStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      )}
      
      <section className="py-20 bg-light-grey">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Frequently Asked <span className="text-talencor-gold">Questions</span>
            </h2>
            <p className="text-xl text-charcoal max-w-2xl mx-auto leading-relaxed">
              Find answers to common questions about our staffing services, processes, and solutions.
            </p>
          </div>

          <div className="space-y-4">
            {displayFAQs.map((faq, index) => (
              <Card 
                key={index} 
                className="border border-gray-200 hover:shadow-md transition-shadow"
                itemScope 
                itemType="https://schema.org/Question"
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    aria-expanded={openItems.has(index)}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <h3 
                      className="text-lg font-semibold text-navy pr-4 font-montserrat"
                      itemProp="name"
                    >
                      {faq.question}
                    </h3>
                    {openItems.has(index) ? (
                      <ChevronUp className="text-talencor-gold flex-shrink-0" size={24} />
                    ) : (
                      <ChevronDown className="text-talencor-gold flex-shrink-0" size={24} />
                    )}
                  </button>
                  
                  {openItems.has(index) && (
                    <div 
                      id={`faq-answer-${index}`}
                      className="px-6 pb-5"
                      itemScope
                      itemType="https://schema.org/Answer"
                    >
                      <div 
                        className="text-charcoal leading-relaxed border-t border-gray-100 pt-4"
                        itemProp="text"
                      >
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-charcoal mb-4">
              Have a question not answered here?
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 bg-talencor-gold hover:bg-talencor-orange text-white font-semibold rounded-md transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}