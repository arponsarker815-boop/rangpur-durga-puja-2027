import React, { useState, useEffect } from 'react';
import { pujaAudio } from '../utils/audio';
import { DivineTrishulAura } from './CartoonMascots';
import { Calendar, Compass, Sparkles, Music2, Share2, Volume2, MapPin } from 'lucide-react';
import heroCartoonImg from '../assets/images/rangpur_durga_cartoon_hero_1794262927895.jpg';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroProps> = ({ onNavigate }) => {
  // Countdown to Durga Puja 2027 (Maha Sasthi: October 5, 2027 at 06:00:00 BST)
  const targetDate = new Date('2027-10-05T00:00:00Z').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [shankhaPlaying, setShankhaPlaying] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleBlowShankha = () => {
    setShankhaPlaying(true);
    pujaAudio.playShankha();
    setTimeout(() => setShankhaPlaying(false), 2400);
  };

  return (
    <div className="relative pt-6 pb-12 overflow-hidden">
      {/* Decorative Top Toran / Festive Marigold & Mango Leaves Banner */}
      <div className="w-full flex items-center justify-center gap-1 mb-6 overflow-hidden pointer-events-none select-none opacity-90">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center shrink-0">
            <div className="w-6 h-6 rounded-full bg-amber-400 border border-amber-600 shadow-sm" />
            <div className="w-1.5 h-4 bg-emerald-700 -mt-1 rounded-b" />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Festive Editorial Headline, Meta, and Countdown */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Unboxed Metadata with typographic separators */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-rose-700 tracking-wide mb-3">
                <span>রংপুর শারদোৎসব ২০২৭</span>
                <span aria-hidden="true">·</span>
                <span>Rangpur, Bangladesh</span>
                <span aria-hidden="true">·</span>
                <span>আশ্বিন ১৪৩৪ বঙ্গাব্দ</span>
                <span aria-hidden="true">·</span>
                <span>সৌহার্দ্য ও সম্প্রীতির উৎসব</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1] font-festive">
                বাহে, রংপুরিয়া পুজো ২০২৭!
                <span className="block text-2xl sm:text-3xl lg:text-4xl text-rose-600 font-bengali-title mt-2">
                  Maa Aaschen Rangpur 2027 • শারদোৎসব
                </span>
              </h1>

              {/* Atmospheric copy tailored for Rangpur */}
              <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
                তিস্তা ও ঘাঘটের শান্ত কূলে শরতের কাশফুলের শুভ্র সমারোহে মা দুর্গার আবাহন। ঐতিহাসিক করুণাময়ী কালীবাড়ি, ধর্মসভা, তাজহাট রাজবাড়ি, মাহিগঞ্জ এবং পালিচড়া জমিদার বাড়ি সহ রংপুর শহর ও সদর উপজেলার ৫০টি প্রধান মণ্ডপ পরিক্রমা করুন। শুনুন ঐতিহ্যবাহী ঢাকের বাদ্য, বাজান শঙ্খ এবং ইজিবাইক ট্রাফিক ম্যাপ দেখে উপভোগ করুন রংপুর শারদোৎসব!
              </p>

              {/* Quick Audio & Ritual Triggers */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleBlowShankha}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                    shankhaPlaying
                      ? 'bg-sky-600 text-white ring-4 ring-sky-300 scale-95'
                      : 'bg-white hover:bg-sky-50 text-sky-800 border border-sky-300'
                  }`}
                  title="পবিত্র শঙ্খধ্বনি বাজান"
                >
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>{shankhaPlaying ? 'শঙ্খ বাজছে...' : 'পবিত্র শঙ্খধ্বনি (Blow Shankha)'}</span>
                </button>

                <button
                  onClick={() => {
                    pujaAudio.playGhanta();
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-2 transition-colors shadow-sm"
                  title="আরতির কাঁসর-ঘণ্টা বাজান"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>মন্দিরের আরতি ঘণ্টা (Ring Bell)</span>
                </button>
              </div>
            </div>

            {/* Countdown Strip to Durga Puja 2027 */}
            <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-orange-500/15 p-5 sm:p-6 rounded-3xl border border-amber-300/60 shadow-md">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-stone-700 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-rose-700">
                  <Calendar className="w-4 h-4" />
                  রংপুর শারদোৎসব ২০২৭ কাউন্টডাউন (মহা ষষ্ঠী)
                </span>
                <span className="text-amber-800 font-mono text-[11px]">October 5, 2027</span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-amber-200/80 shadow-sm">
                  <div className="text-2xl sm:text-3xl font-black text-rose-700 font-mono tabular-nums">
                    {timeLeft.days}
                  </div>
                  <div className="text-[11px] text-stone-500 font-semibold uppercase mt-0.5">দিন (Days)</div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-amber-200/80 shadow-sm">
                  <div className="text-2xl sm:text-3xl font-black text-rose-700 font-mono tabular-nums">
                    {timeLeft.hours}
                  </div>
                  <div className="text-[11px] text-stone-500 font-semibold uppercase mt-0.5">ঘণ্টা (Hours)</div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-amber-200/80 shadow-sm">
                  <div className="text-2xl sm:text-3xl font-black text-rose-700 font-mono tabular-nums">
                    {timeLeft.minutes}
                  </div>
                  <div className="text-[11px] text-stone-500 font-semibold uppercase mt-0.5">মিনিট (Mins)</div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-amber-200/80 shadow-sm">
                  <div className="text-2xl sm:text-3xl font-black text-rose-700 font-mono tabular-nums">
                    {timeLeft.seconds}
                  </div>
                  <div className="text-[11px] text-stone-500 font-semibold uppercase mt-0.5">সেকেন্ড (Secs)</div>
                </div>
              </div>

              <div className="mt-3 text-center text-xs text-stone-600 font-medium">
                রংপুরের ধর্মসভা ও ডিমলা রাজবাড়ি সহ সকল মণ্ডপে বোধন ও আমন্ত্রণের মধ্য দিয়ে উৎসব শুরু হবে!
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => onNavigate('map')}
                className="px-4 py-2.5 rounded-2xl bg-sky-600 text-white font-extrabold text-xs sm:text-sm hover:bg-sky-700 transition-all flex items-center gap-1.5 shadow-md active:scale-98"
              >
                <Compass className="w-4 h-4" />
                <span>রংপুর মণ্ডপ ম্যাপ ও ইজিবাইক রুট</span>
              </button>

              <button
                onClick={() => onNavigate('cartoon-family')}
                className="px-4 py-2.5 rounded-2xl bg-amber-500 text-stone-950 font-extrabold text-xs sm:text-sm hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-md active:scale-98"
              >
                <Sparkles className="w-4 h-4 fill-current text-rose-950" />
                <span>কার্টুন পরিবার (Playground)</span>
              </button>

              <button
                onClick={() => onNavigate('dhak')}
                className="px-4 py-2.5 rounded-2xl bg-stone-900 text-white font-bold text-xs sm:text-sm hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow active:scale-98"
              >
                <Music2 className="w-4 h-4 text-amber-400" />
                <span>ঢাকের বোল বাজান</span>
              </button>

              <button
                onClick={() => onNavigate('alpona')}
                className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs border border-stone-300 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>আলপনা স্টুডিও</span>
              </button>

              <button
                onClick={() => onNavigate('dhunuchi')}
                className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs border border-stone-300 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>ধুনুচি নাচ গেম</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Artwork with Cartoon Animation Layer & Rotating Alpona */}
          <div className="lg:col-span-5 flex flex-col justify-center relative">
            {/* Rotating Sacred Alpona Aura behind image */}
            <div className="absolute -top-10 -right-10 pointer-events-none opacity-30 hidden sm:block">
              <svg width="240" height="240" viewBox="0 0 240 240" className="animate-spin-very-slow">
                <circle cx="120" cy="120" r="100" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 6" />
                <circle cx="120" cy="120" r="75" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                <circle cx="120" cy="120" r="50" fill="none" stroke="#f59e0b" strokeWidth="2" />
              </svg>
            </div>

            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-300/80 shadow-2xl bg-stone-900 group">
              {/* High fidelity generated Rangpur cartoon illustration */}
              <img
                src={heroCartoonImg}
                onError={(e) => {
                  e.currentTarget.src = '/images/rangpur_durga_cartoon_hero_1794262927895.jpg';
                }}
                alt="Cartoon illustration of Goddess Durga riding lion in Rangpur with Tajhat Rajbari Palace and Bangladeshi rickshaw in autumn kash phool"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] sm:h-[480px] lg:h-[520px] object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient scrim for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20 pointer-events-none" />

              {/* Floating Trishul Aura in corner */}
              <div className="absolute top-3 right-3 pointer-events-none">
                <DivineTrishulAura size={90} />
              </div>

              {/* Floating Tag */}
              <div className="absolute top-4 left-4 bg-stone-900/85 backdrop-blur-md text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>রংপুর তাজহাট রাজবাড়ি ও দেবী দুর্গা</span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-700/80 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-amber-300">
                      রংপুরের শারদপ্রাতে আনন্দময়ীর আগমন
                    </h3>
                    <p className="text-xs text-stone-300 mt-0.5">
                      তাজহাট রাজপ্রাসাদ, ঘাঘট নদী ও রঙিন রিকশার শহরে শুভ শারদীয়া ২০২৭!
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-1 rounded-md border border-amber-700">
                      Rangpur 2027
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
