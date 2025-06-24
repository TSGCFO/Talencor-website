import { STATISTICS } from "@/lib/constants";

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
            <div key={index} className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-talencor-gold/30">
                <div className="text-4xl md:text-5xl logo-font text-talencor-gold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-white font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
