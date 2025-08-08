import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Users, Target, CheckCircle, Clock } from "lucide-react";
import { SEOHelmet } from "@/components/seo-helmet";
import { generateRichSnippetData, VOICE_SEARCH_OPTIMIZATION } from "@/lib/seo-comprehensive";

export default function RecruitingService() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Recruiting", url: "/services/recruiting" }
  ];

  const serviceStructuredData = generateRichSnippetData('Service', {
    name: "Professional Recruiting Services",
    description: "Expert recruiting services providing qualified candidates for businesses in Toronto and GTA",
    serviceType: "Recruiting and Talent Acquisition",
    areaServed: "Greater Toronto Area",
    offers: {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "CAD",
      "priceRange": "$$"
    }
  });

  const faqData = {
    questions: [
      {
        id: 1,
        question: "How quickly can Talencor provide qualified candidates?",
        answer: "We can typically provide pre-screened qualified candidates within 24-48 hours for most positions, thanks to our extensive talent pool and efficient Profile-Matching System.",
        upvotes: 52
      },
      {
        id: 2,
        question: "What is your candidate screening process?",
        answer: "Our comprehensive screening includes skills assessment, background checks, reference verification, personality matching, and industry-specific testing to ensure the perfect fit for your company.",
        upvotes: 45
      },
      {
        id: 3,
        question: "Do you offer replacement guarantees?",
        answer: "Yes, we offer replacement guarantees for all placements. If a candidate doesn't work out, we'll quickly provide a suitable replacement at no additional cost.",
        upvotes: 38
      }
    ]
  };

  const howToData = {
    title: "How to Get Started with Talencor Recruiting Services",
    description: "Simple steps to find the perfect candidates for your business",
    totalTime: "PT48H",
    cost: { currency: "CAD", value: "0" },
    steps: [
      { name: "Contact Us", text: "Call (647) 946-2177 or fill out our online form to discuss your staffing needs" },
      { name: "Define Requirements", text: "Our team works with you to understand your specific position requirements and company culture" },
      { name: "Candidate Matching", text: "We use our Profile-Matching System to identify the best candidates from our pre-screened talent pool" },
      { name: "Review & Interview", text: "We present qualified candidates for your review and arrange interviews at your convenience" },
      { name: "Onboarding", text: "Once you select a candidate, we handle all paperwork and ensure smooth onboarding" }
    ]
  };

  return (
    <>
      <SEOHelmet
        title="Professional Recruiting Services Toronto & GTA - Talencor Staffing"
        description="Expert recruiting services providing qualified candidates within 24-48 hours. Comprehensive screening, Profile-Matching System, and replacement guarantees. Find the right talent for manufacturing, warehouse, administrative, and more positions in Toronto and GTA."
        keywords={[
          "recruiting services Toronto", "staffing solutions GTA", "talent acquisition",
          "professional recruitment", "workforce solutions", "employee placement",
          "temporary staffing Toronto", "permanent placement GTA", "industrial recruiting",
          "warehouse staffing", "manufacturing recruitment", "office staffing Toronto",
          "skilled trades recruitment", "construction staffing", "healthcare staffing",
          ...VOICE_SEARCH_OPTIMIZATION.conversationalKeywords
        ]}
        canonical="/services/recruiting"
        breadcrumbs={breadcrumbs}
        structuredData={[serviceStructuredData]}
        faq={faqData}
        howTo={howToData}
        prefetch={['/contact', '/apply']}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-navy to-corporate-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold font-montserrat mb-6">
              Professional <span className="text-talencor-gold">Recruiting</span> Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Our staffing operations team continuously recruits new talent to join your team, providing the right people the first time
            </p>
            <Link href="/contact">
              <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold font-montserrat text-navy mb-6">
                Why Choose Our Recruiting Services?
              </h2>
              <p className="text-lg text-charcoal mb-6 leading-relaxed">
                At Talencor Staffing, we understand that finding the right talent is crucial to your business success. 
                Our experienced recruiting team uses proven methodologies and extensive networks to identify, screen, 
                and deliver qualified candidates who fit your specific needs and company culture.
              </p>
              <p className="text-lg text-charcoal leading-relaxed">
                We take pride in our Profile-Matching System that ensures every candidate we present meets your 
                requirements and has the potential to contribute meaningfully to your organization.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-t-4 border-t-talencor-gold">
                <CardContent className="p-6 text-center">
                  <Target className="text-talencor-gold mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Targeted Approach</h3>
                  <p className="text-sm text-charcoal">Precise candidate matching</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-talencor-orange">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="text-talencor-orange mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Quality Assured</h3>
                  <p className="text-sm text-charcoal">Thoroughly screened talent</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-navy">
                <CardContent className="p-6 text-center">
                  <Clock className="text-navy mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Fast Turnaround</h3>
                  <p className="text-sm text-charcoal">Quick placement process</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-talencor-gold">
                <CardContent className="p-6 text-center">
                  <Users className="text-talencor-gold mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Diverse Pool</h3>
                  <p className="text-sm text-charcoal">Extensive talent network</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 bg-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Our Recruiting <span className="text-talencor-gold">Process</span>
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              A systematic approach to finding the perfect candidates for your organization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-talencor-gold text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-navy mb-4">Understanding Your Needs</h3>
              <p className="text-charcoal leading-relaxed">
                We conduct thorough consultations to understand your specific requirements, company culture, 
                and the ideal candidate profile for your position.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-talencor-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-navy mb-4">Sourcing & Screening</h3>
              <p className="text-charcoal leading-relaxed">
                Our team leverages extensive networks and databases to source candidates, followed by 
                rigorous screening processes including interviews and background checks.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-navy text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-navy mb-4">Candidate Presentation</h3>
              <p className="text-charcoal leading-relaxed">
                We present only the most qualified candidates with detailed profiles, ensuring each 
                recommendation aligns with your specific needs and expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Industries We <span className="text-talencor-gold">Serve</span>
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              Our recruiting expertise spans across multiple industries and sectors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Manufacturing & Industrial",
              "Warehouse & Logistics",
              "Construction & Trades",
              "Administrative & Office",
              "Healthcare Support",
              "Hospitality & Service",
              "Technical & Skilled Labor",
              "General Labor"
            ].map((industry, index) => (
              <Card key={industry} className="hover:shadow-lg transition-shadow border-l-4 border-l-talencor-gold">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold font-montserrat text-navy mb-2">{industry}</h3>
                  <p className="text-sm text-charcoal">
                    Specialized recruiting for {industry.toLowerCase()} positions
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">
            Ready to Find Your Next Great Hire?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let our experienced recruiting team help you find the perfect candidates for your organization
          </p>
          <Link href="/contact">
            <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
              Start Your Search Today
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}