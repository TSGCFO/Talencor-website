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
    { name: "Recruiting", href: "/services/recruiting" },
    { name: "Training", href: "/services/training" }, 
    { name: "Payroll & Administration", href: "/services/payroll-administration" },
    { name: "Labour & Human Relations", href: "/services/labour-relations" },
    { name: "Full-time Placements", href: "/services/full-time-placements" },
    { name: "Consulting", href: "/services/consulting" }
  ];

  return (
    <footer className="bg-gradient-to-br from-navy via-charcoal to-navy text-white py-16 border-t-4 border-talencor-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 sm:gap-4 mb-6">
              {/* Footer Logo - Responsive Sizing */}
              <img 
                src="/talencor-logo-new.png" 
                alt="Talencor Staffing Logo" 
                className="h-10 sm:h-12 lg:h-14 w-auto transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/talencor-logo-alt.png';
                  e.currentTarget.onerror = () => {
                    e.currentTarget.src = '/logo-fallback.svg';
                  };
                }}
              />
              <div className="text-talencor-gold" style={{ fontFamily: 'AmbiguityThrift, sans-serif' }}>
                <div className="text-2xl sm:text-3xl lg:text-4xl leading-none">TALENCOR</div>
                <div className="text-sm sm:text-base lg:text-lg tracking-[0.3em]">STAFFING</div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Talencor Staffing is a dedicated company our customers can trust and rely on. Our business model adapts to your company's needs.
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
                <li key={service.name}>
                  <Link 
                    href={service.href}
                    className="text-gray-300 hover:text-talencor-gold transition-colors"
                  >
                    {service.name}
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
              <Link to="/contact" className="text-gray-300 hover:text-talencor-gold text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-talencor-gold text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-talencor-gold text-sm transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
