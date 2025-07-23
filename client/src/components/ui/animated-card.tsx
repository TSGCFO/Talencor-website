import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: "lift" | "glow" | "scale" | "tilt";
  loading?: boolean;
  delay?: number;
}

export function AnimatedCard({ 
  children, 
  className, 
  hoverEffect = "lift",
  loading = false,
  delay = 0 
}: AnimatedCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const hoverEffects = {
    lift: "hover:shadow-2xl hover:-translate-y-2",
    glow: "hover:shadow-2xl hover:shadow-talencor-gold/20",
    scale: "hover:scale-105",
    tilt: "hover:rotate-1"
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "transition-all duration-500 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        hoverEffects[hoverEffect],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300",
        loading && "animate-pulse"
      )}>
        {loading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        )}
        
        <CardContent className="relative">
          {children}
        </CardContent>

        {/* Animated border effect */}
        <div className={cn(
          "absolute inset-0 border-2 border-transparent transition-all duration-300",
          isHovered && "border-talencor-gold/50"
        )} />
      </Card>
    </div>
  );
}

export function StaggeredCards({ 
  children, 
  staggerDelay = 100,
  className 
}: { 
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <AnimatedCard 
          key={index}
          delay={index * staggerDelay}
          className="mb-6"
        >
          {child}
        </AnimatedCard>
      ))}
    </div>
  );
}