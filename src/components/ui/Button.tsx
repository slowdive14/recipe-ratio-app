'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', icon, children, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-['Jua'] rounded-xl
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      hover:translate-y-[-2px] hover:shadow-md
      active:translate-y-0
      shadow-sm
    `;

    const variants = {
      primary: `
        bg-[#FFEEE8] text-[#E67E22]
        hover:bg-[#FFD4C4]
        focus:ring-[#FFEEE8]
      `,
      secondary: `
        bg-[#E8F5EE] text-[#27AE60]
        hover:bg-[#C5E8D4]
        focus:ring-[#E8F5EE]
      `,
      accent: `
        bg-[#EDE8F5] text-[#8E44AD]
        hover:bg-[#D8CFF0]
        focus:ring-[#EDE8F5]
      `,
      danger: `
        bg-[#FDEDEC] text-[#E74C3C]
        hover:bg-[#FADBD8]
        focus:ring-[#FDEDEC]
      `,
      ghost: `
        bg-white text-[#666666]
        border-2 border-gray-200
        hover:bg-[#F5F6FA] hover:border-gray-300
        shadow-none
        focus:ring-gray-200
      `,
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
