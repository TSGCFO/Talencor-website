import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Calculator, FileText, DollarSign, Clock, Shield, CheckCircle } from "lucide-react";

export default function PayrollAdministrationService() {
  return (
    <>
      <Helmet>
        <title>Payroll & Administration Services | Talencor Staffing Solutions</title>
        <meta name="description" content="Complete payroll management and administration services in Toronto and GTA. Handle vacation pay, severance, sick leave, and all administrative tasks for your workforce." />
        <meta name="keywords" content="payroll services Toronto, payroll administration GTA, employee benefits, vacation pay, severance management, workforce administration" />
        <link rel="canonical" href="/services/payroll-administration" />
        <meta property="og:title" content="Payroll & Administration Services | Talencor Staffing Solutions" />
        <meta property="og:description" content="Complete payroll management and administration services in Toronto and GTA. Handle vacation pay, severance, sick leave, and all administrative tasks." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/services/payroll-administration" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Payroll & Administration Services | Talencor Staffing Solutions" />
        <meta name="twitter:description" content="Complete payroll management and administration services in Toronto and GTA. Handle vacation pay, severance, sick leave, and all administrative tasks." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Payroll & Administration Services",
            "description": "Complete payroll management including vacation pay, severance, sick leave, and all administrative tasks for businesses in Toronto and GTA",
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
            "serviceType": "Payroll and Administrative Services",
            "areaServed": "Greater Toronto Area"
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-navy to-corporate-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold font-montserrat mb-6">
              Payroll & <span className="text-talencor-gold">Administration</span> Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Complete payroll management including vacation pay, severance, sick leave, and all administrative tasks to streamline your workforce operations
            </p>
            <Link href="/contact">
              <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
                Simplify Your Payroll
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
                Comprehensive Payroll Solutions
              </h2>
              <p className="text-lg text-charcoal mb-6 leading-relaxed">
                Managing payroll and administration can be complex and time-consuming. At Talencor Staffing, we handle 
                all the administrative burdens so you can focus on what you do best - running your business.
              </p>
              <p className="text-lg text-charcoal leading-relaxed">
                From processing payroll and managing benefits to handling compliance and reporting, our comprehensive 
                administrative services ensure your workforce operations run smoothly and efficiently.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-t-4 border-t-talencor-gold">
                <CardContent className="p-6 text-center">
                  <DollarSign className="text-talencor-gold mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Payroll Processing</h3>
                  <p className="text-sm text-charcoal">Accurate & timely payments</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-talencor-orange">
                <CardContent className="p-6 text-center">
                  <FileText className="text-talencor-orange mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Benefits Management</h3>
                  <p className="text-sm text-charcoal">Vacation, sick leave, severance</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-navy">
                <CardContent className="p-6 text-center">
                  <Shield className="text-navy mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Compliance</h3>
                  <p className="text-sm text-charcoal">Full regulatory compliance</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-talencor-gold">
                <CardContent className="p-6 text-center">
                  <Clock className="text-talencor-gold mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-navy mb-2">Time Savings</h3>
                  <p className="text-sm text-charcoal">Reduced administrative burden</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What We Handle */}
      <section className="py-20 bg-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              What We <span className="text-talencor-gold">Handle</span>
            </h2>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              Complete administrative management for your temporary and permanent workforce
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Payroll Processing",
                items: ["Weekly/Bi-weekly payroll", "Direct deposit setup", "Pay stub generation", "Tax deductions", "Overtime calculations"]
              },
              {
                title: "Benefits Administration",
                items: ["Vacation pay accrual", "Sick leave tracking", "Holiday pay", "Severance calculations", "Benefits enrollment"]
              },
              {
                title: "Compliance & Reporting",
                items: ["CRA remittances", "T4 preparation", "ROE processing", "WCB reporting", "Employment standards compliance"]
              },
              {
                title: "Record Keeping",
                items: ["Employee files", "Time tracking", "Attendance records", "Performance documentation", "Digital archives"]
              },
              {
                title: "Financial Management",
                items: ["Cost reporting", "Budget tracking", "Invoice processing", "Expense management", "Financial reconciliation"]
              },
              {
                title: "HR Support",
                items: ["New hire processing", "Termination procedures", "Policy administration", "Employee communication", "Dispute resolution"]
              }
            ].map((service, index) => {
              const borderColors = ["border-t-talencor-gold", "border-t-talencor-orange", "border-t-navy"];
              
              return (
                <Card key={service.title} className={`hover:shadow-lg transition-shadow border-t-4 ${borderColors[index % 3]}`}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold font-montserrat text-navy mb-4">{service.title}</h3>
                    <ul className="space-y-2">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-charcoal flex items-start">
                          <CheckCircle className="text-talencor-gold mr-2 mt-1 flex-shrink-0" size={16} />
                          <span className="text-sm">{item}</span>
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

      {/* Benefits of Our Service */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-navy mb-6">
              Why Choose Our <span className="text-talencor-gold">Administrative Services</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold font-montserrat text-navy mb-6">Reduce Your Workload</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="text-talencor-gold mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Less Paperwork:</strong>
                    <span className="text-charcoal ml-2">We handle all administrative documentation and processing</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-talencor-gold mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Fewer Headaches:</strong>
                    <span className="text-charcoal ml-2">No more dealing with payroll complications or compliance issues</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-talencor-gold mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Cost Savings:</strong>
                    <span className="text-charcoal ml-2">Reduce overhead costs associated with in-house administration</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-talencor-gold mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Time Freedom:</strong>
                    <span className="text-charcoal ml-2">Focus on your core business while we handle the rest</span>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-montserrat text-navy mb-6">Professional Excellence</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="text-talencor-orange mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Expert Knowledge:</strong>
                    <span className="text-charcoal ml-2">Stay current with all employment laws and regulations</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-talencor-orange mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Accurate Processing:</strong>
                    <span className="text-charcoal ml-2">Precise payroll and benefits calculations every time</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-talencor-orange mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Reliable Support:</strong>
                    <span className="text-charcoal ml-2">Dedicated team available when you need assistance</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-talencor-orange mr-3 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong className="text-navy">Secure Systems:</strong>
                    <span className="text-charcoal ml-2">Protected data handling and confidential processing</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">
            Ready to Simplify Your Payroll?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let us handle all your payroll and administrative needs so you can focus on growing your business
          </p>
          <Link href="/contact">
            <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
              Get Administrative Solutions
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}