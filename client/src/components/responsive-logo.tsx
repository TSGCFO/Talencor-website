import { useState } from 'react';

interface ResponsiveLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'header' | 'footer' | 'standalone';
}

export default function ResponsiveLogo({ 
  className = '', 
  showText = true, 
  size = 'md',
  variant = 'header' 
}: ResponsiveLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const sizeClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9 lg:h-10',
    lg: 'h-10 sm:h-11 lg:h-12',
    xl: 'h-12 sm:h-14 lg:h-16'
  };

  const containerPadding = {
    sm: 'p-1.5 sm:p-2',
    md: 'p-2 sm:p-2.5 lg:p-3',
    lg: 'p-2.5 sm:p-3 lg:p-4',
    xl: 'p-3 sm:p-4 lg:p-5'
  };

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg lg:text-xl',
    lg: 'text-lg sm:text-xl lg:text-2xl',
    xl: 'text-xl sm:text-2xl lg:text-3xl'
  };

  const subtextSizes = {
    sm: 'text-xs',
    md: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base',
    xl: 'text-base sm:text-lg'
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    } else if (!fallbackError) {
      setFallbackError(true);
    }
  };

  const getImageSrc = () => {
    if (!imageError) return '/talencor-logo-alt.png';
    if (!fallbackError) return '/talencor-logo-backup.png';
    return '/logo-fallback.svg';
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`bg-white rounded-lg shadow-lg border-2 border-talencor-gold hover:border-talencor-orange hover:shadow-xl transition-all duration-300 logo-container ${containerPadding[size]}`}>
        <img 
          src={getImageSrc()}
          alt="Talencor Staffing" 
          className={`${sizeClasses[size]} w-auto hover:scale-105 transition-transform duration-300`}
          onError={handleImageError}
        />
      </div>
      
      {showText && (
        <div className="ml-3 sm:ml-4 hidden xs:block">
          <div className={`text-white logo-font tracking-wider ${textSizes[size]} ${variant === 'footer' ? 'text-white' : 'text-white'}`}>
            TALENCOR
          </div>
          <div className={`text-talencor-gold brand-text tracking-[0.2em] ${subtextSizes[size]}`}>
            STAFFING
          </div>
        </div>
      )}
    </div>
  );
}