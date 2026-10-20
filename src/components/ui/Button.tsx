import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', isLoading, children, ...props }, ref) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const loadingClass = isLoading ? 'opacity-70 cursor-not-allowed' : '';

    return (
      <button
        ref={ref}
        className={`${baseClass} ${variantClass} ${loadingClass} ${className}`.trim()}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    );
  }
);
Button.displayName = 'Button';
