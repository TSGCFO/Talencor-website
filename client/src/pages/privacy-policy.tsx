import { Helmet } from "react-helmet-async";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Talencor Staffing</title>
        <meta 
          name="description" 
          content="Learn how Talencor Staffing protects your personal information and maintains your privacy." 
        />
      </Helmet>

      <div className="min-h-screen bg-light-grey py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-center mb-8">
              <Shield className="h-12 w-12 text-talencor-gold mr-3" />
              <h1 className="text-4xl font-bold font-montserrat text-navy">Privacy Policy</h1>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">Effective Date: January 1, 2024</p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">1. Information We Collect</h2>
              <p className="text-charcoal mb-4">
                At Talencor Staffing, we collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-charcoal mb-6">
                <li>Personal identification information (name, email address, phone number)</li>
                <li>Resume and employment history</li>
                <li>Skills and qualifications</li>
                <li>Job preferences and career goals</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="text-charcoal mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-charcoal mb-6">
                <li>Match you with suitable employment opportunities</li>
                <li>Communicate with you about job openings</li>
                <li>Provide career counseling and support services</li>
                <li>Improve our services and website functionality</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">3. Information Sharing</h2>
              <p className="text-charcoal mb-6">
                We do not sell, trade, or rent your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-charcoal mb-6">
                <li>Potential employers (with your consent)</li>
                <li>Service providers who assist in our operations</li>
                <li>Legal authorities when required by law</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">4. Data Security</h2>
              <p className="text-charcoal mb-6">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">5. Your Rights</h2>
              <p className="text-charcoal mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-charcoal mb-6">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">6. Contact Us</h2>
              <p className="text-charcoal mb-6">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-charcoal">
                  <strong>Talencor Staffing</strong><br />
                  2985 Drew Rd #206<br />
                  Airport Business Complex<br />
                  Mississauga, ON L4T 0A4<br />
                  Phone: <a href="tel:647-946-2177" className="text-talencor-gold hover:underline">647-946-2177</a><br />
                  Email: <a href="mailto:admin@talencor.ca" className="text-talencor-gold hover:underline">admin@talencor.ca</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}