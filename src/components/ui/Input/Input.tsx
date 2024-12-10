import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { InputProps } from './types';

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, label, error, multiline = false, rows = 3, ...props }, ref) => {
    const inputClasses = twMerge(
      clsx(
        'block w-full rounded-lg shadow-sm sm:text-sm transition-colors duration-200',
        'border-gray-300 dark:border-gray-600',
        'bg-white dark:bg-gray-700',
        'text-gray-900 dark:text-white',
        'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
        'placeholder-gray-400 dark:placeholder-gray-500',
        error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
        className
      )
    );

    const inputProps = { ...props };
    delete inputProps.multiline; // Supprime l'attribut multiline des props

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        {multiline ? (
          <textarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            rows={rows}
            className={inputClasses}
            {...inputProps}
          />
        ) : (
          <input
            ref={ref as React.RefObject<HTMLInputElement>}
            className={inputClasses}
            {...inputProps}
          />
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';