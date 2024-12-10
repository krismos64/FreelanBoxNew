import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '@/animations/loading-spinner.json';

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <div className={`w-24 h-24 ${className}`}>
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};