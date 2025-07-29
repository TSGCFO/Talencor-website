import { Helmet } from "react-helmet-async";
import { Award, Users, Target, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import StatisticsSection from "@/components/statistics-section";
import { SEO_CONFIG, generateMetaTags, generateBreadcrumbStructuredData } from "@/lib/seo";

export default function About() {
  const seoData = generateMetaTags({
    title: "About Talencor Staffing | Professional Employment Solutions Toronto",
    description: "Learn about Talencor Staffing's Profile-Matching System and Team Leader Program. Professional staffing solutions in Toronto and GTA with a focus on quality selection and 24/7 support.",
    keywords: [
      "about Talencor Staffing", "staffing company Toronto", "employment agency history", 
      "Profile-Matching System", "Team Leader Program", "professional staffing GTA",
      "We Believe philosophy", "staffing expertise Toronto", "employment solutions"
    ],
    canonical: "/about"
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" }
  ]);

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="robots" content={seoData.robots} />
        <link rel="canonical" href={seoData.canonical} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={seoData.ogTitle} />
        <meta property="og:description" content={seoData.ogDescription} />
        <meta property="og:type" content={seoData.ogType} />
        <meta property="og:url" content={seoData.ogUrl} />
        <meta property="og:site_name" content={SEO_CONFIG.siteName} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content={seoData.twitterCard} />
        <meta name="twitter:title" content={seoData.twitterTitle} />
        <meta name="twitter:description" content={seoData.twitterDescription} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy to-corporate-blue text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat mb-4 sm:mb-6">
            About <span className="text-talencor-gold">Talencor</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Building everlasting relationships through quality staffing solutions. Our client success starts with the right people.
          </p>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center mb-16">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern corporate office building" 
                className="rounded-2xl shadow-xl mb-8 lg:mb-0"
              />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat text-navy mb-4 sm:mb-6">We Believe!</h2>
              <p className="text-lg text-charcoal mb-6 leading-relaxed">
                Talencor Staffing strongly believes in the philosophy in which lasting client relations rest on the quality of the personnel placed within your organization and the service you receive. We acknowledge that doing it correctly the first time is critical to ensure ongoing satisfaction.
              </p>
              <p className="text-lg text-charcoal mb-8 leading-relaxed">
                Talencor Staffing is a dedicated company our customers can trust and rely on. Tapping into our resources goes beyond finding the correct employee to complete the job; it enables our clients to effectively save both time and cost allowing them to focus on what really matters – business itself.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-light-grey">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold font-montserrat text-navy mb-3">Our Approach</h4>
                    <ul className="text-charcoal space-y-2">
                      <li>• Profile-Matching System</li>
                      <li>• Quality Selection Process</li>
                      <li>• Team Leader Program</li>
                      <li>• 24/7 Support Hotline</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-light-grey">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold font-montserrat text-navy mb-3">What We Manage</h4>
                    <ul className="text-charcoal space-y-2">
                      <li>• All Administration & Costs</li>
                      <li>• Recruitment & Training</li>
                      <li>• Payroll & Labour Relations</li>
                      <li>• Less Paperwork & Headaches</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatisticsSection />

      {/* Our Approach */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Profile-Matching System
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              With the implementation of our client-profile matching system our goal is to maintain our quality to you at exceptional levels
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-t-talencor-gold">
              <CardContent className="p-8">
                <div className="text-talencor-gold mb-4 flex justify-center">
                  <Users size={48} />
                </div>
                <h3 className="text-xl font-bold font-montserrat text-navy mb-4">Client Profiling</h3>
                <p className="text-charcoal leading-relaxed">
                  Talencor creates an employer-profile for each of our clients to ensure the ideal match between the employee and employer. By qualifying the job requirements we are able to provide the greatest level of satisfaction.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-t-talencor-orange">
              <CardContent className="p-8">
                <div className="text-talencor-orange mb-4 flex justify-center">
                  <Award size={48} />
                </div>
                <h3 className="text-xl font-bold font-montserrat text-navy mb-4">Selection Process</h3>
                <p className="text-charcoal leading-relaxed">
                  All our applicants must undertake general skill examination, along with specific tests for certain positions before they are able to become a member of the Talencor team. We confirm our talent will deliver quality services.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-t-navy">
              <CardContent className="p-8">
                <div className="text-navy mb-4 flex justify-center">
                  <Target size={48} />
                </div>
                <h3 className="text-xl font-bold font-montserrat text-navy mb-4">Team Leader Program</h3>
                <p className="text-charcoal leading-relaxed">
                  When more than 10 employees work on any single shift at the same company location, we select one team member as a Team Leader. Our Team Leaders are motivated and rewarded premium rates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Why Choose Talencor?
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Professional team collaboration" 
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <div className="space-y-8">
                {[
                  {
                    title: "Proven Track Record",
                    description: "15+ years of successful placements across multiple industries with consistently high client satisfaction rates."
                  },
                  {
                    title: "Personalized Service",
                    description: "We believe in building relationships, not just filling positions. Every client receives dedicated, personalized attention."
                  },
                  {
                    title: "Industry Expertise",
                    description: "Our specialized recruiters have deep knowledge of their respective industries and market trends."
                  },
                  {
                    title: "Quality Guarantee",
                    description: "We stand behind our placements with comprehensive guarantees and ongoing support."
                  }
                ].map((advantage, index) => (
                  <div key={index}>
                    <h3 className="text-2xl font-bold font-montserrat text-navy mb-3">{advantage.title}</h3>
                    <p className="text-lg text-charcoal leading-relaxed">{advantage.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">
            Ready to Experience the Talencor Difference?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let us show you how our expertise and commitment can help you achieve your goals
          </p>
          <Link href="/contact">
            <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
