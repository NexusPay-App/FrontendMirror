'use client';

import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-[#1E2329]"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707A8A]">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              "h-12 w-full rounded-lg border border-[#EAECEF] bg-white px-4 text-base text-[#1E2329] placeholder:text-[#AAAAAA] focus:outline-none focus:ring-1 focus:ring-[#F0B90B] focus:border-[#F0B90B] transition-all",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-[#F6465D] focus:ring-[#F6465D] focus:border-[#F6465D]",
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707A8A]">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p
            className={cn(
              "text-xs",
              error ? "text-[#F6465D]" : "text-[#707A8A]"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input }; 