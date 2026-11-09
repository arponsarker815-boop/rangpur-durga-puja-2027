import React, { useState, useRef, useEffect } from 'react';
import { CircularAlponaMandala, BengaliKalkaNoksha, MangalGhotCartoon } from './AlponaMotifs';
import { pujaAudio } from '../utils/audio';
import { Paintbrush, RotateCcw, Download, Sparkles, Palette, Check } from 'lucide-react';

const ALPONA_COLORS = [
  { name: 'Traditional Pituli White (পিটুলি সাদা)', hex: '#ffffff' },
  { name: 'Sacred Vermilion Red (সিঁদুর লাল)', hex: '#dc2626' },
  { name: 'Holy Turmeric Yellow (কাঁচা হলুদ)', hex: '#facc15' },
  { name: 'Marigold Orange (গেন্দা কমলা)', hex: '#f97316' },
  { name: 'Peacock Teal (ময়ূরকণ্ঠী)', hex: '#0284c7' },
];

export const AlponaStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState(ALPONA_COLORS[0].hex);
  const [brushSize, setBrushSize] = useState(3.5);
  const [symmetry, setSymmetry] = useState<number>(8); // 8-fold radial symmetry
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize and draw baseline sacred center
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark terracotta / festive red floor background for rich contrast
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle guide rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    [40, 80, 120, 160].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Central sacred lotus core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    setHasDrawn(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 440;
    canvas.height = 440;
    clearCanvas();
  }, []);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const drawSymmetricLine = (x1: number, y1: number, x2: number, y2: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const p1x = x1 - cx;
    const p1y = y1 - cy;
    const p2x = x2 - cx;
    const p2y = y2 - cy;

    for (let i = 0; i < symmetry; i++) {
      const angle = (i * 2 * Math.PI) / symmetry;
      ctx.save();
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.stroke();

      // Mirror symmetry
      ctx.beginPath();
      ctx.moveTo(-p1x, p1y);
      ctx.lineTo(-p2x, p2y);
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
    setHasDrawn(true);
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    lastPointRef.current = coords;
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPointRef.current) return;
    const coords = getCanvasCoordinates(e);
    drawSymmetricLine(lastPointRef.current.x, lastPointRef.current.y, coords.x, coords.y);
    lastPointRef.current = coords;
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const downloadAlpona = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'durga_puja_2027_alpona.png';
    link.href = canvas.toDataURL();
    link.click();
    pujaAudio.playGhanta();
  };

  // Stamp sacred template
  const stampTemplate = (type: 'lotus' | 'sun' | 'mandala') => {
    clearCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (type === 'lotus') {
      for (let r = 20; r <= 140; r += 28) {
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          drawSymmetricLine(cx, cy, x, y);
        }
      }
    } else if (type === 'mandala') {
      for (let i = 0; i < 16; i++) {
        const a1 = (i * Math.PI * 2) / 16;
        const a2 = ((i + 1) * Math.PI * 2) / 16;
        drawSymmetricLine(cx + Math.cos(a1) * 70, cy + Math.sin(a1) * 70, cx + Math.cos(a2) * 120, cy + Math.sin(a2) * 120);
      }
    }
    pujaAudio.playGhanta();
  };

  return (
    <div className="bg-amber-100/30 rounded-3xl p-6 sm:p-8 border border-amber-300/80 shadow-xl space-y-8 relative overflow-hidden">
      
      {/* Decorative Rotating Mandala in background corner */}
      <div className="absolute top-0 right-0 opacity-15 pointer-events-none">
        <CircularAlponaMandala size={280} />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <span>Traditional Sacred Folk Art</span>
            <span aria-hidden="true">·</span>
            <span>বাঙালির আলপনা আঙিনা</span>
            <span aria-hidden="true">·</span>
            <span>Rangpur 2027 • রংপুর ২০২৭</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center gap-2 font-festive">
            Animated Alpona &amp; Colorful Noksha Studio
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-0.5 max-w-xl">
            In Bengal, rice paste Alpona (পিটুলি আলপনা) is drawn to invite Goddess Durga and Lakshmi into our homes. Draw your own symmetric sacred mandala below or watch traditional rotating patterns!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadAlpona}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download My Alpona</span>
          </button>
        </div>
      </div>

      {/* Autumn Kash Phool & Alpona Landscape Feature Banner */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-300 shadow-xl bg-stone-950">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="md:col-span-5 p-6 md:p-8 space-y-4 text-white z-10">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase">
              <span>Autumn Kash Phool &amp; Alpona</span>
              <span aria-hidden="true">·</span>
              <span>শরতের কাশবন ও আলপনা</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white font-festive">
              Kash Phool Fields at Golden Twilight
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              When the autumn breeze sways the feathery white Kash flowers along the Ghaghot riverbanks, and white Alpona patterns lead the way to the illuminated mandaps, Rangpur comes alive with boundless joy.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1.5 rounded-xl font-semibold">
                🌾 Kash Phool (Saccharum spontaneum)
              </span>
              <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-400/40 px-3 py-1.5 rounded-xl font-semibold">
                🎨 Pituli Alpona Art
              </span>
            </div>
          </div>

          <div className="md:col-span-7 relative h-64 md:h-80 overflow-hidden">
            <img
              src="/src/assets/images/kashphool_alpona_autumn_bg_1794261681076.jpg"
              alt="Autumn landscape of Bengal with Kash phool and sacred white Alpona leading to illuminated Durga pandal"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/40 to-transparent md:block hidden" />
          </div>
        </div>
      </div>

      {/* Interactive Alpona Painting Canvas Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Canvas Area */}
        <div className="lg:col-span-6 flex flex-col items-center p-6 bg-white rounded-3xl border border-amber-300 shadow-md">
          <div className="flex items-center justify-between w-full mb-3 text-xs font-bold text-stone-600">
            <span className="flex items-center gap-1.5 text-rose-700">
              <Paintbrush className="w-4 h-4" />
              Symmetric Alpona Canvas (Drag to Paint)
            </span>
            <span className="text-[11px] text-amber-800 font-mono">8-Fold Radial Mirroring</span>
          </div>

          {/* Drawing Canvas */}
          <div className="relative rounded-2xl overflow-hidden shadow-inner border-4 border-amber-800/80 cursor-crosshair">
            <canvas
              ref={canvasRef}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
              className="w-full max-w-[340px] sm:max-w-[380px] aspect-square block touch-none"
            />
          </div>

          {/* Quick Actions below canvas */}
          <div className="flex items-center justify-between w-full mt-4 gap-2">
            <button
              onClick={clearCanvas}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Floor</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => stampTemplate('lotus')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
              >
                Lotus Preset
              </button>
              <button
                onClick={() => stampTemplate('mandala')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300 hover:bg-rose-200"
              >
                Mandala Preset
              </button>
            </div>
          </div>
        </div>

        {/* Controls & Gallery of Traditional Bengali Noksha */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Color Palette Selector */}
          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-rose-600" />
                Traditional Pigments
              </span>
              <span className="text-[11px] text-stone-500">Pick Paint Color</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALPONA_COLORS.map((col) => {
                const isSelected = selectedColor === col.hex;
                return (
                  <button
                    key={col.hex}
                    onClick={() => setSelectedColor(col.hex)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 shadow-sm ring-2 ring-amber-400/40'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-stone-300 shrink-0 shadow-sm"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="text-xs font-bold text-stone-800 truncate">{col.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stroke Width & Symmetry Controls */}
          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                <span>Brush Thickness</span>
                <span className="font-mono text-amber-700">{brushSize}px</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="8"
                step="0.5"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                <span>Radial Petal Symmetry</span>
                <span className="font-mono text-rose-700">{symmetry} Petals</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[4, 6, 8, 12].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSymmetry(n)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      symmetry === n
                        ? 'bg-rose-600 text-white border-rose-700'
                        : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    {n}-Fold
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gallery of Auspicious Bengali Symbols */}
          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-3">
              Sacred Bengali Noksha Motifs (ঐতিহ্যবাহী নকশা)
            </span>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center">
                <BengaliKalkaNoksha size={48} />
                <span className="text-[11px] font-bold text-stone-800 mt-1">ময়ূর কলকা</span>
                <span className="text-[10px] text-stone-500">Paisley Kalka</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center">
                <MangalGhotCartoon size={52} />
                <span className="text-[11px] font-bold text-stone-800 mt-1">মঙ্গল ঘট</span>
                <span className="text-[10px] text-stone-500">Auspicious Urn</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center">
                <CircularAlponaMandala size={48} animate={false} />
                <span className="text-[11px] font-bold text-stone-800 mt-1">পদ্ম চক্র</span>
                <span className="text-[10px] text-stone-500">Lotus Mandala</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
