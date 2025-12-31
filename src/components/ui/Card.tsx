import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'peach' | 'mint' | 'lavender' | 'yellow';
  hover?: boolean;
}

export default function Card({
  className,
  children,
  variant = 'default',
  hover = true,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white',
    peach: 'bg-[#FFEEE8]',
    mint: 'bg-[#E8F5EE]',
    lavender: 'bg-[#EDE8F5]',
    yellow: 'bg-[#FFF8E7]',
  };

  return (
    <div
      className={cn(
        `rounded-2xl p-5 shadow-sm transition-all duration-200`,
        variants[variant],
        hover && 'hover:translate-y-[-4px] hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
