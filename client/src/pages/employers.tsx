import { Helmet } from "react-helmet-async";
import { Star, Clock, Shield, Target, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function Employers() {
  return (
    <>
      <Helmet>
        <title>Workforce Solutions for Employers | Talencor Staffing Services</title>
        <meta 
          name="description" 
          content="Professional staffing solutions for employers. Access pre-screened candidates, reduce hiring time, and find the perfect talent for your business needs across Canada." 
        />
        <meta property="og:title" content="Workforce Solutions for Employers | Talencor" />
        <meta property="og:description" content="Professional staffing solutions for employers across Canada." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy to-charcoal text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat mb-6">
                Find Your Perfect <span className="text-talencor-gold">Hire</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                Partner with Talencor to access top talent and streamline your hiring process. Our comprehensive staffing solutions are designed to meet your unique business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold w-full sm:w-auto">
                    Post a Job
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    variant="outline" 
                    className="border-2 border-white hover:bg-white hover:text-navy text-white px-8 py-4 text-lg font-semibold w-full sm:w-auto"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block mt-12 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Professional business handshake" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Why Partner With Us?
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              We understand the challenges of finding the right talent. Our proven process delivers results that make a difference to your bottom line.
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                title: "Pre-Screened Candidates",
                description: "Our rigorous screening process ensures you only meet qualified, motivated candidates who match your specific requirements and company culture.",
                benefits: [
                  "Comprehensive background checks",
                  "Skills and competency assessments",
                  "Cultural fit evaluation",
                  "Reference verification"
                ],
                icon: <Shield size={48} />
              },
              {
                title: "Faster Time-to-Hire",
                description: "Reduce your recruitment time by up to 50% with our efficient hiring process and extensive candidate database.",
                benefits: [
                  "Access to passive candidates",
                  "Streamlined interview process",
                  "Quick turnaround on shortlists",
                  "Dedicated account management"
                ],
                icon: <Clock size={48} />
              },
              {
                title: "Industry Expertise",
                description: "Our specialized knowledge across multiple industries ensures we understand your unique challenges and requirements.",
                benefits: [
                  "Sector-specific recruiters",
                  "Market intelligence and insights",
                  "Salary benchmarking",
                  "Industry best practices"
                ],
                icon: <Target size={48} />
              }
            ].map((section, index) => (
              <div key={index} className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="text-talencor-gold mb-6">
                    {section.icon}
                  </div>
                  <h3 className="text-3xl font-bold font-montserrat text-navy mb-6">{section.title}</h3>
                  <p className="text-lg text-charcoal mb-8 leading-relaxed">{section.description}</p>
                  <div className="space-y-4">
                    {section.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-talencor-gold rounded-full flex items-center justify-center mr-3 mt-1">
                          <Star size={14} className="text-white" />
                        </div>
                        <span className="text-charcoal">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`mt-8 lg:mt-0 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <img 
                    src={`https://images.unsplash.com/photo-${
                      index === 0 ? '1600880292203-757bb62b4baf' : 
                      index === 1 ? '1551836022-8b2858c9c69b' : 
                      '1497366216548-37526070297c'
                    }?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`}
                    alt={section.title}
                    className="rounded-2xl shadow-xl"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staffing Solutions */}
      <section className="py-20 bg-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Staffing Solutions
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              Flexible staffing options to meet your evolving business needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Permanent Staffing",
                description: "Full-time hires for long-term growth",
                features: ["Direct hire placements", "Executive search", "Retained search services"],
                icon: <Users size={32} />
              },
              {
                title: "Temporary Staffing",
                description: "Short-term solutions for immediate needs",
                features: ["Seasonal workers", "Project-based staff", "Interim management"],
                icon: <Clock size={32} />
              },
              {
                title: "Contract-to-Hire",
                description: "Try before you buy approach",
                features: ["Risk mitigation", "Skills evaluation", "Cultural assessment"],
                icon: <TrendingUp size={32} />
              }
            ].map((solution, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="text-corporate-blue mb-6 flex justify-center">
                    {solution.icon}
                  </div>
                  <h3 className="text-2xl font-bold font-montserrat text-navy mb-4">{solution.title}</h3>
                  <p className="text-charcoal mb-6">{solution.description}</p>
                  <ul className="space-y-2 text-sm text-charcoal">
                    {solution.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center justify-center">
                        <Star size={16} className="text-energetic-orange mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Success */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Client Success Stories
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              See how we've helped businesses like yours achieve their staffing goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                metric: "50%",
                description: "Reduction in time-to-hire",
                company: "Tech Startup"
              },
              {
                metric: "95%",
                description: "Employee retention rate",
                company: "Manufacturing Company"
              },
              {
                metric: "200+",
                description: "Positions filled annually",
                company: "Healthcare Organization"
              }
            ].map((success, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="text-5xl font-bold font-montserrat text-energetic-orange mb-4">
                    {success.metric}
                  </div>
                  <h3 className="text-lg font-semibold font-montserrat text-navy mb-2">{success.description}</h3>
                  <p className="text-charcoal">{success.company}</p>
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
            Ready to Find Your Next Great Hire?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's discuss your staffing needs and create a customized solution for your business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
                Post a Job Opening
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant="outline"
                className="border-2 border-white hover:bg-white hover:text-corporate-blue text-white px-8 py-4 text-lg font-semibold"
              >
                Schedule Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
