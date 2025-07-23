import { STATISTICS } from "@/lib/constants";
import { AnimatedStatCard } from "@/components/ui/animated-stats";

export default function StatisticsSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-navy via-charcoal to-navy relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="hexagon-pattern h-full w-full"></div>
      </div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-talencor-gold to-talencor-orange"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-talencor-orange to-talencor-gold"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATISTICS.map((stat, index) => (
            <AnimatedStatCard
              key={index}
              value={stat.value}
              label={stat.label}
              delay={index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
