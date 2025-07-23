import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Play, Plus, Heart, Star, ArrowRight, Download } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinner, PulseLoader, SkeletonLoader } from "@/components/ui/loading-spinner";
import { AnimatedCounter, AnimatedStatCard } from "@/components/ui/animated-stats";
import { FloatingActionButton, MagnetButton, PulseIndicator, ProgressRing } from "@/components/ui/micro-interactions";
import { Card, CardContent } from "@/components/ui/card";

export default function Demo() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateLoading = async () => {
    setLoading(true);
    setProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setLoading(false);
  };

  const demoStats = [
    { value: "250+", label: "Happy Clients" },
    { value: "1000+", label: "Jobs Placed" },
    { value: "95%", label: "Success Rate" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <>
      <Helmet>
        <title>Animation Demo - Talencor Staffing</title>
        <meta name="description" content="Demonstration of animated loading states and micro-interactions" />
      </Helmet>

      <section className="py-20 bg-gradient-to-br from-light-grey to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl logo-font text-navy mb-6">
              Animation & Interaction Demo
            </h1>
            <p className="text-xl text-charcoal max-w-3xl mx-auto leading-relaxed">
              Experience our enhanced user interface with smooth animations and engaging micro-interactions
            </p>
          </div>

          {/* Animated Buttons Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold font-montserrat text-charcoal mb-8 text-center">
              Animated Buttons
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedButton
                onClick={simulateLoading}
                loading={loading}
                loadingText="Processing..."
                successText="Success!"
                className="bg-talencor-gold hover:bg-talencor-orange text-white"
              >
                Standard Button
              </AnimatedButton>

              <AnimatedButton
                onClick={async () => {
                  await new Promise(resolve => setTimeout(resolve, 1500));
                }}
                variant="outline"
                successText="Downloaded!"
                className="border-talencor-gold text-talencor-gold hover:bg-talencor-gold hover:text-white"
              >
                <Download size={16} className="mr-2" />
                Download
              </AnimatedButton>

              <MagnetButton
                onClick={() => alert("Magnet effect!")}
                className="bg-gradient-to-r from-talencor-gold to-talencor-orange text-white px-6 py-3 rounded-lg font-semibold"
              >
                <Star size={16} className="mr-2" />
                Magnet Button
              </MagnetButton>

              <AnimatedButton
                onClick={async () => {
                  await new Promise(resolve => setTimeout(resolve, 2000));
                }}
                loadingText="Saving..."
                successText="Saved!"
                className="bg-navy hover:bg-charcoal text-white"
              >
                <Heart size={16} className="mr-2" />
                Save
              </AnimatedButton>
            </div>
          </div>

          {/* Loading States Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold font-montserrat text-charcoal mb-8 text-center">
              Loading States
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-4">Spinner</h3>
                  <div className="flex justify-center space-x-4 mb-4">
                    <LoadingSpinner size="sm" variant="primary" />
                    <LoadingSpinner size="md" variant="secondary" />
                    <LoadingSpinner size="lg" variant="primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-4">Pulse Loader</h3>
                  <div className="flex justify-center mb-4">
                    <PulseLoader />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Skeleton Loader</h3>
                  <SkeletonLoader lines={4} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Animated Cards Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold font-montserrat text-charcoal mb-8 text-center">
              Animated Cards
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {["lift", "glow", "scale"].map((effect, index) => (
                <AnimatedCard 
                  key={effect}
                  hoverEffect={effect as any}
                  delay={index * 200}
                >
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-talencor-gold rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold font-montserrat text-charcoal mb-2">
                      {effect.charAt(0).toUpperCase() + effect.slice(1)} Effect
                    </h3>
                    <p className="text-charcoal">
                      Hover to see the {effect} animation effect in action
                    </p>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>

          {/* Animated Statistics */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold font-montserrat text-charcoal mb-8 text-center">
              Animated Statistics
            </h2>
            <div className="bg-gradient-to-r from-navy via-charcoal to-navy rounded-2xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {demoStats.map((stat, index) => (
                  <AnimatedStatCard
                    key={index}
                    value={stat.value}
                    label={stat.label}
                    delay={index * 300}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Micro-interactions */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold font-montserrat text-charcoal mb-8 text-center">
              Micro-interactions
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-4">Progress Ring</h3>
                  <div className="flex justify-center mb-4">
                    <ProgressRing progress={progress} size={60} />
                  </div>
                  <button
                    onClick={simulateLoading}
                    className="text-talencor-gold hover:text-talencor-orange font-semibold"
                  >
                    Start Progress
                  </button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-4">Pulse Indicators</h3>
                  <div className="flex justify-center space-x-4 mb-4">
                    <PulseIndicator color="gold" size="sm" />
                    <PulseIndicator color="orange" size="md" />
                    <PulseIndicator color="navy" size="lg" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold mb-4">Animated Counter</h3>
                  <div className="text-3xl font-bold text-talencor-gold mb-4">
                    <AnimatedCounter end={1250} suffix="+" duration={2000} />
                  </div>
                  <p className="text-charcoal">Clients Served</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Floating Action Button */}
          <FloatingActionButton 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            position="bottom-right"
          >
            <ArrowRight className="rotate-[-90deg]" size={20} />
          </FloatingActionButton>

          {/* Navigation Back */}
          <div className="text-center">
            <AnimatedButton
              onClick={() => window.history.back()}
              variant="outline" 
              className="border-talencor-gold text-talencor-gold hover:bg-talencor-gold hover:text-white"
            >
              <ArrowRight className="rotate-180 mr-2" size={16} />
              Back to Website
            </AnimatedButton>
          </div>
        </div>
      </section>
    </>
  );
}