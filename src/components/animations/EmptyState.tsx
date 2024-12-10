import React from 'react';
import Lottie from 'lottie-react';
import emptyAnimation from '@/animations/empty-state.json';

interface EmptyStateProps {
  message: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, className }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="w-64 h-64">
        <Lottie
          animationData={emptyAnimation}
          loop={true}
          autoplay={true}
        />
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
        {message}
      </p>
    </div>
  );
};