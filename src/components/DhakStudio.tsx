import React, { useState, useEffect } from 'react';
import { pujaAudio } from '../utils/audio';
import { CartoonDhaki } from './CartoonMascots';
import { Play, Square, Volume2, VolumeX, Music, Flame, Sparkles } from 'lucide-react';

interface RhythmPreset {
  id: string;
  name: string;
  bengaliName: string;
  description: string;
  bpm: number;
  pattern: { type: 'bass' | 'rim' | 'stick' | 'kanshi'; delay: number }[];
}

const PRESETS: RhythmPreset[] = [
  {
    id: 'agomoni',
    name: 'Sasthi Agomoni',
    bengaliName: 'ষষ্ঠী আগমনী',
    description: 'The auspicious welcome beat as Maa Durga arrives with her children.',
    bpm: 108,
    pattern: [
      { type: 'bass', delay: 0.5 },
      { type: 'rim', delay: 0.25 },
      { type: 'rim', delay: 0.25 },
      { type: 'bass', delay: 0.5 },
      { type: 'kanshi', delay: 0.25 },
      { type: 'stick', delay: 0.25 },
      { type: 'rim', delay: 0.5 },
      { type: 'bass', delay: 0.5 },
    ],
  },
  {
    id: 'sandhi',
    name: 'Ashtami Sandhi Aarti',
    bengaliName: 'সন্ধিপূজার ধামাক',
    description: 'High-energy fast rhythm played during the sacred 108 lotus offering at Sandhi Puja.',
    bpm: 136,
    pattern: [
      { type: 'bass', delay: 0.25 },
      { type: 'rim', delay: 0.25 },
      { type: 'rim', delay: 0.25 },
      { type: 'bass', delay: 0.25 },
      { type: 'kanshi', delay: 0.25 },
      { type: 'rim', delay: 0.25 },
      { type: 'bass', delay: 0.25 },
      { type: 'kanshi', delay: 0.25 },
    ],
  },
  {
    id: 'dhunuchi',
    name: 'Dhunuchi Naach Groove',
    bengaliName: 'ধুনুচি নাচ তাল',
    description: 'Infectious swinging syncopation that drives the aromatic smoke dance.',
    bpm: 118,
    pattern: [
      { type: 'bass', delay: 0.35 },
      { type: 'stick', delay: 0.15 },
      { type: 'rim', delay: 0.25 },
      { type: 'bass', delay: 0.25 },
      { type: 'kanshi', delay: 0.5 },
      { type: 'rim', delay: 0.25 },
      { type: 'rim', delay: 0.25 },
    ],
  },
  {
    id: 'bisarjan',
    name: 'Dashami Bisarjan Bhaasan',
    bengaliName: 'দশমী বিসর্জন ভাসান',
    description: 'Joyous and emotional carnival rhythm as idols parade to the holy Ganga ghats.',
    bpm: 126,
    pattern: [
      { type: 'bass', delay: 0.3 },
      { type: 'bass', delay: 0.3 },
      { type: 'rim', delay: 0.2 },
      { type: 'kanshi', delay: 0.4 },
      { type: 'rim', delay: 0.2 },
      { type: 'stick', delay: 0.2 },
      { type: 'bass', delay: 0.4 },
    ],
  },
];

export const DhakStudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePreset, setActivePreset] = useState<RhythmPreset>(PRESETS[0]);
  const [currentBpm, setCurrentBpm] = useState(PRESETS[0].bpm);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [speech, setSpeech] = useState<string>('Dha-kuting-tin!');
  const [lastHit, setLastHit] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [strikePos, setStrikePos] = useState<{ x: number; y: number; id: number } | null>(null);

  const speechQuotes = [
    'Dha-kuting-tin-dha!',
    'Bolo Durga Mai Ki Jai!',
    'Dhaker Taale Kapor Dhol!',
    'Abar Eso Maa!',
    'Kashere ghonta baje!',
    'Shubho Sharodiya 2027!',
    'Dhaki-r Haate Jadu!',
  ];

  const triggerPad = (type: 'bass' | 'rim' | 'stick' | 'kanshi' | 'shankha' | 'ghanta' | 'roll') => {
    setLastHit(type);
    
    // Play authentic traditional dhak sound directly
    if (type === 'bass') {
      pujaAudio.playDhakBass(1.0);
    } else if (type === 'rim') {
      pujaAudio.playDhakRim(440, 0.95);
    } else if (type === 'stick') {
      pujaAudio.playStickClick(0.9);
    } else if (type === 'kanshi') {
      pujaAudio.playKanshi(0.8);
    } else if (type === 'shankha') {
      pujaAudio.playShankha();
    } else if (type === 'ghanta') {
      pujaAudio.playGhanta();
    } else if (type === 'roll') {
      pujaAudio.playDhakRoll();
    }

    // Change Dhak-da speech occasionally
    if (Math.random() > 0.35) {
      setSpeech(speechQuotes[Math.floor(Math.random() * speechQuotes.length)]);
    }

    setTimeout(() => {
      setLastHit((current) => (current === type ? null : current));
    }, 180);
  };

  const handleDrumGraphicClick = (e: React.MouseEvent<SVGElement>, part: 'bass' | 'rim' | 'wood' | 'feathers') => {
    const rect = e.currentTarget.closest('svg')?.getBoundingClientRect() || e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStrikePos({ x, y, id: Date.now() });

    if (part === 'bass') triggerPad('bass');
    else if (part === 'rim') triggerPad('rim');
    else if (part === 'wood') triggerPad('stick');
    else if (part === 'feathers') triggerPad('roll');
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      pujaAudio.stopSequence();
      setIsPlaying(false);
      setActiveStep(null);
    } else {
      setIsPlaying(true);
      pujaAudio.startSequence(activePreset.pattern, currentBpm, (step) => {
        setActiveStep(step);
      });
    }
  };

  const handlePresetSelect = (p: RhythmPreset) => {
    setActivePreset(p);
    setCurrentBpm(p.bpm);
    if (isPlaying) {
      pujaAudio.stopSequence();
      pujaAudio.startSequence(p.pattern, p.bpm, (step) => {
        setActiveStep(step);
      });
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    pujaAudio.setMute(next);
    if (next && isPlaying) {
      setIsPlaying(false);
    }
  };

  // Keyboard shortcut triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;
      const key = e.key.toLowerCase();
      if (key === 'q' || key === '1') triggerPad('bass');
      if (key === 'w' || key === '2') triggerPad('rim');
      if (key === 'e' || key === '3') triggerPad('stick');
      if (key === 'r' || key === '4') triggerPad('kanshi');
      if (key === 's') triggerPad('shankha');
      if (key === 'g') triggerPad('ghanta');
      if (key === 'f') triggerPad('roll');
      if (key === ' ') {
        e.preventDefault();
        handleTogglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      pujaAudio.stopSequence();
    };
  }, [isPlaying, activePreset, currentBpm]);

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-amber-500/5 rounded-3xl p-6 md:p-8 border border-amber-200/80 shadow-xl relative overflow-hidden">
      {/* Decorative floral motifs in corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-200/30 rounded-tr-full pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <span>Dhak-Da&apos;s Live Studio</span>
            <span aria-hidden="true">·</span>
            <span>Web Audio Synthesizer</span>
            <span aria-hidden="true">·</span>
            <span>Rangpur 2027 • রংপুর ২০২৭</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center gap-2 font-festive">
            Play the Sacred Dhak Beats
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-xl">
            Click directly on the Dhak drum heads below or use drum pads to strike authentic traditional Bengali dhak sounds in real-time!
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleMute}
            className={`p-2.5 rounded-xl border text-sm flex items-center gap-1.5 transition-colors ${
              isMuted ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
            <span className="text-xs font-medium">{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>

          <button
            onClick={handleTogglePlay}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-transform shadow-md ${
              isPlaying
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-amber-500 hover:bg-amber-600 text-stone-950'
            }`}
          >
            {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Stop Loop' : 'Play Rhythm Loop'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Traditional Dhak Drum Instrument & Mascot */}
        <div className="lg:col-span-5 flex flex-col items-center p-6 bg-white/80 backdrop-blur-md rounded-3xl border border-amber-200/80 shadow-md relative">
          
          <div className="w-full flex items-center justify-between mb-3 text-xs font-bold text-stone-500">
            <span className="flex items-center gap-1 text-amber-700">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Instrument
            </span>
            <span className="text-[11px] text-rose-600">Click Any Drum Part!</span>
          </div>

          {/* Large Interactive Visual Bengali Dhak Drum */}
          <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center select-none my-2">
            <svg
              viewBox="0 0 300 220"
              className="w-full h-full drop-shadow-xl"
            >
              <defs>
                <radialGradient id="largeDhakSkin" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="70%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </radialGradient>
                <linearGradient id="drumWood" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#92400e" />
                  <stop offset="50%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
              </defs>

              {/* Peacock Feathers (Click for Signature Roll!) */}
              <g
                className="cursor-pointer hover:scale-105 origin-bottom transition-transform"
                onClick={(e) => handleDrumGraphicClick(e, 'feathers')}
              >
                <title>Click Feathers to Play Dhak Roll!</title>
                <path d="M 50 85 C 20 40, 10 25, 25 10 C 45 10, 55 45, 65 80 Z" fill="#0284c7" stroke="#082f49" strokeWidth="2" />
                <circle cx="30" cy="22" r="7" fill="#10b981" />
                <circle cx="30" cy="22" r="3.5" fill="#082f49" />
                
                <path d="M 65 75 C 50 25, 60 10, 75 5 C 90 15, 85 45, 80 80 Z" fill="#047857" stroke="#064e3b" strokeWidth="2" />
                <circle cx="75" cy="18" r="6" fill="#facc15" />
                <circle cx="75" cy="18" r="3" fill="#064e3b" />

                <path d="M 78 80 C 85 30, 105 20, 115 30 C 110 50, 100 70, 92 85 Z" fill="#0284c7" stroke="#082f49" strokeWidth="2" />
                <circle cx="106" cy="38" r="6" fill="#10b981" />
                <circle cx="106" cy="38" r="3" fill="#082f49" />
              </g>

              {/* Drum Barrel (Wooden Khol) - Click for Wood Stick Ta */}
              <g
                className="cursor-pointer hover:brightness-110 transition-all"
                onClick={(e) => handleDrumGraphicClick(e, 'wood')}
              >
                <title>Click Shell: Wood Stick Click (Ta)</title>
                <path
                  d="M 55 100 Q 150 78 245 100 L 235 185 Q 145 208 65 185 Z"
                  fill="url(#drumWood)"
                  stroke="#451a03"
                  strokeWidth="4"
                />
                {/* Gold Braided Tension Ropes (Kadi) */}
                <path d="M 62 102 L 95 190 M 100 90 L 135 195 M 140 86 L 175 195 M 180 88 L 215 190 M 220 95 L 240 185" stroke="#fef08a" strokeWidth="3" />
                <path d="M 95 190 L 100 90 M 135 195 L 140 86 M 175 195 L 180 88 M 215 190 L 220 95" stroke="#ca8a04" strokeWidth="2.5" />
              </g>

              {/* Marigold Garland across the drum */}
              <g className="pointer-events-none">
                {[65, 85, 108, 132, 156, 180, 204, 226].map((cx, idx) => (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={102 + Math.sin(idx * 0.8) * 4}
                    r="6.5"
                    fill={idx % 2 === 0 ? '#f59e0b' : '#ea580c'}
                    stroke="#78350f"
                    strokeWidth="1"
                  />
                ))}
              </g>

              {/* Left Drum Head: BASS DHA (Click to strike boomy bass!) */}
              <g
                className="cursor-pointer hover:scale-105 origin-[60px_142px] transition-transform"
                onClick={(e) => handleDrumGraphicClick(e, 'bass')}
              >
                <title>Click Left Head: Deep Bass DHA!</title>
                <ellipse
                  cx="60"
                  cy="142"
                  rx="24"
                  ry="42"
                  fill="url(#largeDhakSkin)"
                  stroke="#451a03"
                  strokeWidth="4"
                  className={lastHit === 'bass' ? 'filter drop-shadow-[0_0_12px_#f59e0b]' : ''}
                />
                {/* Syahi / Center dampening paste ring */}
                <ellipse cx="60" cy="142" rx="10" ry="18" fill="#78350f" opacity="0.35" />
                <text x="60" y="146" textAnchor="middle" fill="#78350f" fontSize="12" fontWeight="bold">DHA</text>
              </g>

              {/* Right Drum Head: TREBLE TIN (Click to strike sharp rim!) */}
              <g
                className="cursor-pointer hover:scale-105 origin-[240px_142px] transition-transform"
                onClick={(e) => handleDrumGraphicClick(e, 'rim')}
              >
                <title>Click Right Head: Sharp RIM TIN!</title>
                <ellipse
                  cx="240"
                  cy="142"
                  rx="16"
                  ry="38"
                  fill="url(#largeDhakSkin)"
                  stroke="#451a03"
                  strokeWidth="3.5"
                  className={lastHit === 'rim' ? 'filter drop-shadow-[0_0_12px_#f43f5e]' : ''}
                />
                <text x="240" y="146" textAnchor="middle" fill="#78350f" fontSize="11" fontWeight="bold">TIN</text>
              </g>

              {/* Animated Strike Wave when clicked */}
              {strikePos && (
                <circle
                  key={strikePos.id}
                  cx={strikePos.x * (300 / 320)}
                  cy={strikePos.y * (220 / 240)}
                  r="24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  className="animate-ping pointer-events-none"
                />
              )}
            </svg>
          </div>

          {/* Quick labels for direct clicking */}
          <div className="grid grid-cols-3 gap-2 w-full mt-2 text-center text-[11px] font-bold">
            <button
              onClick={() => triggerPad('bass')}
              className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors"
            >
              Left: Dha (ধা)
            </button>
            <button
              onClick={() => triggerPad('stick')}
              className="p-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300 transition-colors"
            >
              Shell: Ta (তা)
            </button>
            <button
              onClick={() => triggerPad('rim')}
              className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 transition-colors"
            >
              Right: Tin (তিন)
            </button>
          </div>

          {/* Cartoon Dhaki Mascot reacting in sync */}
          <div className="mt-4 pt-4 border-t border-amber-200/60 w-full flex flex-col items-center">
            <CartoonDhaki
              isPlaying={isPlaying || lastHit !== null}
              onDrumClick={(part) => {
                if (part === 'bass') triggerPad('bass');
                else if (part === 'rim') triggerPad('rim');
                else if (part === 'wood') triggerPad('stick');
                else if (part === 'roll') triggerPad('roll');
              }}
              speechBubble={speech}
              size={175}
            />
          </div>

          {/* Soundwave Visualizer Bars */}
          <div className="w-full flex items-center justify-center gap-1.5 h-8 mt-2 px-4">
            {[4, 8, 14, 24, 18, 30, 22, 12, 6, 16, 26, 10].map((baseHeight, idx) => {
              const active = isPlaying || lastHit !== null;
              const h = active ? Math.min(32, baseHeight * (1 + (idx % 3) * 0.4)) : 4;
              return (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-100 ${
                    active ? 'bg-gradient-to-t from-amber-500 to-rose-600' : 'bg-stone-200'
                  }`}
                  style={{ height: `${h}px` }}
                />
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Drum Pads, Rolls, Presets & Tempo */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Preset Buttons */}
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-rose-600" />
              <span>Authentic Festival Rhythm Loops</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESETS.map((p) => {
                const isSelected = activePreset.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handlePresetSelect(p)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                  >
                    <div className="text-xs truncate">{p.name}</div>
                    <div className="text-[11px] opacity-80 font-serif">{p.bengaliName}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Drum Pads with Audio Support */}
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                Direct Audio Drum Pads (Click or Key)
              </span>
              <span className="text-[11px] text-stone-400 font-mono">Q, W, E, R, S, G, F</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Pad 1: Bass Dha */}
              <button
                onClick={() => triggerPad('bass')}
                className={`group relative p-4 rounded-2xl border text-left transition-transform active:scale-95 shadow-sm ${
                  lastHit === 'bass'
                    ? 'bg-amber-500 border-amber-600 text-stone-950 scale-95 ring-4 ring-amber-400'
                    : 'bg-white hover:bg-amber-50 border-amber-200 text-stone-800'
                }`}
              >
                <span className="absolute top-2 right-2.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                  Q / 1
                </span>
                <div className="text-lg font-black tracking-tight text-amber-700">DHA (ধা)</div>
                <div className="text-xs text-stone-500 mt-0.5">Deep Resonant Bass Head</div>
              </button>

              {/* Pad 2: Rim Tin */}
              <button
                onClick={() => triggerPad('rim')}
                className={`group relative p-4 rounded-2xl border text-left transition-transform active:scale-95 shadow-sm ${
                  lastHit === 'rim'
                    ? 'bg-rose-500 border-rose-600 text-white scale-95 ring-4 ring-rose-300'
                    : 'bg-white hover:bg-rose-50 border-rose-200 text-stone-800'
                }`}
              >
                <span className="absolute top-2 right-2.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                  W / 2
                </span>
                <div className="text-lg font-black tracking-tight text-rose-700">TIN (তিন)</div>
                <div className="text-xs text-stone-500 mt-0.5">Sharp Bamboo Cane Kathi</div>
              </button>

              {/* Pad 3: Stick Ta */}
              <button
                onClick={() => triggerPad('stick')}
                className={`group relative p-4 rounded-2xl border text-left transition-transform active:scale-95 shadow-sm ${
                  lastHit === 'stick'
                    ? 'bg-orange-500 border-orange-600 text-white scale-95 ring-4 ring-orange-300'
                    : 'bg-white hover:bg-orange-50 border-orange-200 text-stone-800'
                }`}
              >
                <span className="absolute top-2 right-2.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                  E / 3
                </span>
                <div className="text-lg font-black tracking-tight text-orange-700">TA (তা)</div>
                <div className="text-xs text-stone-500 mt-0.5">Wooden Khol Shell Snap</div>
              </button>

              {/* Pad 4: Kanshi */}
              <button
                onClick={() => triggerPad('kanshi')}
                className={`group relative p-4 rounded-2xl border text-left transition-transform active:scale-95 shadow-sm ${
                  lastHit === 'kanshi'
                    ? 'bg-yellow-400 border-yellow-500 text-stone-950 scale-95 ring-4 ring-yellow-200'
                    : 'bg-white hover:bg-yellow-50 border-yellow-200 text-stone-800'
                }`}
              >
                <span className="absolute top-2 right-2.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                  R / 4
                </span>
                <div className="text-lg font-black tracking-tight text-yellow-700">KANSHI (কাঁসি)</div>
                <div className="text-xs text-stone-500 mt-0.5">Holy Bronze Temple Gong</div>
              </button>

              {/* Pad 5: Signature Dhak Roll */}
              <button
                onClick={() => triggerPad('roll')}
                className={`group relative p-4 rounded-2xl border text-left transition-transform active:scale-95 shadow-sm ${
                  lastHit === 'roll'
                    ? 'bg-emerald-500 border-emerald-600 text-white scale-95 ring-4 ring-emerald-300'
                    : 'bg-white hover:bg-emerald-50 border-emerald-200 text-stone-800'
                }`}
              >
                <span className="absolute top-2 right-2.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                  F
                </span>
                <div className="text-lg font-black tracking-tight text-emerald-700">DHAMAK (ধামাক)</div>
                <div className="text-xs text-stone-500 mt-0.5">Signature Dhak Roll &amp; Crescendo</div>
              </button>

              {/* Pad 6: Shankha (Conch) */}
              <button
                onClick={() => triggerPad('shankha')}
                className={`group relative p-4 rounded-2xl border text-left transition-transform active:scale-95 shadow-sm ${
                  lastHit === 'shankha'
                    ? 'bg-sky-500 border-sky-600 text-white scale-95 ring-4 ring-sky-300'
                    : 'bg-white hover:bg-sky-50 border-sky-200 text-stone-800'
                }`}
              >
                <span className="absolute top-2 right-2.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                  S
                </span>
                <div className="text-lg font-black tracking-tight text-sky-700">SHANKHA (শঙ্খ)</div>
                <div className="text-xs text-stone-500 mt-0.5">Sacred Conch Inhalation</div>
              </button>
            </div>
          </div>

          {/* Tempo BPM Slider & Visual Step Track */}
          <div className="p-4 bg-white/60 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-1/2">
              <div className="flex justify-between text-xs text-stone-600 font-medium mb-1">
                <span>Rhythm Tempo (BPM)</span>
                <span className="font-mono font-bold text-amber-700">{currentBpm} BPM</span>
              </div>
              <input
                type="range"
                min="80"
                max="170"
                value={currentBpm}
                onChange={(e) => {
                  const newBpm = Number(e.target.value);
                  setCurrentBpm(newBpm);
                  if (isPlaying) {
                    pujaAudio.stopSequence();
                    pujaAudio.startSequence(activePreset.pattern, newBpm, (step) => {
                      setActiveStep(step);
                    });
                  }
                }}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Pattern Step indicators */}
            <div className="flex items-center gap-1.5">
              {activePreset.pattern.map((step, idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full transition-all ${
                    activeStep === idx
                      ? 'bg-rose-600 scale-125 ring-2 ring-rose-400 shadow'
                      : 'bg-stone-300'
                  }`}
                  title={`${step.type} at step ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

