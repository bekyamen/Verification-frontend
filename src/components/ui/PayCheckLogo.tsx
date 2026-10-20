import React from 'react';

interface PayCheckLogoProps {
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export function PayCheckLogo({
  orientation = 'vertical',
  size = 'md',
  className = '',
  showText = true,
}: PayCheckLogoProps) {
  // Dimension definitions
  const dimensions = {
    sm: { iconSize: 32, fontSize: '1.125rem' },
    md: { iconSize: 44, fontSize: '1.45rem' },
    lg: { iconSize: 56, fontSize: '1.75rem' },
  }[size];

  return (
    <div
      className={`paycheck-logo ${orientation === 'vertical' ? 'paycheck-logo-vertical' : 'paycheck-logo-horizontal'} ${className}`.trim()}
      style={{
        display: 'inline-flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: orientation === 'vertical' ? '0.75rem' : '0.625rem',
        textDecoration: 'none',
      }}
    >
      {/* Dynamic cyclic exchange icon matching the provided mockup */}
      <div
        className="paycheck-logo-icon-wrap"
        style={{
          width: dimensions.iconSize,
          height: dimensions.iconSize,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 2px 8px rgba(37, 99, 235, 0.2))',
          transition: 'transform 0.3s ease',
        }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <linearGradient id="payCheckBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="payCheckAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Top Loop / Arrow Ribbon */}
          <path
            d="M24 6C31.5 6 38 11.5 38 18C38 21.5 35.8 24.3 32.5 25.8C30.2 26.8 28 26.5 25 24.5C21 21.8 17.5 20.8 14 22.5L16.2 18.5C18.5 14.5 20 12 24 9.5L24 6Z"
            fill="url(#payCheckBlueGrad)"
            opacity="0.1"
          />
          <path
            d="M32 7.5L37 13.5M37 13.5L31 18.5M37 13.5C36 10 32 6.5 25 6.5C16.5 6.5 11 12.5 11 19.5C11 25.5 16 28 20 29.5"
            stroke="url(#payCheckBlueGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bottom Loop / Arrow Ribbon */}
          <path
            d="M16 40.5L11 34.5M11 34.5L17 29.5M11 34.5C12 38 16 41.5 23 41.5C31.5 41.5 37 35.5 37 28.5C37 22.5 32 20 28 18.5"
            stroke="url(#payCheckBlueGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Center Amber Golden Core Dot */}
          <circle
            cx="24"
            cy="24"
            r="4.5"
            fill="url(#payCheckAmberGrad)"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>
      </div>

      {showText && (
        <div
          className="paycheck-logo-text"
          style={{
            fontSize: dimensions.fontSize,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          <span style={{ color: '#0F172A' }}>Pay</span>
          <span style={{ color: '#2563EB' }}>Check</span>
        </div>
      )}
    </div>
  );
}
export default PayCheckLogo;
