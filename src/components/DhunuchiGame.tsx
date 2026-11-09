import React, { useState, useEffect, useRef } from 'react';
import { CartoonDhunuchiDancer } from './CartoonMascots';
import { pujaAudio } from '../utils/audio';
import { Flame, Trophy, RotateCcw, Zap, Sparkles } from 'lucide-react';

export const DhunuchiGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [feedback, setFeedback] = useState<string>('Ready to Dance!');
  const [feedbackColor, setFeedbackColor] = useState<string>('text-stone-700');
  const [heatLevel, setHeatLevel] = useState(30); // 0 to 100%
  const [difficulty, setDifficulty] = useState<'moderate' | 'energetic' | 'frenzy'>('energetic');
  const [gameOver, setGameOver] = useState(false);

  // Target beat animation progress (0 to 1)
  const [ringProgress, setRingProgress] = useState(0);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const targetWindowRef = useRef<{ min: number; max: number }>({ min: 0.78, max: 0.94 });

  const speedMultiplier = difficulty === 'moderate' ? 0.001 : difficulty === 'energetic' ? 0.0014 : 0.0019;

  const handleStart = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setCombo(0);
    setHeatLevel(50);
    setFeedback('Dhunuchi Swirl Started!');
    setFeedbackColor('text-amber-600');
    lastTimeRef.current = performance.now();
    pujaAudio.playDhakBass(0.9);
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  };

  // Main game loop
  useEffect(() => {
    if (!isPlaying) return;

    const loop = (timestamp: number) => {
      const delta = timestamp - (lastTimeRef.current || timestamp);
      lastTimeRef.current = timestamp;

      setRingProgress((prev) => {
        let next = prev + delta * speedMultiplier;
        if (next >= 1.0) {
          // Missed beat penalty
          setCombo(0);
          setHeatLevel((h) => Math.max(0, h - 8));
          setFeedback('Missed Beat! (তাল কেটে গেলো)');
          setFeedbackColor('text-red-500');
          next = 0;
        }
        return next;
      });

      // Slowly dissipate heat if idle
      setHeatLevel((h) => {
        const nextH = h - 0.03;
        if (nextH <= 0) {
          setGameOver(true);
          setIsPlaying(false);
          setFeedback('The Dhunuchi went out! (ধুনুচি নিভে গেছে)');
          setFeedbackColor('text-stone-500');
          return 0;
        }
        return nextH;
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, speedMultiplier]);

  const handleHit = () => {
    if (!isPlaying) {
      handleStart();
      return;
    }

    const { min, max } = targetWindowRef.current;
    const current = ringProgress;

    // Check hit precision
    if (current >= min && current <= max) {
      // Perfect Hit!
      const isPerfect = current >= min + 0.04 && current <= max - 0.02;
      const points = (isPerfect ? 150 : 80) * Math.max(1, Math.floor(combo / 4));
      
      setScore((s) => s + points);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // Increase heat
      setHeatLevel((h) => Math.min(100, h + 12));

      // Audio & Bengali Praise
      pujaAudio.playDhakRim(isPerfect ? 480 : 420, 1.0);
      if (Math.random() > 0.6) pujaAudio.playKanshi(0.7);

      const phrases = isPerfect
        ? ['🔥 Fatafati! (ফাটাফাটি)', '⚡ Dhurandar Naach!', '✨ Subhanallah Ki Taal!', '🌟 Shundor Swirl!']
        : ['Taale Taale! (তালে তালে)', 'Bhalo! Keep it up!', 'Dhunuchi Glowing!'];
      
      setFeedback(phrases[Math.floor(Math.random() * phrases.length)]);
      setFeedbackColor(isPerfect ? 'text-amber-500 font-black' : 'text-emerald-600 font-bold');

      // Reset ring for next cycle
      setRingProgress(0);
    } else {
      // Off beat
      setCombo(0);
      setHeatLevel((h) => Math.max(0, h - 10));
      pujaAudio.playStickClick(0.6);
      setFeedback('Too early/late! Stay on the beat!');
      setFeedbackColor('text-red-500');
      setRingProgress(0);
    }
  };

  // Keyboard Space listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        e.preventDefault();
        handleHit();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  return (
    <div className="bg-gradient-to-br from-rose-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <span>Arcade Rhythm Game</span>
            <span aria-hidden="true">·</span>
            <span>Rangpur 2027 Challenge • রংপুর ২০২৭</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2 font-festive">
            Cartoon Dhunuchi Naach
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-lg">
            Balance the sacred smoking incense burner! Tap the button or hit <kbd className="bg-stone-800 px-1.5 py-0.5 rounded border border-stone-600 text-amber-400 font-mono text-xs">Spacebar</kbd> when the expanding festive ring hits the golden sweet zone!
          </p>
        </div>

        {/* Difficulty switcher */}
        <div className="flex items-center gap-1 bg-stone-800/80 p-1 rounded-xl border border-stone-700">
          {(['moderate', 'energetic', 'frenzy'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setDifficulty(lvl);
                if (isPlaying) handleStop();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                difficulty === lvl
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left: Cartoon Dancer & Visual Rhythm Ring */}
        <div className="md:col-span-7 flex flex-col items-center justify-center p-6 bg-stone-900/60 rounded-2xl border border-stone-800/80 relative min-h-[320px]">
          {/* Target Rhythm Ring Overlay */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Outer Target Golden Ring */}
            <div className="absolute inset-2 rounded-full border-4 border-dashed border-amber-400/50 pointer-events-none animate-spin-slow" />
            <div className="absolute inset-5 rounded-full border-2 border-rose-500/40 pointer-events-none" />

            {/* Expanding Pulse Ring */}
            {isPlaying && (
              <div
                className="absolute rounded-full border-4 border-amber-300 pointer-events-none transition-transform duration-75"
                style={{
                  width: `${ringProgress * 230}px`,
                  height: `${ringProgress * 230}px`,
                  opacity: Math.max(0.2, 1 - ringProgress * 0.4),
                  boxShadow: ringProgress > 0.75 ? '0 0 20px #f59e0b' : 'none',
                }}
              />
            )}

            {/* Center: The Cartoon Dancer */}
            <div className="relative z-10">
              <CartoonDhunuchiDancer isDancing={isPlaying} size={180} />
            </div>
          </div>

          {/* Feedback shout */}
          <div className={`text-sm mt-3 font-bold transition-all text-center ${feedbackColor}`}>
            {feedback}
          </div>

          {/* Big Action Tap Button */}
          <button
            onClick={handleHit}
            className="mt-4 w-full sm:w-64 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-stone-950 font-black text-base shadow-lg shadow-rose-900/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Flame className="w-5 h-5 fill-current text-rose-950" />
            <span>{isPlaying ? 'SWIRL ON BEAT! (Space)' : 'START DHUNUCHI NAACH'}</span>
          </button>
        </div>

        {/* Right: Scoreboard, Heat Meter, and Bengali Commentary */}
        <div className="md:col-span-5 space-y-5">
          {/* Heat Meter */}
          <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
            <div className="flex justify-between text-xs font-semibold text-stone-400 mb-1.5">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Flame className="w-4 h-4 fill-current text-amber-400" />
                Dhunuchi Incense Smoke & Embers
              </span>
              <span className="font-mono text-amber-300">{Math.round(heatLevel)}%</span>
            </div>
            <div className="w-full bg-stone-950 h-3 rounded-full overflow-hidden p-0.5 border border-stone-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 transition-all duration-150"
                style={{ width: `${heatLevel}%` }}
              />
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Keep the rhythm going to prevent the holy dhoop incense from burning out!
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800">
              <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Festive Score</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums mt-0.5">
                {score}
              </div>
            </div>

            <div className="bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800">
              <div className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-rose-400" />
                <span>Rhythm Combo</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tabular-nums mt-0.5">
                {combo}x
              </div>
            </div>
          </div>

          {/* Max Combo & Bengali Trivia */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-1.5">
            <div className="flex items-center justify-between font-bold text-amber-300">
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-400" />
                Best Combo Streak
              </span>
              <span className="font-mono">{maxCombo} Beats</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              <strong>Cultural Lore:</strong> Dhunuchi Naach is performed before Goddess Durga on Maha Ashtami and Navami. The clay pot is loaded with glowing coconut husk (jhunko narikol chhola), coal, camphor, and frankincense powder (dhuna).
            </p>
          </div>

          {/* Reset / Stop button */}
          {isPlaying && (
            <button
              onClick={handleStop}
              className="text-xs text-stone-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Pause Dance Session</span>
            </button>
          )}

          {gameOver && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-center">
              <div className="text-xs font-bold text-red-300">Dance Finished! Final Score: {score}</div>
              <button
                onClick={handleStart}
                className="mt-2 text-xs font-bold px-3 py-1.5 bg-amber-500 text-stone-950 rounded-lg hover:bg-amber-400 transition-colors"
              >
                Dance Again!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
