import React from 'react';

interface LogoIconProps {
  type?: 'pen' | 'book' | 'building' | 'box' | 'geometric';
  className?: string;
  size?: number;
  color?: string;
}

export const LogoIcon: React.FC<LogoIconProps> = ({
  type = 'pen',
  className = 'w-9 h-9',
  size = 36,
  color = '#059669',
}) => {
  switch (type) {
    case 'book':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="48" height="48" rx="12" fill={color} fillOpacity="0.12" />
          <path
            d="M12 16C12 14.8954 12.8954 14 14 14H22C23.1046 14 24 14.8954 24 16V34C24 34 22 32.5 18 32.5C14 32.5 12 34 12 34V16Z"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M36 16C36 14.8954 35.1046 14 34 14H26C24.8954 14 24 14.8954 24 16V34C24 34 26 32.5 30 32.5C34 32.5 36 34 36 34V16Z"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M24 16V33" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="11" r="2.5" fill={color} />
        </svg>
      );

    case 'geometric':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="48" height="48" rx="12" fill={color} fillOpacity="0.12" />
          <path
            d="M24 10L37 17.5V30.5L24 38L11 30.5V17.5L24 10Z"
            stroke={color}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M24 10V24" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M24 24L37 17.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M24 24L11 17.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="24" cy="24" r="3" fill={color} />
        </svg>
      );

    case 'box':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="48" height="48" rx="12" fill={color} fillOpacity="0.12" />
          <path
            d="M13 18L24 12L35 18M13 18L24 24M13 18V31L24 37M35 18L24 24M35 18V31L24 37M24 24V37"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M19 15.5L30 21.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'building':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="48" height="48" rx="12" fill={color} fillOpacity="0.12" />
          <rect x="13" y="14" width="22" height="22" rx="2" stroke={color} strokeWidth="2.5" />
          <path d="M18 19H22" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M26 19H30" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M18 24H22" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M26 24H30" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M21 36V30H27V36" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
      );

    case 'pen':
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <rect width="48" height="48" rx="12" fill={color} fillOpacity="0.12" />
          <path
            d="M29.5 12.5L35.5 18.5L20 34H14V28L29.5 12.5Z"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M26 16L32 22" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M14 34L17.5 30.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="15.5" cy="32.5" r="1" fill={color} />
          <path
            d="M31 32C33 32 35 34 35 36C35 36 32 36.5 30 35"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
};
