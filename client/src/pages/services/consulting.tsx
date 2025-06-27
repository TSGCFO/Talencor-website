import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { TrendingUp, Users, Target, Lightbulb, BarChart, Cog } from "lucide-react";

export default function ConsultingService() {
  return (
    <>
      <Helmet>
        <title>Workforce Management Consulting | Talencor Staffing Solutions</title>
        <meta name="description" content="Expert workforce management consulting and specialized training services for valued clients in Toronto and GTA. Strategic HR solutions and business optimization." />
        <meta name="keywords" content="workforce consulting Toronto, management consulting GTA, HR consulting, business optimization, workforce strategy, organizational development" />
        <link rel="canonical" href="/services/consulting" />
        <meta property="og:title" content="Workforce Management Consulting | Talencor Staffing Solutions" />
        <meta property="og:description" content="Expert workforce management consulting and specialized training services for valued clients in Toronto and GTA." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/services/consulting" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Workforce Management Consulting | Talencor Staffing Solutions" />
        <meta name="twitter:description" content="Expert workforce management consulting and specialized training services for valued clients in Toronto and GTA." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Workforce Management Consulting",
            "description": "Expert workforce management consulting and specialized training services for businesses in Toronto and GTA",
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
            "serviceType": "Business and Workforce Consulting",
            "areaServed": "Greater Toronto Area"
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-navy to-corporate-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold font-montserrat mb-6">
              Workforce Management <span className="text-talencor-gold">Consulting</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Expert workforce management consulting and specialized training services for valued clients seeking strategic business optimization
            </p>
            <Link href="/contact">
              <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
                Transform Your Workforce
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
                Strategic Workforce Solutions
              </h2>
              <p className="text-lg text-charcoal mb-6 leading-relaxed">
                At Talencor Staffing, we go beyond traditional staffing services to offer comprehensive workforce management consulting. 
                Our experienced consultants work closely with valued clients to analyze, optimize, and transform their workforce strategies 
                for maximum efficiency and profitability.
              </p>
              <p className="text-lg text-charcoal leading-relaxed">
                Whether you're looking to streamline operations, improve productivity, or develop long-term workforce strategies, 
                our consulting services provide the expertise and insights needed to achieve your business objectives.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-t-4 border-t-talencor-gold">
                <CardContent className="p-6 text-center">
                  <Target className="text-talencor-gold mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Strategic Planning</h3>
                  <p className="text-sm text-charcoal">Long-term workforce strategy</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-talencor-orange">
                <CardContent className="p-6 text-center">
                  <BarChart className="text-talencor-orange mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Performance Analysis</h3>
                  <p className="text-sm text-charcoal">Data-driven insights</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-navy">
                <CardContent className="p-6 text-center">
                  <Cog className="text-navy mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Process Optimization</h3>
                  <p className="text-sm text-charcoal">Operational efficiency</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-talencor-gold">
                <CardContent className="p-6 text-center">
                  <Lightbulb className="text-talencor-gold mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Innovation</h3>
                  <p className="text-sm text-charcoal">Creative solutions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Consulting Services */}
      <section className="py-20 bg-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Our Consulting <span className="text-talencor-gold">Expertise</span>
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              Comprehensive consulting services designed to optimize your workforce and drive business success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Workforce Strategy Development",
                description: "Comprehensive analysis and strategic planning to align your workforce with business objectives and growth plans.",
                icon: Target,
                features: ["Strategic workforce planning", "Talent gap analysis", "Succession planning", "Organizational design"]
              },
              {
                title: "Operational Efficiency",
                description: "Process optimization and workflow analysis to maximize productivity and reduce operational costs.",
                icon: Cog,
                features: ["Process mapping", "Workflow optimization", "Cost reduction strategies", "Efficiency metrics"]
              },
              {
                title: "Performance Management",
                description: "Data-driven approaches to measuring, monitoring, and improving workforce performance across your organization.",
                icon: BarChart,
                features: ["KPI development", "Performance analytics", "Benchmarking", "Improvement strategies"]
              },
              {
                title: "Change Management",
                description: "Structured approach to managing organizational changes, ensuring smooth transitions and employee buy-in.",
                icon: Users,
                features: ["Change strategy", "Communication planning", "Training programs", "Resistance management"]
              },
              {
                title: "Specialized Training Programs",
                description: "Custom-designed training solutions to address specific skill gaps and development needs in your organization.",
                icon: Lightbulb,
                features: ["Skills assessment", "Custom curriculum", "Training delivery", "Progress tracking"]
              },
              {
                title: "Business Growth Support",
                description: "Strategic guidance for scaling your workforce efficiently during periods of business growth and expansion.",
                icon: TrendingUp,
                features: ["Scaling strategies", "Resource planning", "Market expansion", "Growth metrics"]
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

      {/* Our Approach */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Our Consulting <span className="text-talencor-gold">Approach</span>
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              A systematic methodology that delivers measurable results and sustainable improvements
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                step: "1",
                title: "Discovery",
                description: "Comprehensive assessment of your current workforce, processes, and challenges"
              },
              {
                step: "2",
                title: "Analysis",
                description: "Data-driven analysis to identify opportunities and develop strategic insights"
              },
              {
                step: "3",
                title: "Strategy",
                description: "Custom strategy development aligned with your business goals and resources"
              },
              {
                step: "4",
                title: "Implementation",
                description: "Structured implementation with clear milestones and progress tracking"
              },
              {
                step: "5",
                title: "Optimization",
                description: "Continuous monitoring and optimization to ensure sustained success"
              }
            ].map((phase, index) => {
              const colors = ["bg-talencor-gold", "bg-talencor-orange", "bg-navy", "bg-talencor-gold", "bg-talencor-orange"];
              
              return (
                <div key={phase.step} className="text-center">
                  <div className={`${colors[index]} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold`}>
                    {phase.step}
                  </div>
                  <h3 className="text-xl font-bold font-montserrat text-navy mb-4">{phase.title}</h3>
                  <p className="text-charcoal leading-relaxed text-sm">
                    {phase.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Consulting <span className="text-talencor-gold">Benefits</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Increased Efficiency",
                description: "Streamlined processes and optimized workflows that reduce waste and improve productivity",
                icon: Cog
              },
              {
                title: "Cost Savings",
                description: "Strategic improvements that reduce operational costs while maintaining or improving quality",
                icon: TrendingUp
              },
              {
                title: "Better Performance",
                description: "Enhanced workforce performance through strategic planning and targeted improvements",
                icon: BarChart
              },
              {
                title: "Competitive Advantage",
                description: "Industry insights and best practices that give you an edge over your competition",
                icon: Target
              },
              {
                title: "Scalable Solutions",
                description: "Strategies designed to grow with your business and adapt to changing market conditions",
                icon: Users
              },
              {
                title: "Expert Knowledge",
                description: "Access to specialized expertise and industry knowledge without the overhead of full-time staff",
                icon: Lightbulb
              },
              {
                title: "Objective Perspective",
                description: "External viewpoint that identifies blind spots and opportunities you might miss internally",
                icon: Target
              },
              {
                title: "Sustainable Results",
                description: "Long-term solutions that create lasting improvements rather than quick fixes",
                icon: TrendingUp
              }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              const borderColors = ["border-t-talencor-gold", "border-t-talencor-orange", "border-t-navy"];
              const iconColors = ["text-talencor-gold", "text-talencor-orange", "text-navy"];
              
              return (
                <Card key={benefit.title} className={`hover:shadow-lg transition-shadow border-t-4 ${borderColors[index % 3]} text-center`}>
                  <CardContent className="p-6">
                    <div className={`mb-4 ${iconColors[index % 3]} flex justify-center`}>
                      <IconComponent size={40} />
                    </div>
                    <h3 className="text-lg font-bold font-montserrat text-navy mb-3">{benefit.title}</h3>
                    <p className="text-charcoal text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">
            Ready to Transform Your Workforce?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let our expert consultants help you optimize your workforce strategy and drive sustainable business growth
          </p>
          <Link href="/contact">
            <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
              Schedule Consultation
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}