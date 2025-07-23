import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Building, Target, Users, Award, CheckCircle, Search } from "lucide-react";

export default function FullTimePlacementsService() {
  return (
    <>
      <Helmet>
        <title>Full-time Permanent Placements | Talencor Staffing Solutions</title>
        <meta name="description" content="Permanent staffing solutions with carefully screened candidates who fit your company's unique culture in Toronto and GTA. Professional full-time recruitment services." />
        <meta name="keywords" content="permanent staffing Toronto, full-time placements GTA, permanent recruitment, direct hire, executive search, professional placements" />
        <link rel="canonical" href="/services/full-time-placements" />
        <meta property="og:title" content="Full-time Permanent Placements | Talencor Staffing Solutions" />
        <meta property="og:description" content="Permanent staffing solutions with carefully screened candidates who fit your company's unique culture in Toronto and GTA." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/services/full-time-placements" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Full-time Permanent Placements | Talencor Staffing Solutions" />
        <meta name="twitter:description" content="Permanent staffing solutions with carefully screened candidates who fit your company's unique culture in Toronto and GTA." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Full-time Permanent Placements",
            "description": "Permanent staffing solutions with carefully screened candidates who fit your company's unique culture in Toronto and GTA",
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
            "serviceType": "Permanent Staffing and Executive Search",
            "areaServed": "Greater Toronto Area"
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-navy to-corporate-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold font-montserrat mb-6">
              Full-time <span className="text-talencor-gold">Permanent</span> Placements
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Permanent staffing solutions with carefully screened candidates who fit your company's unique culture and long-term goals
            </p>
            <Link href="/contact">
              <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
                Find Permanent Staff
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
                Build Your Dream Team
              </h2>
              <p className="text-lg text-charcoal mb-6 leading-relaxed">
                Finding the right permanent employees is one of the most important investments you'll make in your business. 
                At Talencor Staffing, we understand that permanent placements require a deeper level of evaluation - not just 
                skills and experience, but cultural fit, long-term potential, and shared values.
              </p>
              <p className="text-lg text-charcoal leading-relaxed">
                Our comprehensive permanent placement process goes beyond traditional recruiting to ensure we find candidates 
                who will thrive in your organization and contribute to your long-term success.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-t-4 border-t-talencor-gold">
                <CardContent className="p-6 text-center">
                  <Target className="text-talencor-gold mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Cultural Fit</h3>
                  <p className="text-sm text-charcoal">Perfect company alignment</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-talencor-orange">
                <CardContent className="p-6 text-center">
                  <Search className="text-talencor-orange mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Deep Screening</h3>
                  <p className="text-sm text-charcoal">Comprehensive evaluation</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-navy">
                <CardContent className="p-6 text-center">
                  <Award className="text-navy mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Quality Assured</h3>
                  <p className="text-sm text-charcoal">Top-tier candidates only</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-talencor-gold">
                <CardContent className="p-6 text-center">
                  <Building className="text-talencor-gold mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Long-term Success</h3>
                  <p className="text-sm text-charcoal">Built for permanence</p>
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
              Our Permanent Placement <span className="text-talencor-gold">Process</span>
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              A thorough approach to finding candidates who will succeed long-term in your organization
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-talencor-gold text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold font-montserrat text-navy mb-4">Culture Assessment</h3>
              <p className="text-charcoal leading-relaxed">
                Deep dive into your company culture, values, and team dynamics to understand the ideal candidate profile.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-talencor-orange text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold font-montserrat text-navy mb-4">Strategic Sourcing</h3>
              <p className="text-charcoal leading-relaxed">
                Targeted search using multiple channels to identify high-quality candidates who match your specific requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-navy text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold font-montserrat text-navy mb-4">Comprehensive Evaluation</h3>
              <p className="text-charcoal leading-relaxed">
                Multi-stage assessment including skills testing, behavioral interviews, and reference verification.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-talencor-gold text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold font-montserrat text-navy mb-4">Seamless Integration</h3>
              <p className="text-charcoal leading-relaxed">
                Ongoing support during the transition period to ensure successful integration into your team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Permanent Placement Advantage */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              The <span className="text-talencor-gold">Permanent Placement</span> Advantage
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              Why many of our clients choose to hire their temporary staff permanently
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold font-montserrat text-navy mb-6">Proven Performance</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="text-talencor-gold mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Already Proven:</strong>
                    <span className="text-charcoal ml-2">You've seen their work quality and cultural fit firsthand</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-talencor-gold mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Reduced Risk:</strong>
                    <span className="text-charcoal ml-2">No surprises - you know exactly what you're getting</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-talencor-gold mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Seamless Transition:</strong>
                    <span className="text-charcoal ml-2">Already trained and integrated into your team</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-talencor-gold mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Cost-Effective:</strong>
                    <span className="text-charcoal ml-2">Save on recruitment and training costs</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-montserrat text-navy mb-6">Fresh Talent Pool</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="text-talencor-orange mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Exclusive Access:</strong>
                    <span className="text-charcoal ml-2">Our extensive network of pre-screened professionals</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-talencor-orange mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Hidden Gems:</strong>
                    <span className="text-charcoal ml-2">Quality candidates not actively job searching</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-talencor-orange mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Expert Matching:</strong>
                    <span className="text-charcoal ml-2">Our Profile-Matching System finds the perfect fit</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-talencor-orange mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Comprehensive Support:</strong>
                    <span className="text-charcoal ml-2">Full recruitment service from search to placement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Position Types */}
      <section className="py-20 bg-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Permanent Positions We <span className="text-talencor-gold">Fill</span>
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              From entry-level to executive positions across multiple industries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Management & Leadership",
              "Administrative & Office",
              "Sales & Customer Service",
              "Manufacturing & Production",
              "Warehouse & Logistics",
              "Technical & Skilled Trades",
              "Healthcare Support",
              "Finance & Accounting",
              "Human Resources",
              "Information Technology",
              "Engineering",
              "Marketing & Communications"
            ].map((position, index) => (
              <Card key={position} className="hover:shadow-lg transition-shadow border-l-4 border-l-talencor-gold">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold font-montserrat text-navy mb-2">{position}</h3>
                  <p className="text-sm text-charcoal">
                    Permanent placements for {position.toLowerCase()} roles
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Our <span className="text-talencor-gold">Success</span> Stories
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              "We encourage you to draw from our pool of talent should you want to hire someone permanently."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-talencor-gold">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-talencor-gold mb-4">85%</div>
                <h3 className="text-xl font-bold font-montserrat text-navy mb-4">Successful Transitions</h3>
                <p className="text-charcoal leading-relaxed">
                  Of our temporary placements who are offered permanent positions accept and succeed long-term
                </p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-talencor-orange">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-talencor-orange mb-4">30+</div>
                <h3 className="text-xl font-bold font-montserrat text-navy mb-4">Days Average</h3>
                <p className="text-charcoal leading-relaxed">
                  Time to fill permanent positions with qualified, culture-fit candidates
                </p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-navy">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold text-navy mb-4">95%</div>
                <h3 className="text-xl font-bold font-montserrat text-navy mb-4">Client Satisfaction</h3>
                <p className="text-charcoal leading-relaxed">
                  Of our clients are satisfied with their permanent placements and return for future hiring needs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">
            Ready to Build Your Dream Team?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let us help you find permanent employees who will drive your business forward for years to come
          </p>
          <Link href="/contact">
            <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
              Start Your Permanent Search
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}