import React from 'react';
import Lottie from 'lottie-react';
import successAnimation from '@/animations/success.json';

interface SuccessAnimationProps {
  className?: string;
  onComplete?: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
  className,
  onComplete 
}) => {
  return (
    <div className={`w-24 h-24 ${className}`}>
      <Lottie
        animationData={successAnimation}
        loop={false}
        autoplay={true}
        onComplete={onComplete}
      />
    </div>
  );
};