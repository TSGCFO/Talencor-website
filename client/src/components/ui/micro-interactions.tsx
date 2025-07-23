import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  className?: string;
}

export function FloatingActionButton({ 
  children, 
  onClick, 
  position = "bottom-right",
  className 
}: FloatingActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6", 
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, ripple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);
    
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 overflow-hidden",
        "bg-gradient-to-r from-talencor-gold to-talencor-orange",
        "hover:shadow-xl hover:scale-110 active:scale-95",
        "flex items-center justify-center text-white",
        positionClasses[position],
        className
      )}
    >
      <div className={cn(
        "transition-transform duration-200",
        isHovered && "scale-110"
      )}>
        {children}
      </div>
      
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </button>
  );
}

interface MagnetButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  magnetStrength?: number;
}

export function MagnetButton({ 
  children, 
  onClick, 
  className,
  magnetStrength = 20 
}: MagnetButtonProps) {
  const [transform, setTransform] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = Math.max(rect.width, rect.height);
    
    if (distance < maxDistance) {
      const intensity = 1 - distance / maxDistance;
      const moveX = (deltaX / distance) * intensity * magnetStrength;
      const moveY = (deltaY / distance) * intensity * magnetStrength;
      
      setTransform(`translate(${moveX}px, ${moveY}px) scale(1.05)`);
    }
  };

  const handleMouseLeave = () => {
    setTransform("");
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        "transition-all duration-200 ease-out",
        className
      )}
      style={{ transform }}
    >
      {children}
    </button>
  );
}

interface PulseIndicatorProps {
  active?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "gold" | "orange" | "navy";
  className?: string;
}

export function PulseIndicator({ 
  active = true, 
  size = "md", 
  color = "gold",
  className 
}: PulseIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  const colorClasses = {
    gold: "bg-talencor-gold",
    orange: "bg-talencor-orange", 
    navy: "bg-navy"
  };

  if (!active) return null;

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "rounded-full",
        sizeClasses[size],
        colorClasses[color]
      )} />
      <div className={cn(
        "absolute inset-0 rounded-full animate-ping",
        colorClasses[color],
        "opacity-75"
      )} />
    </div>
  );
}

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({ 
  progress, 
  size = 40, 
  strokeWidth = 4,
  className 
}: ProgressRingProps) {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          className="text-talencor-gold transition-all duration-500 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}