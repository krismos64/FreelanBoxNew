import React from 'react';
import { Button } from './Button';

interface PageHeaderProps {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h1>
      {buttonText && (
        <Button 
          onClick={onButtonClick}
          variant="gradient"
          className="w-full sm:w-auto"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};