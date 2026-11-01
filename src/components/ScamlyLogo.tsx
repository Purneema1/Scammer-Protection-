import React from 'react';

interface ScamlyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'header';
  className?: string;
}

export const ScamlyLogo: React.FC<ScamlyLogoProps> = ({
  size = 'header',
  className = '',
}) => {
  const dimensions = {
    sm: { box: 'w-7 h-7', px: 28 },
    md: { box: 'w-10 h-10', px: 40 },
    header: { box: 'w-10 h-10', px: 40 },
    lg: { box: 'w-16 h-16', px: 64 },
  }[size];

  return (
    <div
      className={`relative flex items-center justify-center ${dimensions.box} rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 p-0.5 shadow-lg shadow-cyan-900/40 group-hover:scale-105 active:scale-95 transition-transform ${className}`}
      title="Scamly"
    >
      <div className="w-full h-full bg-[#080e1a] rounded-[14px] flex items-center justify-center overflow-hidden p-1">
        <svg
          viewBox="0 0 128 128"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="scamlyLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="60%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="scamlyShieldInner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f1d33" />
              <stop offset="100%" stopColor="#060b14" />
            </linearGradient>
          </defs>

          {/* Shield Outline */}
          <path
            d="M64 12 L112 28 C112 74 64 114 64 118 C64 114 16 74 16 28 Z"
            fill="url(#scamlyShieldInner)"
            stroke="url(#scamlyLogoGrad)"
            strokeWidth="6"
            strokeLinejoin="round"
          />

          {/* Cyber Center Grid Line */}
          <path
            d="M64 22 L64 106 M30 54 L98 54 M26 78 L102 78"
            stroke="#06b6d4"
            strokeOpacity="0.25"
            strokeWidth="2.5"
          />

          {/* Stylized Modern "S" for Scamly */}
          <path
            d="M78 40 C74 36 68 34 62 34 C51 34 43 41 43 51 C43 63 56 67 68 71 C79 75 87 80 87 90 C87 101 77 107 63 107 C51 107 43 101 39 93"
            stroke="url(#scamlyLogoGrad)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glowing Beacon Dots */}
          <circle cx="90" cy="38" r="4.5" fill="#34d399" />
          <circle cx="37" cy="94" r="3.5" fill="#22d3ee" />
        </svg>
      </div>

      {/* Online indicator dot */}
      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0b1220] rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
    </div>
  );
};
