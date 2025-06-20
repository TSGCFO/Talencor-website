import { Helmet } from "react-helmet-async";
import { Users, Clock, Handshake, Search, GraduationCap, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SERVICES } from "@/lib/constants";

const iconMap = {
  Users,
  Clock,
  Handshake,
  Search,
  GraduationCap,
  TrendingUp,
};

export default function Services() {
  return (
    <>
      <Helmet>
        <title>Professional Staffing Services | Talencor Staffing Solutions</title>
        <meta 
          name="description" 
          content="Comprehensive staffing services including permanent placement, temporary staffing, contract-to-hire, executive search, training programs, and workforce consulting." 
        />
        <meta property="og:title" content="Professional Staffing Services | Talencor" />
        <meta property="og:description" content="Comprehensive staffing services for businesses and job seekers across Canada." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy to-corporate-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat mb-6">
            Our <span className="text-energetic-orange">Services</span>
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
              const borderColors = ["border-corporate-blue", "border-energetic-orange", "border-navy"];
              const iconColors = ["text-corporate-blue", "text-energetic-orange", "text-navy"];
              
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
                    <Link href="/contact">
                      <span className="text-corporate-blue hover:text-navy font-semibold font-montserrat cursor-pointer inline-flex items-center">
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

      {/* Why Choose Us */}
      <section className="py-20 bg-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">Why Choose Talencor?</h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              Our commitment to excellence and personalized service sets us apart in the staffing industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Industry Expertise",
                description: "Deep knowledge across multiple industries including IT, healthcare, finance, and manufacturing",
                stat: "15+ Years"
              },
              {
                title: "Proven Results",
                description: "Track record of successful placements with high retention rates and client satisfaction",
                stat: "5000+ Placements"
              },
              {
                title: "Personalized Service",
                description: "Dedicated account managers who understand your unique needs and business culture",
                stat: "95% Satisfaction"
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center p-8">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold font-montserrat text-energetic-orange mb-4">
                    {feature.stat}
                  </div>
                  <h3 className="text-xl font-bold font-montserrat text-navy mb-4">{feature.title}</h3>
                  <p className="text-charcoal leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-corporate-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today to discuss how we can help you achieve your staffing goals
          </p>
          <Link href="/contact">
            <Button className="bg-energetic-orange hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
