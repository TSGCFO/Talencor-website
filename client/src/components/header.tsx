import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Job Seekers", href: "/job-seekers" },
    { name: "Employers", href: "/employers" },
    { name: "About", href: "/about" },
    { name: "Apply Now", href: "/apply" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-gradient-to-r from-navy via-charcoal to-navy shadow-2xl sticky top-0 z-50 border-b-4 border-talencor-gold relative">
      {/* Subtle hexagonal pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="hexagon-pattern h-full w-full"></div>
      </div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20 sm:h-22 lg:h-24">
          {/* Logo - Responsive Design */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            {/* Mobile Logo (xs to sm) */}
            <div className="sm:hidden bg-white rounded-lg p-2 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-talencor-gold group-hover:border-talencor-orange">
              <img 
                src="/talencor-logo-alt.png" 
                alt="Talencor Staffing" 
                className="h-8 w-auto group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/talencor-logo-backup.png';
                  e.currentTarget.onerror = () => {
                    e.currentTarget.src = '/logo-fallback.svg';
                  };
                }}
              />
            </div>
            
            {/* Tablet Logo (sm to lg) */}
            <div className="hidden sm:block lg:hidden bg-white rounded-lg p-2.5 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-talencor-gold group-hover:border-talencor-orange">
              <img 
                src="/talencor-logo-alt.png" 
                alt="Talencor Staffing" 
                className="h-9 w-auto group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/talencor-logo-backup.png';
                  e.currentTarget.onerror = () => {
                    e.currentTarget.src = '/logo-fallback.svg';
                  };
                }}
              />
            </div>
            
            {/* Desktop Logo (lg and above) */}
            <div className="hidden lg:block bg-white rounded-lg p-3 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-talencor-gold group-hover:border-talencor-orange">
              <img 
                src="/talencor-logo-alt.png" 
                alt="Talencor Staffing" 
                className="h-12 w-auto group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/talencor-logo-backup.png';
                  e.currentTarget.onerror = () => {
                    e.currentTarget.src = '/logo-fallback.svg';
                  };
                }}
              />
            </div>
            
            {/* Brand Text - Responsive Typography */}
            <div className="ml-3 sm:ml-4 hidden xs:block">
              <div className="text-white logo-font text-lg sm:text-xl lg:text-2xl tracking-wider">TALENCOR</div>
              <div className="text-talencor-gold brand-text text-xs sm:text-xs lg:text-sm tracking-[0.2em]">STAFFING</div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg ${
                    isActive(item.href)
                      ? "text-talencor-gold bg-white/10 font-semibold"
                      : "text-white hover:text-talencor-gold hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-talencor-gold to-talencor-orange hover:from-talencor-orange hover:to-talencor-gold text-white font-bold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 tracking-wide">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-talencor-gold hover:bg-white/10"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-navy to-charcoal border-t border-talencor-gold">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 font-medium rounded-lg transition-all duration-300 ${
                  isActive(item.href)
                    ? "text-talencor-gold bg-white/10 font-semibold"
                    : "text-white hover:text-talencor-gold hover:bg-white/10"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button className="bg-gradient-to-r from-talencor-gold to-talencor-orange hover:from-talencor-orange hover:to-talencor-gold text-white mx-3 w-[calc(100%-1.5rem)] mt-3 font-semibold shadow-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
