import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Mail, Lock, FileText, Users, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function ApplicationInfo() {
  return (
    <>
      <Helmet>
        <title>Employment Application Process | Talencor Staffing</title>
        <meta 
          name="description" 
          content="Learn about Talencor Staffing's secure employment application process. Our recruiters will send you a secure link to complete your application safely." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-cream to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-talencor-gold to-talencor-orange rounded-full shadow-lg">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold font-montserrat text-navy mb-4">
              Secure Employment Application Process
            </h1>
            <p className="text-lg text-charcoal max-w-3xl mx-auto">
              To protect your personal information, we've moved our employment application to a secure, private portal. 
              Here's how our streamlined process works:
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-2 border-talencor-gold/20 hover:border-talencor-gold/40 transition-colors">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-navy rounded-full">
                    <Users className="h-6 w-6 text-talencor-gold" />
                  </div>
                </div>
                <CardTitle className="text-navy">Step 1: Contact Our Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-charcoal">
                  Reach out to us through our contact form or call our office. 
                  Our recruiters will discuss opportunities that match your skills.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-talencor-gold/20 hover:border-talencor-gold/40 transition-colors">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-navy rounded-full">
                    <Mail className="h-6 w-6 text-talencor-gold" />
                  </div>
                </div>
                <CardTitle className="text-navy">Step 2: Receive Secure Link</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-charcoal">
                  Our recruiter will send you a personalized, secure email with a 
                  private link to complete your employment application.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-talencor-gold/20 hover:border-talencor-gold/40 transition-colors">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-navy rounded-full">
                    <Lock className="h-6 w-6 text-talencor-gold" />
                  </div>
                </div>
                <CardTitle className="text-navy">Step 3: Secure Submission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-charcoal">
                  Complete your application in our protected portal where your 
                  sensitive information is encrypted and safely stored.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Security Features */}
          <Card className="mb-12 bg-gradient-to-r from-navy/5 to-charcoal/5 border-2 border-talencor-gold/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-talencor-gold" />
                <div>
                  <CardTitle className="text-navy text-2xl">Your Privacy is Protected</CardTitle>
                  <CardDescription className="text-lg">
                    We've implemented this secure process to safeguard your personal information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-navy mb-1">Encrypted Data Storage</h4>
                    <p className="text-charcoal text-sm">All sensitive information like SIN numbers are encrypted and stored securely</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-navy mb-1">Personalized Access</h4>
                    <p className="text-charcoal text-sm">Each application link is unique and expires after use</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-navy mb-1">Direct Recruiter Contact</h4>
                    <p className="text-charcoal text-sm">Work directly with our team throughout the application process</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-navy mb-1">No Public Forms</h4>
                    <p className="text-charcoal text-sm">Your personal details never pass through public web forms</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-navy text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-lg">
                Contact us today to begin your secure application process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-navy">Call Our Office</h4>
                  <p className="text-2xl font-bold text-talencor-gold">
                    <a href="tel:647-946-2177" className="hover:text-talencor-orange transition-colors">
                      (647) 946-2177
                    </a>
                  </p>
                  <p className="text-sm text-charcoal">
                    Monday-Friday: 10 AM - 5 PM<br />
                    Weekends: Closed
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-navy">Send Us a Message</h4>
                  <Link href="/contact">
                    <Button className="bg-gradient-to-r from-talencor-gold to-talencor-orange hover:from-talencor-orange hover:to-talencor-gold text-white font-bold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                      <Mail className="h-5 w-5 mr-2" />
                      Contact Form
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="pt-6 border-t border-talencor-gold/20">
                <p className="text-sm text-charcoal">
                  <strong>Office Address:</strong> 2985 Drew Rd #206, Airport Business Complex, Mississauga, ON
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}