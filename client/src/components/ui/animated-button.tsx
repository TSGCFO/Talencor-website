import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  loadingText?: string;
  successText?: string;
  successDuration?: number;
}

export function AnimatedButton({
  children,
  onClick,
  loading: externalLoading = false,
  disabled = false,
  variant = "default",
  size = "default",
  className,
  loadingText,
  successText,
  successDuration = 2000,
  ...props
}: AnimatedButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const isLoading = externalLoading || internalLoading;
  
  const handleClick = async () => {
    if (!onClick || isLoading || disabled) return;
    
    try {
      setInternalLoading(true);
      const result = onClick();
      
      if (result instanceof Promise) {
        await result;
      }
      
      if (successText) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), successDuration);
      }
    } catch (error) {
      console.error('Button action failed:', error);
    } finally {
      setInternalLoading(false);
    }
  };

  const displayText = showSuccess ? successText : (isLoading && loadingText) ? loadingText : children;

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={cn(
        "relative transition-all duration-300 transform hover:scale-105 active:scale-95",
        "hover:shadow-lg active:shadow-md",
        showSuccess && "bg-green-500 hover:bg-green-600",
        className
      )}
      {...props}
    >
      <span className={cn(
        "flex items-center justify-center transition-opacity duration-200",
        isLoading && "opacity-0"
      )}>
        {displayText}
      </span>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner 
            size="sm" 
            variant={variant === "outline" ? "primary" : "white"} 
          />
        </div>
      )}
    </Button>
  );
}