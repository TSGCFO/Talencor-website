import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Handshake, Scale, Users, FileText, MessageCircle, Shield } from "lucide-react";

export default function LabourRelationsService() {
  return (
    <>
      <Helmet>
        <title>Labour & Human Relations Services | Talencor Staffing Solutions</title>
        <meta name="description" content="Professional labour relations consulting and management services for permanent and temporary staff in Toronto and GTA. Expert HR solutions and workplace relations." />
        <meta name="keywords" content="labour relations Toronto, human relations consulting, HR services GTA, workplace relations, employee relations, labour consulting" />
        <link rel="canonical" href="/services/labour-relations" />
        <meta property="og:title" content="Labour & Human Relations Services | Talencor Staffing Solutions" />
        <meta property="og:description" content="Professional labour relations consulting and management services for permanent and temporary staff in Toronto and GTA." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/services/labour-relations" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Labour & Human Relations Services | Talencor Staffing Solutions" />
        <meta name="twitter:description" content="Professional labour relations consulting and management services for permanent and temporary staff in Toronto and GTA." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Labour & Human Relations Services",
            "description": "Professional labour relations consulting and management services for permanent and temporary staff in Toronto and GTA",
            "provider": {
              "@type": "Organization",
              "name": "Talencor Staffing",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "2985 Drew Rd #206, Airport Business Complex",
                "addressLocality": "Mississauga",
                "addressRegion": "ON",
                "addressCountry": "CA"
              },
              "telephone": "(647) 946-2177"
            },
            "serviceType": "Labour Relations and Human Resources Consulting",
            "areaServed": "Greater Toronto Area"
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-navy to-corporate-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold font-montserrat mb-6">
              Labour & Human <span className="text-talencor-gold">Relations</span> Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional labour relations consulting and management services for your permanent and temporary staff
            </p>
            <Link href="/contact">
              <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
                Get HR Solutions
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
                Expert Labour Relations Management
              </h2>
              <p className="text-lg text-charcoal mb-6 leading-relaxed">
                Effective labour relations are crucial for maintaining a productive and harmonious workplace. 
                At Talencor Staffing, our experienced HR professionals provide comprehensive labour relations 
                consulting and management services that protect your interests while fostering positive employee relationships.
              </p>
              <p className="text-lg text-charcoal leading-relaxed">
                Whether you need assistance with policy development, conflict resolution, or compliance management, 
                our team brings the expertise and objectivity necessary to navigate complex workplace situations successfully.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-t-4 border-t-talencor-gold">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="text-talencor-gold mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Conflict Resolution</h3>
                  <p className="text-sm text-charcoal">Mediation & dispute handling</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-talencor-orange">
                <CardContent className="p-6 text-center">
                  <Scale className="text-talencor-orange mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Policy Development</h3>
                  <p className="text-sm text-charcoal">HR policies & procedures</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-navy">
                <CardContent className="p-6 text-center">
                  <Shield className="text-navy mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Compliance</h3>
                  <p className="text-sm text-charcoal">Labour law compliance</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-talencor-gold">
                <CardContent className="p-6 text-center">
                  <Users className="text-talencor-gold mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Employee Relations</h3>
                  <p className="text-sm text-charcoal">Positive workplace culture</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 bg-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Our Labour Relations <span className="text-talencor-gold">Expertise</span>
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              Comprehensive HR services designed to create positive workplace relationships
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Policy Development",
                description: "Creating comprehensive HR policies and procedures that align with your business goals and legal requirements.",
                icon: FileText,
                features: ["Employee handbooks", "Workplace policies", "Code of conduct", "Disciplinary procedures"]
              },
              {
                title: "Conflict Resolution",
                description: "Professional mediation and dispute resolution services to address workplace conflicts effectively.",
                icon: MessageCircle,
                features: ["Workplace mediation", "Grievance handling", "Dispute resolution", "Communication facilitation"]
              },
              {
                title: "Compliance Management",
                description: "Ensuring your workplace practices meet all provincial and federal labour law requirements.",
                icon: Scale,
                features: ["Labour law compliance", "Employment standards", "Human rights compliance", "Regular updates"]
              },
              {
                title: "Employee Relations",
                description: "Building positive relationships between management and staff to foster a productive work environment.",
                icon: Users,
                features: ["Performance management", "Employee engagement", "Communication strategies", "Team building"]
              },
              {
                title: "Risk Management",
                description: "Identifying and mitigating potential HR risks before they impact your business operations.",
                icon: Shield,
                features: ["Risk assessments", "Prevention strategies", "Policy enforcement", "Documentation"]
              },
              {
                title: "Training & Development",
                description: "Educational programs for management and staff on labour relations best practices.",
                icon: Handshake,
                features: ["Management training", "Employee workshops", "Skills development", "Leadership coaching"]
              }
            ].map((service, index) => {
              const IconComponent = service.icon;
              const borderColors = ["border-t-talencor-gold", "border-t-talencor-orange", "border-t-navy"];
              const iconColors = ["text-talencor-gold", "text-talencor-orange", "text-navy"];
              
              return (
                <Card key={service.title} className={`hover:shadow-lg transition-shadow border-t-4 ${borderColors[index % 3]}`}>
                  <CardContent className="p-6">
                    <div className={`mb-4 ${iconColors[index % 3]}`}>
                      <IconComponent size={48} />
                    </div>
                    <h3 className="text-xl font-bold font-montserrat text-navy mb-4">{service.title}</h3>
                    <p className="text-charcoal mb-4 leading-relaxed">{service.description}</p>
                    <ul className="space-y-1">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-charcoal flex items-center">
                          <div className="w-2 h-2 bg-talencor-gold rounded-full mr-2 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Why Choose <span className="text-talencor-gold">Talencor</span> for Labour Relations
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold font-montserrat text-navy mb-6">Our Approach</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-talencor-gold text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy mb-2">Assessment & Analysis</h4>
                    <p className="text-charcoal">We thoroughly assess your current workplace dynamics and identify areas for improvement.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-talencor-orange text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy mb-2">Strategy Development</h4>
                    <p className="text-charcoal">We create customized solutions that address your specific challenges and goals.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-navy text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy mb-2">Implementation Support</h4>
                    <p className="text-charcoal">We provide ongoing support to ensure successful implementation of HR initiatives.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-montserrat text-navy mb-6">Key Benefits</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Handshake className="text-talencor-gold mr-3" size={24} />
                  <span className="text-charcoal">Improved workplace harmony and productivity</span>
                </div>
                <div className="flex items-center">
                  <Shield className="text-talencor-orange mr-3" size={24} />
                  <span className="text-charcoal">Reduced legal risks and compliance issues</span>
                </div>
                <div className="flex items-center">
                  <Users className="text-navy mr-3" size={24} />
                  <span className="text-charcoal">Enhanced employee satisfaction and retention</span>
                </div>
                <div className="flex items-center">
                  <Scale className="text-talencor-gold mr-3" size={24} />
                  <span className="text-charcoal">Fair and consistent HR practices</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="text-talencor-orange mr-3" size={24} />
                  <span className="text-charcoal">Better communication throughout your organization</span>
                </div>
                <div className="flex items-center">
                  <FileText className="text-navy mr-3" size={24} />
                  <span className="text-charcoal">Comprehensive documentation and processes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">
            Ready to Improve Your Workplace Relations?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let our experienced HR professionals help you create a positive and productive work environment
          </p>
          <Link href="/contact">
            <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
              Discuss Your HR Needs
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}