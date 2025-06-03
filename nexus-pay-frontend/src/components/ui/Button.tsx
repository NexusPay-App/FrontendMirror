'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { VariantProps, cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F0B90B] disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        // Yellow button from design
        primary: 'bg-[#F0B90B] text-[#1E2329] hover:bg-[#D29C00]',
        // Dark button from design
        secondary: 'bg-[#1E2329] text-white hover:bg-[#2B3139]',
        // Outlined button
        outline: 'border border-[#EAECEF] bg-transparent hover:bg-[#F8F9FA] text-[#1E2329]',
        // White button
        white: 'bg-white text-[#1E2329] border border-[#EAECEF] hover:bg-[#F8F9FA]',
        // Ghost button
        ghost: 'hover:bg-[#F8F9FA] text-[#707A8A] hover:text-[#1E2329]',
        // Link button
        link: 'text-[#F0B90B] underline-offset-4 hover:underline',
        // Danger button
        danger: 'bg-[#F6465D] text-white hover:bg-[#F6465D]/90',
      },
      size: {
        default: 'h-11 px-4 py-2.5',
        sm: 'h-9 rounded-md px-3 py-2 text-xs',
        lg: 'h-12 px-6 py-3 text-base',
        xl: 'h-14 px-6 py-4 text-base',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants }; 