import React from 'react';

// Cartoon Dhak-Da (The animated Bengali Dhaki Drummer)
export const CartoonDhaki: React.FC<{
  isPlaying?: boolean;
  onDrumClick?: (part: 'bass' | 'rim' | 'wood' | 'roll') => void;
  speechBubble?: string;
  size?: number;
}> = ({ isPlaying = false, onDrumClick, speechBubble, size = 180 }) => {
  const handlePartClick = (e: React.MouseEvent, part: 'bass' | 'rim' | 'wood' | 'roll') => {
    e.stopPropagation();
    if (onDrumClick) {
      onDrumClick(part);
    }
  };

  return (
    <div
      className="relative inline-flex flex-col items-center select-none group cursor-pointer"
      onClick={() => onDrumClick && onDrumClick('bass')}
    >
      {speechBubble && (
        <div className="absolute -top-10 bg-amber-400 text-stone-950 font-bold text-xs px-3 py-1 rounded-full shadow-lg border-2 border-stone-900 animate-bounce whitespace-nowrap z-20 pointer-events-none">
          {speechBubble}
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2.5 h-2.5 bg-amber-400 rotate-45 border-r-2 border-b-2 border-stone-900" />
        </div>
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className={`transition-transform duration-200 ${isPlaying ? 'scale-105' : 'hover:scale-102'}`}
      >
        <defs>
          <radialGradient id="dhakSkin" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="85%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>
          <linearGradient id="bodySkin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* Peacock feathers on the Dhak (Click to play Dhak Roll!) */}
        <g
          className={`cursor-pointer transition-transform hover:scale-110 origin-bottom ${isPlaying ? 'animate-sway origin-bottom' : ''}`}
          onClick={(e) => handlePartClick(e, 'roll')}
        >
          <title>Click Feathers to Play Roll!</title>
          <path
            d="M 45 70 C 25 30, 15 40, 20 20 C 35 15, 45 40, 52 65 Z"
            fill="#0284c7"
            stroke="#0f172a"
            strokeWidth="2"
          />
          <circle cx="27" cy="28" r="6" fill="#10b981" />
          <circle cx="27" cy="28" r="3" fill="#0f172a" />
          <circle cx="28" cy="27" r="1" fill="#fff" />

          <path
            d="M 52 65 C 40 20, 50 15, 60 10 C 70 20, 65 45, 60 70 Z"
            fill="#047857"
            stroke="#0f172a"
            strokeWidth="2"
          />
          <circle cx="56" cy="22" r="5" fill="#facc15" />
          <circle cx="56" cy="22" r="2.5" fill="#0f172a" />

          <path
            d="M 60 68 C 65 25, 80 20, 85 25 C 80 40, 75 55, 68 72 Z"
            fill="#0284c7"
            stroke="#0f172a"
            strokeWidth="2"
          />
          <circle cx="78" cy="30" r="5" fill="#10b981" />
          <circle cx="78" cy="30" r="2" fill="#0f172a" />
        </g>

        {/* Dhaki Body - White & Red Bengali Dhuti Kurta */}
        <g className={isPlaying ? 'animate-pulse' : ''}>
          {/* Kurta */}
          <path
            d="M 85 95 Q 120 90 145 98 L 140 160 Q 115 165 90 160 Z"
            fill="#ffffff"
            stroke="#dc2626"
            strokeWidth="3"
          />
          {/* Red Border on Kurta */}
          <path d="M 88 152 Q 115 157 137 152" stroke="#dc2626" strokeWidth="4" fill="none" />
          {/* Feet */}
          <ellipse cx="98" cy="165" rx="9" ry="5" fill="#fed7aa" stroke="#78350f" strokeWidth="2" />
          <ellipse cx="132" cy="165" rx="9" ry="5" fill="#fed7aa" stroke="#78350f" strokeWidth="2" />
        </g>

        {/* Dhak Drum Barrel (Wood / Ta) */}
        <g className={`transition-transform ${isPlaying ? 'rotate-1' : ''}`}>
          {/* Drum Wooden Shell - Click to play Wood Stick / Ta */}
          <path
            d="M 40 105 Q 85 90 125 105 L 120 148 Q 80 162 45 148 Z"
            fill="#b45309"
            stroke="#451a03"
            strokeWidth="3"
            className="cursor-pointer hover:brightness-110"
            onClick={(e) => handlePartClick(e, 'wood')}
          />
          {/* Diagonal tension ropes */}
          <path
            d="M 45 105 L 60 152 M 65 100 L 80 155 M 85 98 L 100 154 M 105 102 L 120 148"
            stroke="#fef08a"
            strokeWidth="2.5"
            className="pointer-events-none"
          />

          {/* Drum Skin Head (Left - Bass Dha) - Click to strike Dha! */}
          <g
            className="cursor-pointer hover:scale-105 origin-center transition-transform"
            onClick={(e) => handlePartClick(e, 'bass')}
          >
            <title>Click Left Skin: Deep Bass Dha!</title>
            <ellipse cx="44" cy="126" rx="14" ry="24" fill="url(#dhakSkin)" stroke="#451a03" strokeWidth="3" />
            <circle cx="44" cy="126" r="6" fill="#78350f" opacity="0.3" />
          </g>

          {/* Drum Skin Head (Right - Rim Tin) - Click to strike Tin! */}
          <g
            className="cursor-pointer hover:scale-105 origin-center transition-transform"
            onClick={(e) => handlePartClick(e, 'rim')}
          >
            <title>Click Right Rim: Sharp Tin!</title>
            <ellipse cx="120" cy="126" rx="9" ry="21" fill="url(#dhakSkin)" stroke="#451a03" strokeWidth="2.5" />
          </g>

          {/* Marigold Garland around Dhak */}
          <circle cx="50" cy="105" r="4" fill="#f59e0b" />
          <circle cx="60" cy="102" r="4" fill="#ea580c" />
          <circle cx="72" cy="100" r="4" fill="#f59e0b" />
          <circle cx="85" cy="100" r="4" fill="#ea580c" />
          <circle cx="98" cy="102" r="4" fill="#f59e0b" />
          <circle cx="110" cy="105" r="4" fill="#ea580c" />
        </g>

        {/* Dhaki Head & Smiling Cartoon Face */}
        <g className={isPlaying ? 'animate-bounce' : ''}>
          {/* Curly hair */}
          <ellipse cx="115" cy="55" rx="26" ry="24" fill="#18181b" />
          <circle cx="95" cy="50" r="8" fill="#18181b" />
          <circle cx="135" cy="50" r="8" fill="#18181b" />
          <circle cx="115" cy="38" r="10" fill="#18181b" />

          {/* Gamchha Headband (Red checkered) */}
          <path d="M 92 56 Q 115 50 138 56 L 138 64 Q 115 58 92 64 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
          <path d="M 98 55 L 98 64 M 110 54 L 110 63 M 122 53 L 122 62 M 132 55 L 132 64" stroke="#ffffff" strokeWidth="1.5" />

          {/* Face */}
          <ellipse cx="115" cy="72" rx="18" ry="17" fill="url(#bodySkin)" stroke="#78350f" strokeWidth="2" />
          
          {/* Big Cartoon Eyes */}
          <ellipse cx="109" cy="69" rx="3.5" ry="5" fill="#ffffff" />
          <ellipse cx="121" cy="69" rx="3.5" ry="5" fill="#ffffff" />
          <circle cx="110" cy="70" r="2.5" fill="#18181b" />
          <circle cx="122" cy="70" r="2.5" fill="#18181b" />
          <circle cx="111" cy="68.5" r="0.8" fill="#ffffff" />
          <circle cx="123" cy="68.5" r="0.8" fill="#ffffff" />

          {/* Big Joyful Smile with teeth */}
          <path d="M 108 78 Q 115 88 123 78 Z" fill="#dc2626" stroke="#78350f" strokeWidth="1.5" />
          <path d="M 110 79 Q 115 82 121 79" fill="#ffffff" />

          {/* Rosy cartoon cheeks */}
          <circle cx="102" cy="75" r="3" fill="#f87171" opacity="0.6" />
          <circle cx="128" cy="75" r="3" fill="#f87171" opacity="0.6" />
        </g>

        {/* Arms with Drumsticks (Kathi) */}
        {/* Left Stick (curved wooden cane stick striking drum) */}
        <g className={`transition-transform origin-[80px_90px] ${isPlaying ? '-rotate-12' : 'rotate-0'}`}>
          <path d="M 95 90 Q 75 95 62 108" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Bamboo stick */}
          <path d="M 64 108 Q 45 118 36 125" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="35" cy="126" r="3" fill="#fef08a" />
        </g>

        {/* Right Stick (thin flexible cane stick) */}
        <g className={`transition-transform origin-[135px_90px] ${isPlaying ? 'rotate-12' : 'rotate-0'}`}>
          <path d="M 132 90 Q 148 95 138 112" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Stick swinging up */}
          <path d="M 138 112 L 125 130" stroke="#78350f" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>

        {/* Sound shockwave rings when playing */}
        {isPlaying && (
          <g className="animate-ping origin-[44px_126px]">
            <circle cx="44" cy="126" r="28" stroke="#f59e0b" strokeWidth="2.5" fill="none" opacity="0.8" />
          </g>
        )}
      </svg>
      <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-amber-900 bg-amber-200/90 border border-amber-400 px-3 py-1 rounded-full shadow-sm">
        <span>Click Drum Head for Dha!</span>
      </div>
    </div>
  );
};

// Cartoon Dhunuchi Dancer
export const CartoonDhunuchiDancer: React.FC<{
  isDancing?: boolean;
  size?: number;
}> = ({ isDancing = true, size = 180 }) => {
  return (
    <div className="relative inline-flex flex-col items-center select-none group">
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className={`transition-transform duration-300 ${isDancing ? 'animate-sway' : ''}`}
      >
        <defs>
          <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </radialGradient>
        </defs>

        {/* Animated Dhunuchi Smoke Clouds */}
        <g className="animate-float-slow">
          <circle cx="100" cy="38" r="12" fill="#e2e8f0" opacity="0.6" />
          <circle cx="112" cy="28" r="10" fill="#f1f5f9" opacity="0.7" />
          <circle cx="88" cy="24" r="8" fill="#e2e8f0" opacity="0.5" />
          <circle cx="102" cy="14" r="9" fill="#f8fafc" opacity="0.8" />
        </g>

        {/* Swirling Burning Dhunuchi Pot */}
        <g>
          {/* Flame Embers */}
          <path
            d="M 94 58 Q 100 44 105 58 Q 108 48 112 60 Q 102 65 94 58 Z"
            fill="url(#fireGlow)"
            className="animate-pulse"
          />
          {/* Clay Burner Top Bowl */}
          <ellipse cx="102" cy="62" rx="18" ry="7" fill="#c2410c" stroke="#7c2d12" strokeWidth="2" />
          <ellipse cx="102" cy="61" rx="14" ry="4" fill="#ea580c" />
          {/* Stem & Handle */}
          <path d="M 98 67 L 96 82 Q 102 85 108 82 L 106 67 Z" fill="#9a3412" stroke="#7c2d12" strokeWidth="1.5" />
          <ellipse cx="102" cy="83" rx="7" ry="2.5" fill="#7c2d12" />
        </g>

        {/* Dancer Body - Traditional Lal-Paar Sari (White with Red Border) */}
        <g>
          {/* Head & Traditional Alta/Bindi */}
          <circle cx="102" cy="100" r="15" fill="#fed7aa" stroke="#78350f" strokeWidth="1.5" />
          {/* Black Bun (Khopa) with White Jasmine Flowers */}
          <ellipse cx="102" cy="90" rx="17" ry="10" fill="#18181b" />
          <circle cx="92" cy="88" r="3" fill="#ffffff" />
          <circle cx="98" cy="85" r="3" fill="#ffffff" />
          <circle cx="106" cy="85" r="3" fill="#ffffff" />
          <circle cx="112" cy="88" r="3" fill="#ffffff" />
          
          {/* Big expressive Bengali eyes */}
          <ellipse cx="98" cy="99" rx="3.5" ry="4" fill="#ffffff" />
          <ellipse cx="106" cy="99" rx="3.5" ry="4" fill="#ffffff" />
          <circle cx="98.5" cy="99.5" r="2" fill="#18181b" />
          <circle cx="106.5" cy="99.5" r="2" fill="#18181b" />
          {/* Red Bindi */}
          <circle cx="102" cy="96" r="2" fill="#dc2626" />
          {/* Smile */}
          <path d="M 98 106 Q 102 110 106 106" stroke="#dc2626" strokeWidth="1.5" fill="none" />

          {/* Red Alta painted hands balancing Dhunuchi */}
          <path d="M 85 116 Q 94 92 100 85" stroke="#fed7aa" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 119 116 Q 110 92 104 85" stroke="#fed7aa" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Red Alta on palms */}
          <circle cx="101" cy="84" r="4" fill="#dc2626" />

          {/* Sari Swirl (Draped Pleats) */}
          <path
            d="M 88 120 Q 102 114 116 120 L 126 172 Q 102 182 78 172 Z"
            fill="#ffffff"
            stroke="#dc2626"
            strokeWidth="3"
          />
          {/* Broad Red Border (Lal Paar) */}
          <path d="M 80 166 Q 102 176 124 166" stroke="#dc2626" strokeWidth="7" fill="none" />
          <path d="M 88 120 L 118 162" stroke="#dc2626" strokeWidth="3" fill="none" />

          {/* Red alta feet with ghunghroo */}
          <ellipse cx="92" cy="178" rx="8" ry="4" fill="#fed7aa" stroke="#dc2626" strokeWidth="1.5" />
          <ellipse cx="112" cy="178" rx="8" ry="4" fill="#fed7aa" stroke="#dc2626" strokeWidth="1.5" />
        </g>
      </svg>
      <span className="text-xs font-semibold text-stone-700 bg-rose-100/90 border border-rose-300 px-2.5 py-0.5 rounded-full mt-1">
        Dhunuchi Dancer
      </span>
    </div>
  );
};

// Divine Trishul & Sacred Bengali Trinayana
export const DivineTrishulAura: React.FC<{ size?: number }> = ({ size = 140 }) => {
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox="0 0 160 160" className="animate-pulse-glow">
        <defs>
          <radialGradient id="trishulGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Holy Aura Halo */}
        <circle cx="80" cy="80" r="70" fill="url(#trishulGlow)" opacity="0.3" />

        {/* Stylized Golden Trishul (Trident) */}
        {/* Central Blade */}
        <path
          d="M 80 18 L 84 52 L 80 58 L 76 52 Z"
          fill="#f59e0b"
          stroke="#b45309"
          strokeWidth="2"
        />
        {/* Left Curved Prong */}
        <path
          d="M 80 56 Q 60 52 52 28 Q 62 40 76 48 Z"
          fill="#f59e0b"
          stroke="#b45309"
          strokeWidth="2"
        />
        {/* Right Curved Prong */}
        <path
          d="M 80 56 Q 100 52 108 28 Q 98 40 84 48 Z"
          fill="#f59e0b"
          stroke="#b45309"
          strokeWidth="2"
        />
        {/* Shaft */}
        <rect x="78" y="58" width="4" height="85" fill="#d97706" rx="2" stroke="#92400e" strokeWidth="1" />

        {/* Sacred Bengali Trinayana (Third Eye) Motif */}
        <g transform="translate(80, 92)">
          {/* Eye Outline */}
          <path
            d="M -22 0 Q 0 -15 22 0 Q 0 15 -22 0 Z"
            fill="#ffffff"
            stroke="#991b1b"
            strokeWidth="2.5"
          />
          {/* Saffron Iris */}
          <circle cx="0" cy="0" r="7" fill="#ea580c" />
          {/* Pupil */}
          <circle cx="0" cy="0" r="3.5" fill="#18181b" />
          <circle cx="1.5" cy="-1" r="1.2" fill="#ffffff" />
          {/* Chandan Bindu (White & Red Sandalwood dots) */}
          <circle cx="-16" cy="-12" r="1.8" fill="#ffffff" />
          <circle cx="-10" cy="-14" r="2.2" fill="#dc2626" />
          <circle cx="0" cy="-16" r="2.8" fill="#dc2626" />
          <circle cx="10" cy="-14" r="2.2" fill="#dc2626" />
          <circle cx="16" cy="-12" r="1.8" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
};

// Cute Cartoon Asura & Lion Friends
export const CuteCartoonAsura: React.FC<{ size?: number }> = ({ size = 120 }) => {
  return (
    <div className="relative inline-flex flex-col items-center select-none group">
      <svg width={size} height={size} viewBox="0 0 140 140" className="hover:scale-105 transition-transform">
        {/* Green Cute Asura Head */}
        <circle cx="70" cy="70" r="32" fill="#84cc16" stroke="#365314" strokeWidth="2.5" />
        {/* Tiny playful curved horns */}
        <path d="M 46 48 Q 40 32 32 36 Q 44 42 46 50 Z" fill="#facc15" stroke="#854d0e" strokeWidth="1.5" />
        <path d="M 94 48 Q 100 32 108 36 Q 96 42 94 50 Z" fill="#facc15" stroke="#854d0e" strokeWidth="1.5" />
        {/* Moustache */}
        <path d="M 58 78 Q 70 74 82 78 Q 70 85 58 78 Z" fill="#18181b" />
        {/* Big cartoon puppy eyes */}
        <circle cx="58" cy="62" r="6" fill="#ffffff" stroke="#365314" strokeWidth="1.5" />
        <circle cx="82" cy="62" r="6" fill="#ffffff" stroke="#365314" strokeWidth="1.5" />
        <circle cx="59" cy="62" r="3.5" fill="#18181b" />
        <circle cx="81" cy="62" r="3.5" fill="#18181b" />
        <circle cx="60" cy="60" r="1" fill="#fff" />
        <circle cx="82" cy="60" r="1" fill="#fff" />
        {/* Cheerful redeemed smile holding a lotus */}
        <path d="M 64 84 Q 70 92 76 84" stroke="#365314" strokeWidth="2" fill="none" />
        {/* Lotus in hand */}
        <path d="M 96 82 Q 106 72 110 78 Q 104 88 96 82 Z" fill="#f43f5e" stroke="#9f1239" strokeWidth="1.5" />
        <circle cx="94" cy="86" r="4" fill="#84cc16" />
      </svg>
      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full">
        Chhotu Asura (&quot;Abar Eso Maa!&quot;)
      </span>
    </div>
  );
};
