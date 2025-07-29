import { Helmet } from "react-helmet-async";
import { Check, Search, Users, BookOpen, TrendingUp, Play, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function JobSeekers() {
  return (
    <>
      <Helmet>
        <title>Career Opportunities for Job Seekers | Talencor Staffing</title>
        <meta 
          name="description" 
          content="Find your next career opportunity with Talencor. Professional career guidance, exclusive job opportunities, and skills development programs for job seekers across Canada." 
        />
        <meta property="og:title" content="Career Opportunities for Job Seekers | Talencor" />
        <meta property="og:description" content="Professional career guidance and exclusive job opportunities across Canada." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy to-charcoal text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat mb-4 sm:mb-6">
                Advance Your <span className="text-talencor-gold">Career</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 sm:mb-8 leading-relaxed">
                Whether you're seeking your first opportunity, making a career change, or looking to advance to the next level, our expert recruiters are here to guide you every step of the way.
              </p>
              <div className="space-y-4">
                {/* Search Bar Row */}
                <div className="flex gap-2 max-w-xl">
                  <input
                    type="text"
                    placeholder="Search for jobs..."
                    className="px-4 py-3 rounded-lg text-charcoal bg-white flex-1 min-h-[44px]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        window.location.href = '/jobs';
                      }
                    }}
                  />
                  <Button asChild className="bg-talencor-gold hover:bg-talencor-orange text-white px-4 sm:px-6 min-h-[44px]">
                    <Link href="/jobs">
                      Browse Jobs
                    </Link>
                  </Button>
                </div>
                
                {/* Action Buttons Row */}
                <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
                  <Button 
                    asChild
                    size="lg" 
                    variant="outline"
                    className="border-2 border-white bg-transparent hover:bg-white hover:text-navy text-white flex-1 sm:flex-initial"
                  >
                    <Link href="/interview-simulator">
                      <Play className="mr-2" size={20} />
                      Practice Interview
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline" 
                    className="border-2 border-white bg-transparent hover:bg-white hover:text-navy text-white flex-1 sm:flex-initial"
                  >
                    <Link href="/contact">
                      Submit Resume
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="hidden lg:block mt-12 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Diverse workforce collaboration" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat text-navy mb-4 sm:mb-6">
              Why Work With Us?
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              We're committed to helping you find not just a job, but a career that aligns with your goals and aspirations
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                title: "Personalized Career Guidance",
                description: "Our experienced recruiters take the time to understand your career goals, strengths, and preferences to match you with opportunities that truly fit.",
                benefits: [
                  "One-on-one career consultation",
                  "Resume and interview coaching",
                  "Career path planning",
                  "Skills assessment and development recommendations"
                ]
              },
              {
                title: "Exclusive Job Opportunities",
                description: "Access positions that aren't advertised publicly through our extensive network of partner companies across various industries.",
                benefits: [
                  "Hidden job market access",
                  "Direct connections with hiring managers",
                  "Priority consideration for new openings",
                  "Industry insider knowledge"
                ]
              },
              {
                title: "Professional Development",
                description: "Enhance your skills and marketability with our training programs and professional development resources.",
                benefits: [
                  "Skills training workshops",
                  "Industry certification programs",
                  "Professional networking events",
                  "Continuing education support"
                ]
              }
            ].map((section, index) => (
              <div key={index} className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <h3 className="text-3xl font-bold font-montserrat text-navy mb-6">{section.title}</h3>
                  <p className="text-lg text-charcoal mb-8 leading-relaxed">{section.description}</p>
                  <div className="space-y-4">
                    {section.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-talencor-gold rounded-full flex items-center justify-center mr-3 mt-1">
                          <Check size={14} className="text-white" />
                        </div>
                        <span className="text-charcoal">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`mt-8 lg:mt-0 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <img 
                    src={`https://images.unsplash.com/photo-${
                      index === 0 ? '1573496359142-b8d87734a5a2' : 
                      index === 1 ? '1600880292203-757bb62b4baf' : 
                      '1552664730-d307ca884978'
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

      {/* Career Tools Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-talencor-gold/10 to-talencor-orange/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat text-navy mb-4 sm:mb-6">
              AI-Powered Career Tools
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              Leverage cutting-edge technology to accelerate your career journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-navy to-charcoal p-8 text-white">
                  <Play className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold font-montserrat mb-2">Interview Simulator</h3>
                  <p className="mb-6 text-gray-200">
                    Practice with AI-generated questions tailored to your industry and experience level
                  </p>
                  <Button asChild className="bg-white text-navy hover:bg-gray-100">
                    <Link href="/interview-simulator">
                      Start Practicing
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-talencor-gold to-talencor-orange p-8 text-white">
                  <FileText className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold font-montserrat mb-2">Resume Enhancement</h3>
                  <p className="mb-6 text-gray-100">
                    Transform your resume with AI-powered optimization for ATS systems
                  </p>
                  <Button asChild className="bg-white text-talencor-orange hover:bg-gray-100">
                    <Link href="/resume-wizard">
                      Enhance Resume
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-navy to-charcoal p-8 text-white">
                  <BookOpen className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold font-montserrat mb-2">Question Bank</h3>
                  <p className="mb-6 text-gray-200">
                    Create and organize your custom interview questions for targeted preparation
                  </p>
                  <Button asChild className="bg-white text-navy hover:bg-gray-100">
                    <Link href="/question-bank">
                      Manage Questions
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-12 sm:py-16 md:py-20 bg-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat text-navy mb-4 sm:mb-6">
              Industries We Serve
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              We specialize in placing candidates across a wide range of industries and job functions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Information Technology", icon: <TrendingUp size={32} />, jobs: "500+ Jobs" },
              { name: "Healthcare", icon: <Users size={32} />, jobs: "300+ Jobs" },
              { name: "Finance & Accounting", icon: <BookOpen size={32} />, jobs: "250+ Jobs" },
              { name: "Manufacturing", icon: <Search size={32} />, jobs: "400+ Jobs" },
              { name: "Administrative", icon: <Users size={32} />, jobs: "200+ Jobs" },
              { name: "Sales & Marketing", icon: <TrendingUp size={32} />, jobs: "350+ Jobs" },
              { name: "Engineering", icon: <Search size={32} />, jobs: "180+ Jobs" },
              { name: "Customer Service", icon: <BookOpen size={32} />, jobs: "220+ Jobs" }
            ].map((industry, index) => (
              <Link 
                key={index} 
                href={`/jobs?industry=${encodeURIComponent(industry.name)}`}
                className="block transform transition-all duration-200 hover:scale-105"
              >
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="text-talencor-gold mb-4 flex justify-center">
                      {industry.icon}
                    </div>
                    <h3 className="text-lg font-semibold font-montserrat text-navy mb-2">{industry.name}</h3>
                    <p className="text-talencor-gold font-medium">{industry.jobs}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 bg-corporate-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat mb-4 sm:mb-6">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let us help you find the perfect opportunity that matches your skills and career goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
              <Link href="/contact">
                Submit Your Resume
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="border-2 border-white bg-transparent hover:bg-white hover:text-corporate-blue text-white px-8 py-4 text-lg font-semibold"
            >
              <Link href="/contact">
                Schedule Consultation
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
