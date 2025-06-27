import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { GraduationCap, Shield, Users, Award, BookOpen, CheckCircle } from "lucide-react";

export default function TrainingService() {
  return (
    <>
      <Helmet>
        <title>Employee Training Services & WHMIS Certification | Talencor Staffing</title>
        <meta name="description" content="Comprehensive employee training programs including WHMIS certification and workplace safety training in Toronto and GTA. Ensure your team meets industry standards." />
        <meta name="keywords" content="employee training Toronto, WHMIS certification, workplace safety training, professional development, skills training, compliance training GTA" />
        <link rel="canonical" href="/services/training" />
        <meta property="og:title" content="Employee Training Services & WHMIS Certification | Talencor Staffing" />
        <meta property="og:description" content="Comprehensive employee training programs including WHMIS certification and workplace safety training in Toronto and GTA." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/services/training" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Employee Training Services & WHMIS Certification | Talencor Staffing" />
        <meta name="twitter:description" content="Comprehensive employee training programs including WHMIS certification and workplace safety training in Toronto and GTA." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Employee Training Services",
            "description": "Comprehensive training programs including WHMIS certification and workplace safety training for businesses in Toronto and GTA",
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
            "serviceType": "Training and Professional Development",
            "areaServed": "Greater Toronto Area"
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-navy to-corporate-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold font-montserrat mb-6">
              Professional <span className="text-talencor-gold">Training</span> Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive training programs including WHMIS certification and workplace safety training to ensure all employees meet your specific requirements and standards
            </p>
            <Link href="/contact">
              <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
                Get Training Solutions
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
                Comprehensive Training Solutions
              </h2>
              <p className="text-lg text-charcoal mb-6 leading-relaxed">
                At Talencor Staffing, we believe that well-trained employees are the foundation of any successful business. 
                Our comprehensive training programs are designed to ensure that every employee we place meets your specific 
                requirements and industry standards from day one.
              </p>
              <p className="text-lg text-charcoal leading-relaxed">
                From WHMIS certification to specialized skill development, we provide the training solutions that keep 
                your workplace safe, compliant, and productive.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-t-4 border-t-talencor-gold">
                <CardContent className="p-6 text-center">
                  <Shield className="text-talencor-gold mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Safety First</h3>
                  <p className="text-sm text-charcoal">WHMIS & workplace safety</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-talencor-orange">
                <CardContent className="p-6 text-center">
                  <Award className="text-talencor-orange mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Certified Programs</h3>
                  <p className="text-sm text-charcoal">Industry-recognized training</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-navy">
                <CardContent className="p-6 text-center">
                  <BookOpen className="text-navy mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Skills Development</h3>
                  <p className="text-sm text-charcoal">Professional skill building</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-talencor-gold">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="text-talencor-gold mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Compliance Ready</h3>
                  <p className="text-sm text-charcoal">Meet all requirements</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* WHMIS Training Highlight */}
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
                  <Shield size={48} />
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

      {/* Training Programs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Our Training <span className="text-talencor-gold">Programs</span>
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              Comprehensive training solutions tailored to your industry and specific needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Safety Training",
                description: "WHMIS, workplace safety protocols, and hazard identification",
                icon: Shield
              },
              {
                title: "Skills Development",
                description: "Job-specific skills training for various industries and roles",
                icon: BookOpen
              },
              {
                title: "Compliance Training",
                description: "Industry regulations and standards compliance programs",
                icon: CheckCircle
              },
              {
                title: "Orientation Programs",
                description: "Company-specific orientation and onboarding training",
                icon: Users
              },
              {
                title: "Professional Development",
                description: "Leadership, communication, and professional skills training",
                icon: Award
              },
              {
                title: "Certification Programs",
                description: "Industry-recognized certifications and continuing education",
                icon: GraduationCap
              }
            ].map((program, index) => {
              const IconComponent = program.icon;
              const borderColors = ["border-t-talencor-gold", "border-t-talencor-orange", "border-t-navy"];
              const iconColors = ["text-talencor-gold", "text-talencor-orange", "text-navy"];
              
              return (
                <Card key={program.title} className={`hover:shadow-lg transition-shadow border-t-4 ${borderColors[index % 3]}`}>
                  <CardContent className="p-8 text-center">
                    <div className={`mb-4 ${iconColors[index % 3]} flex justify-center`}>
                      <IconComponent size={48} />
                    </div>
                    <h3 className="text-xl font-bold font-montserrat text-navy mb-4">{program.title}</h3>
                    <p className="text-charcoal leading-relaxed">
                      {program.description}
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
            Ready to Invest in Your Team's Success?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let us help you develop a skilled, compliant, and productive workforce with our comprehensive training solutions
          </p>
          <Link href="/contact">
            <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
              Discuss Training Needs
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}