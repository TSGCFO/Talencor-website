import { Link } from "wouter";
import { Users, Clock, Handshake, Search, GraduationCap, TrendingUp, ArrowRight, Calculator, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { SERVICES } from "@/lib/constants";

const iconMap = {
  Users,
  Clock,
  Handshake,
  Search,
  GraduationCap,
  TrendingUp,
  Calculator,
  Building,
};

export default function ServicesOverview() {
  return (
    <section className="py-20 bg-gradient-to-br from-light-grey to-white relative overflow-hidden">
      {/* Background hexagonal pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="hexagon-pattern h-full w-full"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-talencor-gold to-talencor-orange bg-clip-text text-transparent mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-talencor-gold to-talencor-orange mx-auto mb-6"></div>
          </div>
          <h2 className="text-4xl md:text-5xl logo-font text-navy mb-6">Our Services</h2>
          <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
            Comprehensive staffing solutions designed to meet the unique needs of modern businesses and career-focused professionals
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap];
            const borderColors = ["border-talencor-gold", "border-talencor-orange", "border-navy"];
            const iconColors = ["text-talencor-gold", "text-talencor-orange", "text-navy"];
            
            return (
              <AnimatedCard 
                key={service.id}
                hoverEffect="lift"
                delay={index * 100}
                className={`border-t-4 ${borderColors[index % 3]} cursor-pointer`}
              >
                <div className="p-8">
                  <div className={`mb-4 ${iconColors[index % 3]}`}>
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-montserrat text-charcoal mb-4">{service.title}</h3>
                  <p className="text-charcoal mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <Link 
                    href={`/services/${service.id}`}
                    className="text-talencor-gold hover:text-charcoal font-semibold font-montserrat inline-flex items-center group transition-colors relative z-10"
                  >
                    Learn More <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
