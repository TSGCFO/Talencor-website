import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  loading: boolean;
  children: React.ReactNode;
  minLoadTime?: number;
  fallback?: React.ReactNode;
}

export function PageLoader({ 
  loading, 
  children, 
  minLoadTime = 500,
  fallback 
}: PageLoaderProps) {
  const [showLoader, setShowLoader] = useState(loading);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShowLoader(false), 300);
      }, minLoadTime);
      
      return () => clearTimeout(timer);
    } else {
      setShowLoader(true);
      setFadeOut(false);
    }
  }, [loading, minLoadTime]);

  if (showLoader) {
    return (
      <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-300",
        fadeOut && "opacity-0"
      )}>
        {fallback || <DefaultLoader />}
      </div>
    );
  }

  return <>{children}</>;
}

function DefaultLoader() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <LoadingSpinner size="lg" variant="primary" />
        <div className="absolute inset-0 animate-ping">
          <LoadingSpinner size="lg" variant="primary" className="opacity-30" />
        </div>
      </div>
      <div className="text-navy font-montserrat font-semibold">
        Loading...
      </div>
    </div>
  );
}

export function ContentLoader({ 
  loading, 
  children, 
  skeleton,
  className 
}: {
  loading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {loading ? (
        <div className="animate-pulse">
          {skeleton || <DefaultSkeleton />}
        </div>
      ) : (
        <div className="animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}

function DefaultSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}