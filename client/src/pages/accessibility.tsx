import { Helmet } from "react-helmet-async";
import { Accessibility as AccessibilityIcon } from "lucide-react";

export default function Accessibility() {
  return (
    <>
      <Helmet>
        <title>Accessibility Statement | Talencor Staffing</title>
        <meta 
          name="description" 
          content="Learn about Talencor Staffing's commitment to accessibility and inclusion for all users." 
        />
      </Helmet>

      <div className="min-h-screen bg-light-grey py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-center mb-8">
              <AccessibilityIcon className="h-12 w-12 text-talencor-gold mr-3" />
              <h1 className="text-4xl font-bold font-montserrat text-navy">Accessibility Statement</h1>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">Last Updated: January 1, 2024</p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Our Commitment</h2>
              <p className="text-charcoal mb-6">
                Talencor Staffing is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Accessibility Standards</h2>
              <p className="text-charcoal mb-4">
                We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA. These guidelines help make web content accessible to people with a wide array of disabilities including:
              </p>
              <ul className="list-disc pl-6 text-charcoal mb-6">
                <li>Visual impairments</li>
                <li>Hearing impairments</li>
                <li>Motor impairments</li>
                <li>Cognitive disabilities</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Accessibility Features</h2>
              <p className="text-charcoal mb-4">
                Our website includes the following accessibility features:
              </p>
              <ul className="list-disc pl-6 text-charcoal mb-6">
                <li>Alternative text for images</li>
                <li>Keyboard navigation support</li>
                <li>Clear heading structure</li>
                <li>Sufficient color contrast</li>
                <li>Resizable text without loss of functionality</li>
                <li>Descriptive link text</li>
                <li>Form labels and instructions</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Ongoing Efforts</h2>
              <p className="text-charcoal mb-6">
                We are actively working to increase the accessibility and usability of our website. This includes regular accessibility audits, user testing with people with disabilities, and ongoing staff training.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Third-Party Content</h2>
              <p className="text-charcoal mb-6">
                While we strive to ensure accessibility of our website, we cannot guarantee the accessibility of third-party content or linked external sites.
              </p>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Feedback and Contact</h2>
              <p className="text-charcoal mb-4">
                We welcome your feedback on the accessibility of our website. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-charcoal">
                  <strong>Accessibility Coordinator</strong><br />
                  Talencor Staffing<br />
                  Phone: <a href="tel:647-946-2177" className="text-talencor-gold hover:underline">647-946-2177</a><br />
                  Email: <a href="mailto:accessibility@talencor.ca" className="text-talencor-gold hover:underline">accessibility@talencor.ca</a><br />
                  Office Hours: Monday-Friday, 10 AM - 5 PM EST
                </p>
              </div>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Technical Specifications</h2>
              <p className="text-charcoal mb-4">
                This website is designed to be compatible with the following assistive technologies:
              </p>
              <ul className="list-disc pl-6 text-charcoal mb-6">
                <li>Screen readers (JAWS, NVDA, VoiceOver)</li>
                <li>Screen magnification software</li>
                <li>Speech recognition software</li>
                <li>Keyboard-only navigation</li>
              </ul>

              <h2 className="text-2xl font-bold text-navy mt-8 mb-4">Formal Complaints</h2>
              <p className="text-charcoal mb-6">
                If you wish to make a formal complaint about the accessibility of our website, please contact our Accessibility Coordinator using the contact information above. We will acknowledge your complaint within 2 business days and work with you to resolve the issue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}