import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "white";
  className?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  variant = "primary", 
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const variantClasses = {
    primary: "text-talencor-gold",
    secondary: "text-navy",
    white: "text-white"
  };

  return (
    <div className={cn("animate-spin", sizeClasses[size], variantClasses[variant], className)}>
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

export function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-talencor-gold rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonLoader({ 
  className,
  lines = 3 
}: { 
  className?: string;
  lines?: number;
}) {
  return (
    <div className={cn("animate-pulse space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded"
          style={{
            width: i === lines - 1 ? '60%' : '100%'
          }}
        />
      ))}
    </div>
  );
}