import HeroSection from "@/components/hero-section";
import ServicesOverview from "@/components/services-overview";
import StatisticsSection from "@/components/statistics-section";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

export default function Home() {
  return (
    <>

      <HeroSection />
      <ServicesOverview />

      {/* Job Seekers Section */}
      <section className="py-20 bg-gradient-to-br from-white to-light-grey relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="hexagon-pattern h-full w-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Diverse workforce collaboration" 
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
                Advance Your <span className="text-talencor-gold">Career</span>
              </h2>
              <p className="text-xl text-charcoal mb-8 leading-relaxed">
                Whether you're seeking your first opportunity, making a career change, or looking to advance to the next level, our expert recruiters are here to guide you every step of the way.
              </p>
              
              <div className="space-y-6 mb-8">
                {[
                  {
                    title: "Personalized Career Guidance",
                    description: "One-on-one consultations to understand your goals and match you with the right opportunities"
                  },
                  {
                    title: "Exclusive Job Opportunities", 
                    description: "Access to hidden job market and exclusive positions from our extensive employer network"
                  },
                  {
                    title: "Professional Development",
                    description: "Skills training and professional development programs to enhance your marketability"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-talencor-gold rounded-full flex items-center justify-center mr-4">
                      <Check size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold font-montserrat text-navy mb-2">{benefit.title}</h4>
                      <p className="text-charcoal">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/job-seekers">
                  <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold w-full sm:w-auto">
                    Browse Jobs
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    variant="outline" 
                    className="border-2 border-talencor-gold hover:bg-talencor-gold hover:text-white text-talencor-gold px-8 py-4 text-lg font-semibold w-full sm:w-auto"
                  >
                    Submit Resume
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Employers Section */}
      <section className="py-20 bg-gradient-to-br from-navy to-charcoal text-white relative overflow-hidden border-t-4 border-talencor-gold">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="hexagon-pattern h-full w-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">
                Find Your Perfect <span className="text-talencor-gold">Hire</span>
              </h2>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Partner with Talencor to access top talent and streamline your hiring process. Our comprehensive staffing solutions are designed to meet your unique business needs.
              </p>
              
              <div className="space-y-6 mb-8">
                {[
                  {
                    title: "Pre-Screened Candidates",
                    description: "Rigorous screening process ensures you only meet qualified, motivated candidates"
                  },
                  {
                    title: "Faster Time-to-Hire",
                    description: "Reduce your recruitment time by up to 50% with our efficient hiring process"
                  },
                  {
                    title: "Industry Expertise",
                    description: "Specialized knowledge across multiple industries and job functions"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-energetic-orange rounded-full flex items-center justify-center mr-4">
                      <Star size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold font-montserrat mb-2">{benefit.title}</h4>
                      <p className="text-gray-200">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/employers">
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
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Professional business handshake" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <StatisticsSection />
    </>
  );
}
