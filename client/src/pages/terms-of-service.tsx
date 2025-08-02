import { Helmet } from "react-helmet-async";
import { FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Talencor Staffing</title>
        <meta 
          name="description" 
          content="Read Talencor Staffing's terms of service for using our recruitment and staffing services." 
        />
      </Helmet>

      <div className="min-h-screen bg-light-grey py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-center mb-8">
              <FileText className="h-12 w-12 text-talencor-gold mr-3" />
              <h1 className="text-4xl font-bold font-montserrat text-navy">Terms of Service</h1>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">Effective Date: January 1, 2024</p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-charcoal mb-6">
                By accessing and using Talencor Staffing's services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">2. Services Description</h2>
              <p className="text-charcoal mb-4">
                Talencor Staffing provides:
              </p>
              <ul className="list-disc pl-6 text-charcoal mb-6">
                <li>Recruitment and placement services</li>
                <li>Temporary and permanent staffing solutions</li>
                <li>HR consulting and payroll administration</li>
                <li>Career development and training programs</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">3. User Responsibilities</h2>
              <p className="text-charcoal mb-4">
                As a user of our services, you agree to:
              </p>
              <ul className="list-disc pl-6 text-charcoal mb-6">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect the intellectual property rights of others</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">4. Employment Relationship</h2>
              <p className="text-charcoal mb-6">
                Talencor Staffing acts as an intermediary between job seekers and employers. We do not guarantee employment, and any employment relationship is between you and the hiring employer.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">5. Limitation of Liability</h2>
              <p className="text-charcoal mb-6">
                To the maximum extent permitted by law, Talencor Staffing shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">6. Indemnification</h2>
              <p className="text-charcoal mb-6">
                You agree to indemnify and hold harmless Talencor Staffing from any claims, damages, or expenses arising from your violation of these terms or your use of our services.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">7. Modifications</h2>
              <p className="text-charcoal mb-6">
                We reserve the right to modify these Terms of Service at any time. Continued use of our services after changes constitutes acceptance of the modified terms.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">8. Governing Law</h2>
              <p className="text-charcoal mb-6">
                These Terms of Service shall be governed by and construed in accordance with the laws of Ontario, Canada.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">9. Contact Information</h2>
              <p className="text-charcoal mb-6">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-charcoal">
                  <strong>Talencor Staffing</strong><br />
                  2985 Drew Rd #206<br />
                  Airport Business Complex<br />
                  Mississauga, ON L4T 0A4<br />
                  Phone: <a href="tel:647-946-2177" className="text-talencor-gold hover:underline">647-946-2177</a><br />
                  Email: <a href="mailto:legal@talencor.ca" className="text-talencor-gold hover:underline">legal@talencor.ca</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}