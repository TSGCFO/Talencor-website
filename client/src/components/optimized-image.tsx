import React, { useState, useRef, useEffect } from "react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  className?: string;
  fallback?: string;
  webp?: boolean;
  avif?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 85,
  className = "",
  fallback,
  webp = true,
  avif = true,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before the image comes into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Generate optimized image sources
  useEffect(() => {
    if (!isInView) return;

    const generateOptimizedSrc = (originalSrc: string) => {
      // If it's already an optimized URL or external URL, use as-is
      if (originalSrc.includes('http') || originalSrc.includes('data:')) {
        return originalSrc;
      }

      // For local images, apply optimization parameters
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      if (quality !== 85) params.set('q', quality.toString());

      const paramString = params.toString();
      return paramString ? `${originalSrc}?${paramString}` : originalSrc;
    };

    setImageSrc(generateOptimizedSrc(src));
  }, [src, width, height, quality, isInView]);

  // WebP/AVIF support detection
  const supportedFormats = {
    webp: typeof window !== 'undefined' && 
          document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0,
    avif: typeof window !== 'undefined' && 
          document.createElement('canvas').toDataURL('image/avif').indexOf('data:image/avif') === 0
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    if (fallback) {
      setImageSrc(fallback);
      setHasError(false);
    }
  };

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    if (!width) return undefined;
    
    const breakpoints = [640, 768, 1024, 1280, 1536];
    const applicableBreakpoints = breakpoints.filter(bp => bp <= width * 2);
    
    return applicableBreakpoints
      .map(bp => `${imageSrc.replace(/w=\d+/, `w=${bp}`)} ${bp}w`)
      .join(', ');
  };

  // Generate sizes attribute
  const generateSizes = () => {
    if (!width) return undefined;
    
    return `(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, ${width}px`;
  };

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {/* Placeholder while loading */}
      {!isLoaded && isInView && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ 
            aspectRatio: width && height ? `${width}/${height}` : 'auto'
          }}
        />
      )}
      
      {/* Main image */}
      {isInView && (
        <picture>
          {/* AVIF format for modern browsers */}
          {avif && supportedFormats.avif && (
            <source 
              srcSet={imageSrc.replace(/\.(jpg|jpeg|png|webp)/, '.avif')}
              type="image/avif"
            />
          )}
          
          {/* WebP format for supported browsers */}
          {webp && supportedFormats.webp && (
            <source 
              srcSet={imageSrc.replace(/\.(jpg|jpeg|png)/, '.webp')}
              type="image/webp"
            />
          )}
          
          {/* Fallback image */}
          <img
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            srcSet={generateSrcSet()}
            sizes={generateSizes()}
            onLoad={handleLoad}
            onError={handleError}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${hasError ? 'opacity-50' : ''}`}
            {...props}
          />
        </picture>
      )}
      
      {/* Error state */}
      {hasError && !fallback && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          Image not available
        </div>
      )}
    </div>
  );
}