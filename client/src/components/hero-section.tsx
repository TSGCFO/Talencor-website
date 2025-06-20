import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-navy to-corporate-blue text-white py-20 lg:py-32">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      ></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div className="mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat mb-6 leading-tight">
              Connecting <span className="text-energetic-orange">Talent</span> with Opportunity
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Professional staffing solutions that drive success for job seekers and employers across Canada
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/job-seekers">
                <Button className="bg-energetic-orange hover:bg-orange-600 text-white px-8 py-6 text-lg font-semibold w-full sm:w-auto">
                  Find Your Next Role
                </Button>
              </Link>
              <Link href="/employers">
                <Button 
                  variant="outline" 
                  className="border-2 border-white hover:bg-white hover:text-navy text-white px-8 py-6 text-lg font-semibold w-full sm:w-auto"
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
