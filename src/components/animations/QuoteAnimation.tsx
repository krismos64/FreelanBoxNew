import React from 'react';
import Lottie from 'lottie-react';
import quoteAnimation from '@/animations/quote.json';

interface QuoteAnimationProps {
  className?: string;
}

export const QuoteAnimation: React.FC<QuoteAnimationProps> = ({ className }) => {
  return (
    <div className={`w-64 h-64 ${className}`}>
      <Lottie
        animationData={quoteAnimation}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};