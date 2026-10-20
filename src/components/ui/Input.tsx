import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className={`form-group ${className}`.trim()}>
        {label && <label className="form-label">{label}</label>}
        <input
          ref={ref}
          className={`input ${error ? 'border-red-500 focus:border-red-500' : ''}`}
          {...props}
        />
        {error && <span className="error-text">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
