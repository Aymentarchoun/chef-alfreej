import React from 'react';

const ArabesquePattern = ({
  className = '',
  opacity = 0.07,
  color = 'currentColor',
}) => (
  <svg
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity, color }}
  >
    <defs>
      <pattern
        id="arabesque-tile"
        x="0"
        y="0"
        width="80"
        height="80"
        patternUnits="userSpaceOnUse"
      >
        {/* 8-pointed star */}
        <polygon
          points="40,12 44.6,28.9 59.8,20.2 51.1,35.4 68,40 51.1,44.6 59.8,59.8 44.6,51.1 40,68 35.4,51.1 20.2,59.8 28.9,44.6 12,40 28.9,35.4 20.2,20.2 35.4,28.9"
          fill="none"
          stroke={color}
          strokeWidth="0.8"
        />
        {/* Small center diamond */}
        <polygon
          points="40,33 47,40 40,47 33,40"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
        />
        {/* Corner quarter stars */}
        <polygon
          points="0,4.6 4.6,0 8,7 4.6,8 0,4.6"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
        />
        <polygon
          points="80,4.6 75.4,0 72,7 75.4,8 80,4.6"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
        />
        <polygon
          points="0,75.4 4.6,80 8,73 4.6,72 0,75.4"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
        />
        <polygon
          points="80,75.4 75.4,80 72,73 75.4,72 80,75.4"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
        />
        {/* Connecting lines to edges */}
        <line x1="40" y1="0" x2="40" y2="12" stroke={color} strokeWidth="0.4" />
        <line x1="80" y1="40" x2="68" y2="40" stroke={color} strokeWidth="0.4" />
        <line x1="40" y1="80" x2="40" y2="68" stroke={color} strokeWidth="0.4" />
        <line x1="0"  y1="40" x2="12" y2="40" stroke={color} strokeWidth="0.4" />
        {/* Diagonal connectors */}
        <line x1="0"  y1="0"  x2="8"  y2="8"  stroke={color} strokeWidth="0.3" strokeDasharray="2 2" />
        <line x1="80" y1="0"  x2="72" y2="8"  stroke={color} strokeWidth="0.3" strokeDasharray="2 2" />
        <line x1="0"  y1="80" x2="8"  y2="72" stroke={color} strokeWidth="0.3" strokeDasharray="2 2" />
        <line x1="80" y1="80" x2="72" y2="72" stroke={color} strokeWidth="0.3" strokeDasharray="2 2" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#arabesque-tile)" />
  </svg>
);

export default ArabesquePattern;
