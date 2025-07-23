import { Clock, DollarSign, Zap, Shield, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BENEFITS } from "@/lib/constants";

const iconMap = {
  Clock,
  DollarSign,
  Zap,
  Shield,
  Heart,
};

export default function BenefitsSection() {
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
          <h2 className="text-4xl md:text-5xl logo-font text-navy mb-6">
            With so much to gain, we position our clients for <span className="text-talencor-gold">win-win</span> situations
          </h2>
          <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
            Our comprehensive approach saves you time, money, and provides the flexibility you need to succeed
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon as keyof typeof iconMap];
            const borderColors = ["border-talencor-gold", "border-talencor-orange", "border-navy"];
            const iconColors = ["text-talencor-gold", "text-talencor-orange", "text-navy"];
            
            return (
              <Card 
                key={benefit.title}
                className={`hover:shadow-xl transition-shadow border-t-4 ${borderColors[index % 3]}`}
              >
                <CardContent className="p-8">
                  <div className={`mb-4 ${iconColors[index % 3]}`}>
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-montserrat text-charcoal mb-4">{benefit.title}</h3>
                  <p className="text-charcoal leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Promise Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-navy to-charcoal rounded-2xl p-8 text-white">
          <h3 className="text-3xl font-bold font-montserrat mb-4">Our Promise</h3>
          <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Our clients can rest assured Talencor will provide the right people the first time – this is our promise. 
            Our Staffing Operations team continuously recruits new talent to join your team.
          </p>
        </div>
      </div>
    </section>
  );
}