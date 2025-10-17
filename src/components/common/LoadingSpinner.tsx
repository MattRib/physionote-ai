'use client';

import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '@/../../public/animations/loading-blue.json';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24'
};

/**
 * Componente de loading animado com Lottie
 * Substitui os spinners Loader2 do lucide-react por uma animação mais elegante
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  return (
    <div className={`${sizeMap[size]} ${className}`}>
      <Lottie 
        animationData={loadingAnimation}
        loop={true}
        className="h-full w-full"
      />
    </div>
  );
};

export default LoadingSpinner;
