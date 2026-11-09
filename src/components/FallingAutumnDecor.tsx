import React, { useEffect, useRef, useState } from 'react';
import { Wind, Sparkles, Eye, EyeOff } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  type: 'kash' | 'shiuli' | 'sparkle';
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
}

export const FallingAutumnDecor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [intensity, setIntensity] = useState<'gentle' | 'festive'>('gentle');
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = intensity === 'gentle' ? 42 : 75;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const typeRand = Math.random();
      const type: 'kash' | 'shiuli' | 'sparkle' =
        typeRand < 0.45 ? 'kash' : typeRand < 0.85 ? 'shiuli' : 'sparkle';

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        type,
        size: type === 'kash' ? Math.random() * 14 + 10 : type === 'shiuli' ? Math.random() * 8 + 6 : Math.random() * 3 + 2,
        speedY: type === 'kash' ? Math.random() * 0.7 + 0.4 : type === 'shiuli' ? Math.random() * 1.1 + 0.6 : Math.random() * 0.5 + 0.2,
        speedX: (Math.random() - 0.5) * 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.6 + 0.35,
        swayAmp: Math.random() * 1.8 + 0.8,
        swayFreq: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.phase += p.swayFreq;
        const sway = Math.sin(p.phase) * p.swayAmp;
        p.x += p.speedX + sway;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        // Subtle mouse wind repulsion
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 3;
            p.y += (dy / dist) * force * 2;
          }
        }

        // Wrap around screen
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'kash') {
          // Feathery autumn Kash Phool plume (white/silver Bengali catkin)
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 1.2;
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(p.size * 0.2, -p.size * 0.5, 0, -p.size);
          ctx.stroke();

          // Delicate fluff tufts along stem
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          for (let f = 0.3; f <= 0.9; f += 0.2) {
            const ty = -p.size * f;
            ctx.beginPath();
            ctx.ellipse(2, ty, p.size * 0.35, p.size * 0.15, Math.PI / 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(-2, ty - 2, p.size * 0.3, p.size * 0.12, -Math.PI / 5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (p.type === 'shiuli') {
          // Authentic Shiuli Flower: 5 snow-white petals with orange calyx center
          // Calyx / center
          ctx.fillStyle = '#f97316'; // Deep saffron-orange center
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.28, 0, Math.PI * 2);
          ctx.fill();

          // 5 White Petals
          ctx.fillStyle = '#ffffff';
          const petals = 5;
          for (let i = 0; i < petals; i++) {
            const angle = (i * Math.PI * 2) / petals;
            const px = Math.cos(angle) * (p.size * 0.65);
            const py = Math.sin(angle) * (p.size * 0.65);
            ctx.beginPath();
            ctx.ellipse(px, py, p.size * 0.45, p.size * 0.25, angle, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Festive golden ember sparkle
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isEnabled, intensity]);

  return (
    <>
      {isEnabled && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-10"
          aria-hidden="true"
        />
      )}

      {/* Floating control widget in bottom corner */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-stone-900/90 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-xl shadow-2xl border border-amber-400/30">
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
          title={isEnabled ? 'Pause falling Kash & Shiuli' : 'Show autumn atmosphere'}
        >
          {isEnabled ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5 text-stone-400" />}
          <span>{isEnabled ? 'Autumn Breeze & Kash' : 'Breeze Off'}</span>
        </button>
        {isEnabled && (
          <>
            <span className="text-stone-600" aria-hidden="true">·</span>
            <button
              onClick={() => setIntensity(intensity === 'gentle' ? 'festive' : 'gentle')}
              className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold"
              title="Toggle breeze density"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="capitalize">{intensity}</span>
            </button>
          </>
        )}
      </div>

      {/* Animated Swaying Autumn Kash Phool Stalks along bottom of viewport */}
      {isEnabled && (
        <div
          className="fixed bottom-0 left-0 right-0 h-24 sm:h-32 pointer-events-none z-10 overflow-hidden flex items-end justify-between opacity-80 select-none"
          aria-hidden="true"
        >
          {Array.from({ length: 18 }).map((_, idx) => {
            const height = 70 + (idx % 5) * 12;
            const delay = (idx % 6) * 0.4;
            const isLeftLeaning = idx % 2 === 0;
            return (
              <div
                key={idx}
                className="shrink-0 flex flex-col items-center origin-bottom animate-kash-sway"
                style={{
                  height: `${height}px`,
                  animationDelay: `${delay}s`,
                  transform: isLeftLeaning ? 'scaleX(1)' : 'scaleX(-1)',
                  marginRight: '-12px',
                }}
              >
                {/* Feathery white plume tip */}
                <svg width="34" height={height} viewBox="0 0 34 110" className="drop-shadow-sm">
                  {/* Stem */}
                  <path d="M 17 110 Q 17 40 12 0" stroke="#15803d" strokeWidth="2" fill="none" opacity="0.6" />
                  {/* White feathery kash tufts */}
                  {Array.from({ length: 7 }).map((_, fi) => (
                    <ellipse
                      key={fi}
                      cx={14 + (fi % 2 === 0 ? 4 : -4)}
                      cy={12 + fi * 11}
                      rx="9"
                      ry="3.5"
                      fill="#ffffff"
                      opacity="0.92"
                      transform={`rotate(${fi % 2 === 0 ? 25 : -25} ${14 + (fi % 2 === 0 ? 4 : -4)} ${12 + fi * 11})`}
                    />
                  ))}
                </svg>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
