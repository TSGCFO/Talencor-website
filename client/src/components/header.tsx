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
    <header className="bg-gradient-to-r from-navy via-charcoal to-navy shadow-xl sticky top-0 z-50 border-b-4 border-talencor-gold">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <div className="bg-white rounded-lg p-2 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-talencor-gold">
              <img 
                src="/attached_assets/Talencor Staffing 1_1750449443470.jpg" 
                alt="Talencor Staffing" 
                className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="ml-3 hidden sm:block">
              <div className="text-white font-bold text-xl font-montserrat">TALENCOR</div>
              <div className="text-talencor-gold text-sm font-medium tracking-wide">STAFFING</div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                    isActive(item.href)
                      ? "text-talencor-gold bg-white/10 font-semibold"
                      : "text-white hover:text-talencor-gold hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-talencor-gold to-talencor-orange hover:from-talencor-orange hover:to-talencor-gold text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
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
