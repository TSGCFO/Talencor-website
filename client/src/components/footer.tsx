import { Link } from "wouter";
import { Linkedin, Twitter, Facebook } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export default function Footer() {
  const quickLinks = [
    { name: "Services", href: "/services" },
    { name: "Job Seekers", href: "/job-seekers" },
    { name: "Employers", href: "/employers" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const services = [
    "Permanent Placement",
    "Temporary Staffing", 
    "Contract-to-Hire",
    "Executive Search",
    "Training Programs"
  ];

  return (
    <footer className="bg-navy text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col mb-4">
              <span className="text-2xl font-bold text-white font-montserrat">TALENCOR</span>
              <span className="text-xs text-energetic-orange font-open-sans tracking-wider">STAFFING</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Connecting exceptional talent with outstanding opportunities across Canada. Your trusted partner for all staffing needs.
            </p>
            <div className="flex space-x-4">
              <a 
                href={COMPANY_INFO.socialMedia.linkedin} 
                className="w-10 h-10 bg-corporate-blue hover:bg-energetic-orange rounded-full flex items-center justify-center transition-colors"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href={COMPANY_INFO.socialMedia.twitter}
                className="w-10 h-10 bg-corporate-blue hover:bg-energetic-orange rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a 
                href={COMPANY_INFO.socialMedia.facebook}
                className="w-10 h-10 bg-corporate-blue hover:bg-energetic-orange rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold font-montserrat mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-energetic-orange transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold font-montserrat mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <Link 
                    href="/services"
                    className="text-gray-300 hover:text-energetic-orange transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 Talencor Staffing. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-energetic-orange text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-energetic-orange text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-300 hover:text-energetic-orange text-sm transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
