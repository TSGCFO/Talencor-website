import { Helmet } from "react-helmet-async";
import { Award, Users, Target, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import StatisticsSection from "@/components/statistics-section";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Talencor Staffing | 15+ Years of Employment Excellence</title>
        <meta 
          name="description" 
          content="Learn about Talencor Staffing's 15+ years of expertise connecting talent with opportunity across Canada. Our mission, values, and commitment to excellence in professional staffing." 
        />
        <meta property="og:title" content="About Talencor Staffing | Employment Excellence" />
        <meta property="og:description" content="15+ years of expertise in professional staffing solutions across Canada." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy to-corporate-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat mb-6">
            About <span className="text-energetic-orange">Talencor</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            With over 15 years of expertise in the staffing industry, we've built a reputation for connecting exceptional talent with outstanding opportunities
          </p>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-20 bg-white">
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
              <h2 className="text-4xl font-bold font-montserrat text-navy mb-6">Our Mission</h2>
              <p className="text-lg text-charcoal mb-6 leading-relaxed">
                To bridge the gap between exceptional talent and remarkable opportunities, creating meaningful connections that drive success for both job seekers and employers across Canada.
              </p>
              <p className="text-lg text-charcoal mb-8 leading-relaxed">
                We believe that the right match can transform careers and businesses. Our dedicated team of recruitment specialists combines industry expertise with personalized service to deliver results that exceed expectations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-light-grey">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold font-montserrat text-navy mb-3">Our Values</h4>
                    <ul className="text-charcoal space-y-2">
                      <li>• Integrity & Trust</li>
                      <li>• Excellence in Service</li>
                      <li>• Personalized Approach</li>
                      <li>• Long-term Partnerships</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-light-grey">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold font-montserrat text-navy mb-3">Industries We Serve</h4>
                    <ul className="text-charcoal space-y-2">
                      <li>• Information Technology</li>
                      <li>• Healthcare</li>
                      <li>• Finance & Accounting</li>
                      <li>• Manufacturing</li>
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
              Our Approach
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              We combine proven methodologies with innovative solutions to deliver exceptional results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Users size={48} />,
                title: "Understanding",
                description: "We take time to understand your unique needs, culture, and goals"
              },
              {
                icon: <Target size={48} />,
                title: "Targeting",
                description: "We identify and target the right candidates for your specific requirements"
              },
              {
                icon: <Award size={48} />,
                title: "Matching",
                description: "We carefully match candidates based on skills, experience, and cultural fit"
              },
              {
                icon: <Heart size={48} />,
                title: "Supporting",
                description: "We provide ongoing support to ensure long-term success for all parties"
              }
            ].map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="text-talencor-gold mb-6 flex justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold font-montserrat text-navy mb-4">{step.title}</h3>
                  <p className="text-charcoal leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
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
