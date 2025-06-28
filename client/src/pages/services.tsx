import { Helmet } from "react-helmet-async";
import { Users, Clock, Handshake, Search, GraduationCap, TrendingUp, ArrowRight, Calculator, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SERVICES, JOB_POSITIONS } from "@/lib/constants";
import BenefitsSection from "@/components/benefits-section";
import { SEO_CONFIG, generateMetaTags, generateBreadcrumbStructuredData } from "@/lib/seo";

const iconMap = {
  Users,
  Clock,
  Handshake,
  Search,
  GraduationCap,
  TrendingUp,
  Calculator,
  Building,
};

export default function Services() {
  const seoData = generateMetaTags({
    title: "Professional Staffing Services | Toronto & GTA",
    description: "Comprehensive staffing services including recruiting, training, payroll administration, labour relations, permanent placements, and consulting in Toronto and GTA.",
    keywords: [
      "staffing services Toronto", "recruiting services GTA", "employee training", "payroll services", 
      "labour relations", "permanent placement", "workforce consulting", "temporary staffing",
      "WHMIS certification", "HR services Toronto", "employment agency GTA"
    ],
    canonical: "/services"
  });

  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" }
  ]);

  const servicesStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Staffing Services",
    "itemListElement": SERVICES.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": service.title,
        "description": service.description,
        "url": `${SEO_CONFIG.siteUrl}/services/${service.id}`,
        "provider": {
          "@type": "Organization",
          "name": SEO_CONFIG.businessName
        }
      }
    }))
  };

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
        <script type="application/ld+json">
          {JSON.stringify(servicesStructuredData)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy to-charcoal text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat mb-6">
            Our <span className="text-talencor-gold">Services</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Comprehensive staffing solutions designed to meet the unique needs of modern businesses and career-focused professionals
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap];
              const borderColors = ["border-talencor-gold", "border-talencor-orange", "border-navy"];
              const iconColors = ["text-talencor-gold", "text-talencor-orange", "text-navy"];
              
              return (
                <Card 
                  key={service.id}
                  className={`hover:shadow-xl transition-shadow border-t-4 ${borderColors[index % 3]}`}
                >
                  <CardContent className="p-8">
                    <div className={`mb-4 ${iconColors[index % 3]}`}>
                      <IconComponent size={48} />
                    </div>
                    <h3 className="text-2xl font-bold font-montserrat text-navy mb-4">{service.title}</h3>
                    <p className="text-charcoal mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <Link href={`/services/${service.id}`}>
                      <span className="text-talencor-gold hover:text-talencor-orange font-semibold font-montserrat cursor-pointer inline-flex items-center">
                        Learn More <ArrowRight size={16} className="ml-1" />
                      </span>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Available Positions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Skilled, Dependable, Ready to <span className="text-talencor-gold">WORK!</span>
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              Talencor are proud of our constantly growing pool of skilled workers who can eagerly adapt to an extensive variety of tasks. 
              Do you require someone for one-day? An extensive project? Our clients depend on us for both!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {JOB_POSITIONS.map((position, index) => (
              <Card 
                key={position}
                className="hover:shadow-lg transition-shadow border-l-4 border-l-talencor-gold"
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold font-montserrat text-navy mb-2">{position}</h3>
                  <p className="text-sm text-charcoal">
                    Professional, screened candidates ready for immediate placement
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-charcoal mb-6">
              We encourage you to draw from our pool of talent should you want to hire someone permanently.
            </p>
            <Link href="/contact">
              <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
                View Available Candidates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* WHMIS Training Section */}
      <section className="py-20 bg-gradient-to-br from-light-grey to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Free <span className="text-talencor-gold">WHMIS Training</span> & Certification
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed mb-8">
              Workplace Hazardous Materials Information System (WHMIS) training is essential for workplace safety. 
              We provide access to free WHMIS certification to ensure all our employees meet safety requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-t-talencor-gold">
              <CardContent className="p-8">
                <div className="text-talencor-gold mb-4 flex justify-center">
                  <GraduationCap size={48} />
                </div>
                <h3 className="text-xl font-bold font-montserrat text-navy mb-4">Free Certification</h3>
                <p className="text-charcoal leading-relaxed">
                  Access comprehensive WHMIS training and receive your certification at no cost through our training partner.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-t-talencor-orange">
              <CardContent className="p-8">
                <div className="text-talencor-orange mb-4 flex justify-center">
                  <Users size={48} />
                </div>
                <h3 className="text-xl font-bold font-montserrat text-navy mb-4">Workplace Safety</h3>
                <p className="text-charcoal leading-relaxed">
                  Learn to identify hazardous materials, understand safety data sheets, and maintain a safe work environment.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-t-4 border-t-navy">
              <CardContent className="p-8">
                <div className="text-navy mb-4 flex justify-center">
                  <Building size={48} />
                </div>
                <h3 className="text-xl font-bold font-montserrat text-navy mb-4">Compliance Ready</h3>
                <p className="text-charcoal leading-relaxed">
                  Ensure your workplace meets all Canadian safety standards and regulatory requirements.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <a 
              href="https://aixsafety.com/wp-content/uploads/articulate_uploads/WHS-Apr2025Aix/story.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
                Start Free WHMIS Training
              </Button>
            </a>
            <p className="text-sm text-charcoal mt-4">
              Training provided by AIX Safety - Opens in new window
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today to discuss how we can help you achieve your staffing goals
          </p>
          <Link href="/contact">
            <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
