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
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="hexagon-pattern h-full w-full"></div>
      </div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-20 sm:h-22 lg:h-24">
          {/* Logo - Responsive Design */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            {/* Mobile Logo (xs to sm) */}
            <div className="sm:hidden flex items-center gap-3">
              <img 
                src="/talencor-logo-new.png" 
                alt="Talencor Staffing Logo" 
                className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/talencor-logo-alt.png';
                  e.currentTarget.onerror = () => {
                    e.currentTarget.src = '/logo-fallback.svg';
                  };
                }}
              />
              <div className="text-talencor-gold group-hover:scale-105 transition-transform duration-300" style={{ fontFamily: 'AmbiguityThrift, sans-serif' }}>
                <div className="text-2xl leading-none">TALENCOR</div>
                <div className="text-sm tracking-[0.3em]">STAFFING</div>
              </div>
            </div>
            
            {/* Tablet Logo (sm to lg) */}
            <div className="hidden sm:flex lg:hidden items-center gap-3">
              <img 
                src="/talencor-logo-new.png" 
                alt="Talencor Staffing Logo" 
                className="h-12 w-auto group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/talencor-logo-alt.png';
                  e.currentTarget.onerror = () => {
                    e.currentTarget.src = '/logo-fallback.svg';
                  };
                }}
              />
              <div className="text-talencor-gold group-hover:scale-105 transition-transform duration-300" style={{ fontFamily: 'AmbiguityThrift, sans-serif' }}>
                <div className="text-3xl leading-none text-center">TALENCOR</div>
                <div className="text-base tracking-[0.3em] text-center">STAFFING</div>
              </div>
            </div>
            
            {/* Desktop Logo (lg and above) */}
            <div className="hidden lg:flex items-center gap-4">
              <img 
                src="/talencor-logo-new.png" 
                alt="Talencor Staffing Logo" 
                className="h-14 w-auto group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/talencor-logo-alt.png';
                  e.currentTarget.onerror = () => {
                    e.currentTarget.src = '/logo-fallback.svg';
                  };
                }}
              />
              <div className="text-talencor-gold group-hover:scale-105 transition-transform duration-300" style={{ fontFamily: 'AmbiguityThrift, sans-serif' }}>
                <div className="text-4xl leading-none">TALENCOR</div>
                <div className="text-lg tracking-[0.3em]">STAFFING</div>
              </div>
            </div>
            

          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg cursor-pointer ${
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
                className={`block px-4 py-3 font-medium rounded-lg transition-all duration-300 cursor-pointer ${
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
