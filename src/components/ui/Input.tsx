'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="flex items-center gap-2 text-sm font-['Jua'] text-[#333333] mb-2"
          >
            {icon && <span className="text-lg">{icon}</span>}
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              `w-full px-5 py-3.5
              border-2 rounded-2xl
              bg-white
              font-['Gowun_Dodum'] text-base
              text-gray-800
              placeholder:text-gray-400
              transition-all duration-200
              focus:outline-none focus:ring-3 focus:ring-offset-0`,
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 focus:border-orange-300 focus:ring-orange-100',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 flex items-center gap-2 text-sm font-['Gowun_Dodum'] text-red-500">
            <span>⚠️</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
