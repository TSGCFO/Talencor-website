import { Link } from "wouter";
import { Users, Clock, Handshake, Search, GraduationCap, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SERVICES } from "@/lib/constants";

const iconMap = {
  Users,
  Clock,
  Handshake,
  Search,
  GraduationCap,
  TrendingUp,
};

export default function ServicesOverview() {
  return (
    <section className="py-20 bg-light-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-charcoal mb-6">Our Services</h2>
          <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
            Comprehensive staffing solutions designed to meet the unique needs of modern businesses and career-focused professionals
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap];
            const borderColors = ["border-talencor-gold", "border-talencor-orange", "border-charcoal"];
            const iconColors = ["text-talencor-gold", "text-talencor-orange", "text-charcoal"];
            
            return (
              <Card 
                key={service.id}
                className={`hover:shadow-xl transition-shadow border-t-4 ${borderColors[index % 3]}`}
              >
                <CardContent className="p-8">
                  <div className={`mb-4 ${iconColors[index % 3]}`}>
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-montserrat text-charcoal mb-4">{service.title}</h3>
                  <p className="text-charcoal mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <Link href="/contact">
                    <span className="text-talencor-gold hover:text-charcoal font-semibold font-montserrat cursor-pointer inline-flex items-center">
                      Learn More <ArrowRight size={16} className="ml-1" />
                    </span>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
