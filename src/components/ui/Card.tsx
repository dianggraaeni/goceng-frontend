import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { y: -4 } : undefined}
        className={cn(
          "bg-surface rounded-3xl border-2 border-orange-100 shadow-soft p-6",
          hoverable && "transition-shadow hover:shadow-soft-hover cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
