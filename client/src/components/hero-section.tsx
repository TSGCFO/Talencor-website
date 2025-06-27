import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-navy via-charcoal to-navy text-white py-20 lg:py-32 border-b-4 border-talencor-gold">
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      ></div>
      {/* Hexagonal pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="hexagon-pattern h-full w-full"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div className="mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl logo-font mb-6 leading-tight">
              Aiming to Build <span className="text-talencor-gold">Long-Lasting</span> Relationships
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Our business model adapts to your company's need. We provide reliable help without any boundaries, 24-hours a day, seven-days a week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/job-seekers">
                <Button className="gradient-button text-white px-8 py-6 text-lg font-semibold w-full sm:w-auto border border-white/20">
                  Find Your Next Role
                </Button>
              </Link>
              <Link href="/employers">
                <Button 
                  variant="outline" 
                  className="border-2 border-talencor-gold hover:bg-talencor-gold hover:text-navy text-talencor-gold px-8 py-6 text-lg font-semibold w-full sm:w-auto backdrop-blur-sm bg-white/10"
                >
                  Hire Top Talent
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Professional team meeting" 
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
