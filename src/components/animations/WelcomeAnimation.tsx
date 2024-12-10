import React from 'react';
import Lottie from 'lottie-react';
import welcomeAnimation from '@/animations/welcome.json';

interface WelcomeAnimationProps {
  className?: string;
}

export const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ className }) => {
  return (
    <div className={`animate-fade-in ${className}`}>
      <Lottie
        animationData={welcomeAnimation}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};