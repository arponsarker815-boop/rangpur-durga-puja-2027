import React from 'react';

// Rotating Sacred Circular Alpona Mandala (চক্রাকার পদ্ম আলপনা)
export const CircularAlponaMandala: React.FC<{
  size?: number;
  className?: string;
  animate?: boolean;
}> = ({ size = 260, className = '', animate = true }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      className={`select-none pointer-events-none ${animate ? 'animate-spin-very-slow' : ''} ${className}`}
    >
      <defs>
        <radialGradient id="alponaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="80%" stopColor="#fef08a" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Central Radiating Core */}
      <circle cx="120" cy="120" r="18" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
      <circle cx="120" cy="120" r="6" fill="#f59e0b" />

      {/* 8 Inner Lotus Petals (পদ্মদল) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <g key={i} transform={`rotate(${angle} 120 120)`}>
            <path
              d="M 120 102 C 112 85, 128 85, 120 102 Z"
              fill="#ffffff"
              stroke="#ca8a04"
              strokeWidth="1.2"
              opacity="0.9"
            />
            <circle cx="120" cy="92" r="2.2" fill="#dc2626" />
          </g>
        );
      })}

      {/* Ring 2: Concentric dots and scalloped wave */}
      <circle cx="120" cy="120" r="38" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
      <circle cx="120" cy="120" r="44" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.85" />

      {/* 16 Radiating Bengali Kalka Petals (কলকা পাপড়ি) */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        return (
          <g key={i} transform={`rotate(${angle} 120 120)`}>
            <path
              d="M 120 76 Q 128 58 120 48 Q 112 58 120 76 Z"
              fill="#ffffff"
              stroke="#b45309"
              strokeWidth="1"
              opacity="0.85"
            />
            <circle cx="120" cy="54" r="2.5" fill="#f59e0b" />
            <circle cx="120" cy="42" r="1.5" fill="#ffffff" />
          </g>
        );
      })}

      {/* Outer Scallop Shell & Shankha Motifs */}
      <circle cx="120" cy="120" r="82" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.9" />
      <circle cx="120" cy="120" r="88" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 4" opacity="0.8" />

      {/* 24 Outer Teardrop Points */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        return (
          <g key={i} transform={`rotate(${angle} 120 120)`}>
            <path
              d="M 120 32 Q 125 22 120 16 Q 115 22 120 32 Z"
              fill="#ffffff"
              stroke="#ca8a04"
              strokeWidth="1"
            />
            <circle cx="120" cy="12" r="2" fill="#ef4444" />
          </g>
        );
      })}
    </svg>
  );
};

// Bengali Festive Kalka Motif (ঐতিহ্যবাহী ময়ূর বা পদ্ম কলকা নকশা)
export const BengaliKalkaNoksha: React.FC<{
  size?: number;
  className?: string;
  flipped?: boolean;
}> = ({ size = 100, className = '', flipped = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      className={`select-none ${flipped ? '-scale-x-100' : ''} ${className}`}
    >
      {/* Outer Curved Paisley Silhouette */}
      <path
        d="M 50 110 C 20 110 10 80 20 50 C 28 28 45 15 50 5 C 55 18 68 28 75 45 C 85 70 80 110 50 110 Z"
        fill="#ffffff"
        stroke="#dc2626"
        strokeWidth="3"
        opacity="0.95"
      />
      {/* Inner Red Fill Curve */}
      <path
        d="M 50 100 C 28 100 20 75 28 50 C 35 32 46 22 50 14 C 54 22 64 32 70 48 C 76 68 70 100 50 100 Z"
        fill="#fef2f2"
        stroke="#b91c1c"
        strokeWidth="1.5"
      />
      {/* Inner Flower Cluster */}
      <circle cx="50" cy="62" r="7" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
      <circle cx="50" cy="62" r="3" fill="#dc2626" />
      
      {/* Swirling Tail details */}
      <path d="M 50 5 C 48 -2 55 -5 60 0 C 65 5 62 12 55 15" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Decorative Dots */}
      <circle cx="38" cy="45" r="2.5" fill="#f59e0b" />
      <circle cx="62" cy="45" r="2.5" fill="#f59e0b" />
      <circle cx="36" cy="72" r="2.5" fill="#f59e0b" />
      <circle cx="64" cy="72" r="2.5" fill="#f59e0b" />
      <circle cx="50" cy="85" r="3" fill="#dc2626" />
    </svg>
  );
};

// Continuous Bengali Decorative Ribbon Border (আলপনা ও বন্ধন নকশা)
export const BengaliBorderNoksha: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden select-none pointer-events-none flex items-center justify-center opacity-85 ${className}`}>
      <svg width="100%" height="24" viewBox="0 0 1200 24" preserveAspectRatio="repeat-x" className="w-full">
        <defs>
          <pattern id="alponaTile" width="120" height="24" patternUnits="userSpaceOnUse">
            {/* Top & bottom guide lines */}
            <line x1="0" y1="2" x2="120" y2="2" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="0" y1="22" x2="120" y2="22" stroke="#f59e0b" strokeWidth="1.5" />
            
            {/* Central Diamond and Conch swirl */}
            <path d="M 60 3 L 80 12 L 60 21 L 40 12 Z" fill="#ffffff" stroke="#dc2626" strokeWidth="1.5" />
            <circle cx="60" cy="12" r="3" fill="#f59e0b" />
            
            {/* Left & Right floral loops */}
            <path d="M 0 12 Q 15 4 30 12 Q 15 20 0 12" fill="none" stroke="#ffffff" strokeWidth="1.8" />
            <circle cx="15" cy="12" r="2" fill="#dc2626" />
            
            <path d="M 90 12 Q 105 4 120 12 Q 105 20 90 12" fill="none" stroke="#ffffff" strokeWidth="1.8" />
            <circle cx="105" cy="12" r="2" fill="#dc2626" />
          </pattern>
        </defs>
        <rect width="100%" height="24" fill="url(#alponaTile)" />
      </svg>
    </div>
  );
};

// Mangal Ghot (মঙ্গল ঘট - Auspicious Bengali Urn with Mango Leaves & Coconut)
export const MangalGhotCartoon: React.FC<{ size?: number; className?: string }> = ({
  size = 110,
  className = '',
}) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg width={size} height={size} viewBox="0 0 120 130">
        <defs>
          <radialGradient id="brassGhot" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
        </defs>

        {/* Brown Coconut on Top (নারকেল) */}
        <ellipse cx="60" cy="38" rx="16" ry="19" fill="#78350f" stroke="#451a03" strokeWidth="2" />
        <ellipse cx="60" cy="22" rx="4" ry="7" fill="#451a03" />
        {/* Tilak / Sindoor streak on coconut */}
        <line x1="60" y1="28" x2="60" y2="46" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />

        {/* 5 Sacred Mango Leaves (আম্রপল্লব) radiating outward */}
        <path d="M 60 48 Q 40 28 24 35 Q 38 46 60 52 Z" fill="#15803d" stroke="#14532d" strokeWidth="1.5" />
        <path d="M 60 48 Q 80 28 96 35 Q 82 46 60 52 Z" fill="#15803d" stroke="#14532d" strokeWidth="1.5" />
        <path d="M 60 48 Q 50 18 42 12 Q 52 30 60 52 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
        <path d="M 60 48 Q 70 18 78 12 Q 68 30 60 52 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />

        {/* Holy Brass Pot (পিতলের ঘট) */}
        <ellipse cx="60" cy="58" rx="22" ry="7" fill="url(#brassGhot)" stroke="#78350f" strokeWidth="2" />
        <path
          d="M 38 58 Q 20 85 35 110 Q 60 118 85 110 Q 100 85 82 58 Z"
          fill="url(#brassGhot)"
          stroke="#78350f"
          strokeWidth="2.5"
        />

        {/* Vermilion Swastika / Sindoor drawing on Ghot */}
        <path
          d="M 52 82 H 68 M 60 74 V 90 M 52 74 H 60 M 68 74 V 82 M 68 90 H 60 M 52 90 V 82"
          stroke="#dc2626"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* 4 auspicious dots */}
        <circle cx="56" cy="78" r="1.5" fill="#dc2626" />
        <circle cx="64" cy="78" r="1.5" fill="#dc2626" />
        <circle cx="56" cy="86" r="1.5" fill="#dc2626" />
        <circle cx="64" cy="86" r="1.5" fill="#dc2626" />

        {/* Pedestal Base */}
        <ellipse cx="60" cy="115" rx="26" ry="6" fill="#ca8a04" stroke="#78350f" strokeWidth="2" />
      </svg>
      <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300 -mt-1 shadow-sm">
        মঙ্গলের প্রতীক (Mangal Ghot)
      </span>
    </div>
  );
};
