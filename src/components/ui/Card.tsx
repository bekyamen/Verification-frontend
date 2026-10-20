import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ className = '', glass = false, children, ...props }) => {
  return (
    <div className={`card ${glass ? 'glass' : ''} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};
