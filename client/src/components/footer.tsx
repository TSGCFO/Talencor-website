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
    <footer className="bg-gradient-to-br from-navy via-charcoal to-navy text-white py-16 border-t-4 border-talencor-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-white rounded-lg p-2 shadow-lg border-2 border-talencor-gold">
                <img 
                  src="/attached_assets/Talencor Staffing 1_1750449443470.jpg" 
                  alt="Talencor Staffing" 
                  className="h-8 w-auto"
                />
              </div>
              <div className="ml-3">
                <div className="text-white font-bold text-lg font-montserrat">TALENCOR</div>
                <div className="text-talencor-gold text-sm font-medium tracking-wide">STAFFING</div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Connecting exceptional talent with outstanding opportunities across Canada. Your trusted partner for all staffing needs.
            </p>
            <div className="flex space-x-4">
              <a 
                href={COMPANY_INFO.socialMedia.linkedin} 
                className="w-12 h-12 bg-gradient-to-r from-talencor-gold to-talencor-orange hover:from-talencor-orange hover:to-talencor-gold rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href={COMPANY_INFO.socialMedia.twitter}
                className="w-12 h-12 bg-gradient-to-r from-talencor-gold to-talencor-orange hover:from-talencor-orange hover:to-talencor-gold rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Twitter size={20} />
              </a>
              <a 
                href={COMPANY_INFO.socialMedia.facebook}
                className="w-12 h-12 bg-gradient-to-r from-talencor-gold to-talencor-orange hover:from-talencor-orange hover:to-talencor-gold rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Facebook size={20} />
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
                    className="text-gray-300 hover:text-talencor-gold transition-colors"
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
                    className="text-gray-300 hover:text-talencor-gold transition-colors"
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
              <a href="#" className="text-gray-300 hover:text-talencor-gold text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-talencor-gold text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-300 hover:text-talencor-gold text-sm transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
