import React, { useState } from 'react';
import { pujaAudio } from '../utils/audio';
import { CircularAlponaMandala, BengaliKalkaNoksha } from './AlponaMotifs';
import { Sparkles, Heart, Music, Flame, Award } from 'lucide-react';
import cartoonDurgaFamilyImg from '../assets/images/cartoon_durga_family_vahanas_1794261681231.jpg';

interface FamilyMember {
  id: string;
  name: string;
  bengaliName: string;
  vahana: string;
  vahanaBengali: string;
  role: string;
  icon: string;
  color: string;
  actionLabel: string;
  speech: string;
  lore: string;
}

const FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'ganesha',
    name: 'Ganesha & Mooshik',
    bengaliName: 'গণেশ ও মূষিক',
    vahana: 'Little Dancing Mouse (মূষিক)',
    vahanaBengali: 'মূষিক বাহন',
    role: 'Siddhi & Buddhi (Wisdom, Auspicious Beginnings & Sweet Laddus)',
    icon: '🐘',
    color: 'from-amber-400 to-orange-500',
    actionLabel: 'Feed Laddu to Ganesha! (লাড্ডু খাওয়াও)',
    speech: '“মোদক আর মোতিচুর লাড্ডু পেলে আমি মহাখুশি! শুভ পুজো ২০২৭!”',
    lore: 'Baby Ganesha sits on Maa Durga’s right side, blessing Bengal with peace, joy, and successful ventures.',
  },
  {
    id: 'saraswati',
    name: 'Saraswati & Hangswo',
    bengaliName: 'সরস্বতী ও রাজহাঁস',
    vahana: 'Serene White Swan (শ্বেত রাজহাঁস)',
    vahanaBengali: 'হংস বাহন',
    role: 'Vidya & Sangeet (Arts, Pure Wisdom & Music)',
    icon: '🦢',
    color: 'from-sky-400 to-indigo-500',
    actionLabel: 'Strum Sacred Veena! (বীণা বাজাও)',
    speech: '“সুরের মূর্ছনায় ভেসে উঠুক শরতের আকাশ বাতাস! সঙ্গীতই পুজো!”',
    lore: 'Dressed in spotless white and sky blue, Saraswati holds the sacred Veena, inspiring artists, poets, and musicians.',
  },
  {
    id: 'lakshmi',
    name: 'Lakshmi & Pecha',
    bengaliName: 'লক্ষ্মী ও শ্বেত পেঁচা',
    vahana: 'Holy Barn Owl (শ্বেত পেঁচা)',
    vahanaBengali: 'পেঁচা বাহন',
    role: 'Dhan & Samriddhi (Wealth, Good Fortune & Abundance)',
    icon: '🪷',
    color: 'from-rose-400 to-pink-600',
    actionLabel: 'Shower Golden Coins! (ধনবৃষ্টি করো)',
    speech: '“সবার ঘরে সুখ, শান্তি আর সমৃদ্ধি ভরে উঠুক! মা লক্ষ্মীর আশীর্বাদ!”',
    lore: 'Goddess Lakshmi sits on a giant pink lotus holding paddy sheaves (dhaner shish) and a golden urn overflowing with prosperity.',
  },
  {
    id: 'kartikeya',
    name: 'Kartikeya & Mayur',
    bengaliName: 'কার্তিক ও ময়ূর',
    vahana: 'Vibrant Peacock (ময়ূর বাহন)',
    vahanaBengali: 'ময়ূর বাহন',
    role: 'Shaurya & Saundarya (Courage, Handsome Grace & Valor)',
    icon: '🦚',
    color: 'from-emerald-400 to-teal-600',
    actionLabel: 'Dance with Peacock! (ময়ূর নাচাও)',
    speech: '“বীরের বেশে মায়ের পাশে! অসুর নিধনে নির্ভীক সৈনিক!”',
    lore: 'The youthful commander of the divine army holding bow and spear, mounted on his magnificent dancing peacock.',
  },
  {
    id: 'simho',
    name: 'Simho (The Lion)',
    bengaliName: 'বীর সিংহ ও ছোট অসুর',
    vahana: 'Divine Mount of Goddess Durga',
    vahanaBengali: 'মায়ের সিংহ',
    role: 'Divine Strength, Protection & Loyal Guardian',
    icon: '🦁',
    color: 'from-yellow-500 to-amber-700',
    actionLabel: 'Playful Roar! (সিংহনাদ শুনো)',
    speech: '“গর্জন শুনে অসুর দল পালাবে! জয় মা দুর্গা!”',
    lore: 'Maa Durga’s golden lion with a thick royal mane, radiating fearlessness while smiling playfully with festive friends.',
  },
];

export const CartoonFamilyPlayground: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember>(FAMILY_MEMBERS[0]);
  const [activeSpeech, setActiveSpeech] = useState<string>(FAMILY_MEMBERS[0].speech);
  const [ladduCount, setLadduCount] = useState<number>(3);
  const [coinSparks, setCoinSparks] = useState<boolean>(false);
  const [peacockFan, setPeacockFan] = useState<boolean>(false);

  const handleMemberAction = (member: FamilyMember) => {
    setSelectedMember(member);
    setActiveSpeech(member.speech);

    if (member.id === 'ganesha') {
      setLadduCount((c) => c + 1);
      pujaAudio.playStickClick(0.9);
      setTimeout(() => pujaAudio.playDhakBass(0.8), 120);
    } else if (member.id === 'saraswati') {
      pujaAudio.playVeenaChime();
    } else if (member.id === 'lakshmi') {
      pujaAudio.playCoinChime();
      setCoinSparks(true);
      setTimeout(() => setCoinSparks(false), 1500);
    } else if (member.id === 'kartikeya') {
      setPeacockFan(true);
      pujaAudio.playDhakRim(520, 0.9);
      setTimeout(() => setPeacockFan(false), 1200);
    } else if (member.id === 'simho') {
      pujaAudio.playDhakBass(1.0);
      setTimeout(() => pujaAudio.playKanshi(0.7), 160);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-amber-500/10 rounded-3xl p-6 sm:p-8 border border-amber-300/80 shadow-2xl relative overflow-hidden space-y-8">
      {/* Decorative Rotating Alpona Background Layers */}
      <div className="absolute -top-16 -right-16 opacity-20 pointer-events-none">
        <CircularAlponaMandala size={300} />
      </div>
      <div className="absolute -bottom-16 -left-16 opacity-20 pointer-events-none">
        <CircularAlponaMandala size={260} />
      </div>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <span>Durga Paribar Cartoon Adda</span>
            <span aria-hidden="true">·</span>
            <span>Interactive Characters</span>
            <span aria-hidden="true">·</span>
            <span>২০২৭ শারদোৎসব</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center gap-2 font-festive">
            Maa Durga’s Divine Family &amp; Animal Companions
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-0.5 max-w-xl">
            Meet baby Ganesha, Saraswati with her swan, Lakshmi with her owl, Kartikeya with his peacock, and the royal golden lion! Click each character to trigger animations, voices, and festive sounds.
          </p>
        </div>

        {/* Counter of Laddus Fed to Ganesha */}
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-amber-300 shadow-sm self-start md:self-auto">
          <span className="text-2xl animate-bounce">🟡</span>
          <div>
            <div className="text-[10px] text-stone-500 uppercase font-bold">Laddus Fed to Ganesha</div>
            <div className="text-base font-black text-amber-700 font-mono tabular-nums">
              {ladduCount} Motichur Laddus
            </div>
          </div>
        </div>
      </div>

      {/* Master Cartoon Family Feature Banner */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-300 shadow-xl bg-stone-950 group">
        <img
          src={cartoonDurgaFamilyImg}
          onError={(e) => {
            e.currentTarget.src = '/images/cartoon_durga_family_vahanas_1794261681231.jpg';
          }}
          alt="Bengali cartoon illustration of Goddess Durga family celebrating Durga Puja 2027"
          referrerPolicy="no-referrer"
          className="w-full h-64 sm:h-80 md:h-96 object-cover transition-transform duration-700 group-hover:scale-102"
        />

        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent pointer-events-none" />

        {/* Corner Kalka Noksha */}
        <div className="absolute top-3 left-3 pointer-events-none opacity-80">
          <BengaliKalkaNoksha size={60} />
        </div>
        <div className="absolute top-3 right-3 pointer-events-none opacity-80">
          <BengaliKalkaNoksha size={60} flipped />
        </div>

        {/* Active Speech Balloon Overlay */}
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-amber-400/50 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-xl bg-stone-800 border border-stone-700 shrink-0">
              {selectedMember.icon}
            </span>
            <div>
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span>{selectedMember.name}</span>
                <span className="text-stone-400">·</span>
                <span className="text-[11px] font-serif text-rose-300">{selectedMember.bengaliName}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 italic font-medium mt-0.5 font-serif">
                {activeSpeech}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleMemberAction(selectedMember)}
            className="px-4 py-2 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 transition-transform active:scale-95 shadow shrink-0 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{selectedMember.actionLabel}</span>
          </button>
        </div>
      </div>

      {/* Grid of 5 Clickable Cartoon Character Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative z-10">
        {FAMILY_MEMBERS.map((member) => {
          const isSelected = selectedMember.id === member.id;
          return (
            <div
              key={member.id}
              onClick={() => handleMemberAction(member)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-amber-500 shadow-lg ring-2 ring-amber-400/40 -translate-y-1'
                  : 'bg-white/80 hover:bg-white border-amber-200/70 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{member.icon}</span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    {member.bengaliName.split(' ')[0]}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-stone-900">{member.name}</h4>
                <div className="text-xs text-amber-700 font-semibold mt-0.5">{member.vahana}</div>

                <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                  {member.lore}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  className={`w-full py-2 px-3 rounded-xl font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 shadow-sm ${
                    isSelected
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Interact!</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coin Sparkles Animation effect for Lakshmi */}
      {coinSparks && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-4xl animate-ping flex gap-4">
            <span>🪙</span>
            <span>✨</span>
            <span>🪙</span>
            <span>🪷</span>
            <span>🪙</span>
          </div>
        </div>
      )}

      {/* Peacock Feather Fan animation for Kartikeya */}
      {peacockFan && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-5xl animate-bounce flex gap-4">
            <span>🦚</span>
            <span>✨</span>
            <span>🦚</span>
          </div>
        </div>
      )}
    </div>
  );
};
