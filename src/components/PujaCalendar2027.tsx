import React, { useState } from 'react';
import { pujaAudio } from '../utils/audio';
import { Calendar, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

interface DayEvent {
  dayName: string;
  bengaliName: string;
  date: string;
  tithi: string;
  keyRitual: string;
  significance: string;
  timing: string;
}

const PUJA_DAYS_2027: DayEvent[] = [
  {
    dayName: 'Mahalaya',
    bengaliName: 'মহালয়া',
    date: 'Wednesday, September 29, 2027',
    tithi: 'Amavasya (অমাবস্যা)',
    keyRitual: 'Tarpan along holy Ganga ghats & Chokkhudaan (invoking the artisan to paint the third eye).',
    significance: 'Birendra Krishna Bhadra’s iconic radio broadcast of Mahishasuramardini rings across Bengal at 4 AM, marking the divine arrival.',
    timing: 'Tarpan: 04:30 AM – 11:30 AM',
  },
  {
    dayName: 'Maha Sasthi',
    bengaliName: 'মহা ষষ্ঠী',
    date: 'Tuesday, October 5, 2027',
    tithi: 'Shukla Sasthi (শুক্লা ষষ্ঠী)',
    keyRitual: 'Kalparambho, Bodhon (Awakening under the Bel tree), Amontron & Adhibas.',
    significance: 'Goddess Durga is officially awakened and welcomed to earth as our daughter coming home to Bengal for 5 days of ecstasy.',
    timing: 'Bodhon: 06:15 AM – 09:30 AM',
  },
  {
    dayName: 'Maha Saptami',
    bengaliName: 'মহা সপ্তমী',
    date: 'Wednesday, October 6, 2027',
    tithi: 'Shukla Saptami (শুক্লা সপ্তমী)',
    keyRitual: 'Nabapatrika Snan (bathing of Kola Bou - banana plant bride wrapped in yellow-bordered red sari) at the river before dawn.',
    significance: 'Nabapatrika symbolizes nature and agricultural prosperity, integrating 9 sacred plants representing aspects of Durga.',
    timing: 'Kola Bou Snan: 05:40 AM – 07:15 AM',
  },
  {
    dayName: 'Maha Ashtami & Sandhi Puja',
    bengaliName: 'মহা অষ্টমী ও সন্ধিপূজা',
    date: 'Thursday, October 7, 2027',
    tithi: 'Shukla Ashtami (শুক্লা অষ্টমী)',
    keyRitual: 'Kumari Puja (worship of young girl as living deity) and the auspicious Sandhi Puja at the juncture of Ashtami and Navami with 108 blue lotuses and 108 clay diyas.',
    significance: 'The supreme climactic moment of Durga Puja where Devi slays the demons Chanda and Munda as the fierce Chamunda.',
    timing: 'Sandhi Puja: 05:12 PM – 06:00 PM (Auspicious 48 mins)',
  },
  {
    dayName: 'Maha Navami',
    bengaliName: 'মহা নবমী',
    date: 'Friday, October 8, 2027',
    tithi: 'Shukla Navami (শুক্লা নবমী)',
    keyRitual: 'Maha Aarti, Hom / Yajna, Grand Bhog offering, and ecstatic Dhunuchi Naach.',
    significance: 'The final full night of pandal hopping and carnival celebration across the city before Bijoya farewell.',
    timing: 'Maha Aarti: 07:00 PM onwards',
  },
  {
    dayName: 'Bijoya Dashami',
    bengaliName: 'বিজয়া দশমী',
    date: 'Saturday, October 9, 2027',
    tithi: 'Dashami (বিজয়া দশমী)',
    keyRitual: 'Devi Baran, Sindoor Khela (married women smearing vermilion and feeding sweets), followed by holy idol Visarjan in the Hooghly / Ganga.',
    significance: 'With tearful eyes and joyful shouts of “Aschhe bochhor abar hobe!” (Next year again!), we bid farewell to the Mother, sharing sweets and Shubho Bijoya hugs.',
    timing: 'Sindoor Khela: 10:00 AM | Visarjan: 02:00 PM onwards',
  },
];

export const PujaCalendar2027: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<DayEvent>(PUJA_DAYS_2027[3]); // Maha Ashtami default
  const [litDiyas, setLitDiyas] = useState<number>(108);

  const toggleDiya = (idx: number) => {
    pujaAudio.playGhanta();
    if (idx < litDiyas) {
      setLitDiyas(idx);
    } else {
      setLitDiyas(idx + 1);
    }
  };

  const handleLightAll = () => {
    setLitDiyas(108);
    pujaAudio.playGhanta();
    pujaAudio.playKanshi(0.8);
  };

  return (
    <div className="space-y-8">
      {/* Top Title */}
      <div>
        <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs tracking-wider uppercase mb-1">
          <span>Tithi &amp; Vedic Almanac</span>
          <span aria-hidden="true">·</span>
          <span>Rangpur 2027 • রংপুর শারদোৎসব</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center gap-2 font-festive">
          Durga Puja 2027 Calendar &amp; Rituals
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm mt-0.5 max-w-xl">
          Complete timetable for Ashwin 1434 BS (October 2027). Explore the spiritual significance of each day and participate in the sacred 108 Diya Sandhi ritual!
        </p>
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PUJA_DAYS_2027.map((day) => {
          const isSelected = selectedDay.dayName === day.dayName;
          return (
            <button
              key={day.dayName}
              onClick={() => setSelectedDay(day)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 font-bold border-amber-600 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
              }`}
            >
              <div className="text-[11px] opacity-80 uppercase tracking-wider">{day.tithi.split(' ')[0]}</div>
              <div className="text-sm font-black truncate">{day.dayName}</div>
              <div className="text-xs font-serif opacity-90 mt-0.5">{day.bengaliName}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Feature Spotlight */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-300 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              {selectedDay.tithi}
            </span>
            <h3 className="text-2xl font-extrabold text-stone-900">
              {selectedDay.dayName} · <span className="font-serif text-rose-700">{selectedDay.bengaliName}</span>
            </h3>
          </div>
          <div className="text-sm font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 self-start sm:self-auto">
            {selectedDay.date}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <strong className="block text-stone-900 font-bold mb-1">Key Sacred Ritual:</strong>
            <p className="text-stone-700 leading-relaxed">{selectedDay.keyRitual}</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200">
            <strong className="block text-stone-900 font-bold mb-1">Cultural Significance:</strong>
            <p className="text-stone-700 leading-relaxed">{selectedDay.significance}</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <strong className="block text-stone-900 font-bold mb-1">Auspicious Time Window:</strong>
            <p className="text-stone-700 font-mono font-semibold">{selectedDay.timing}</p>
          </div>
        </div>
      </div>

      {/* Interactive Sandhi Puja 108 Diyas Offering Simulator */}
      <div className="bg-stone-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sacred Sandhi Puja Ritual Simulator</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1 font-festive">
              The 108 Sacred Lotus &amp; Diya Offering
            </h3>
            <p className="text-xs text-stone-300 mt-0.5 max-w-xl">
              During the auspicious 48 minutes of Sandhi Puja, 108 clay oil lamps and 108 blue lotuses are offered to Maa Chamunda. Click individual lamps or light all 108!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] uppercase text-stone-400 font-bold">Lamps Glowing</div>
              <div className="text-xl font-mono font-black text-amber-400 tabular-nums">
                {litDiyas} / 108
              </div>
            </div>

            <button
              onClick={handleLightAll}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Light All 108</span>
            </button>
          </div>
        </div>

        {/* 108 Diyas Display Grid */}
        <div className="grid grid-cols-9 sm:grid-cols-12 md:grid-cols-18 gap-1.5 p-4 bg-stone-900/90 rounded-2xl border border-stone-800 max-h-60 overflow-y-auto">
          {Array.from({ length: 108 }).map((_, idx) => {
            const isLit = idx < litDiyas;
            return (
              <button
                key={idx}
                onClick={() => toggleDiya(idx)}
                className={`h-7 rounded-lg flex items-center justify-center transition-all ${
                  isLit
                    ? 'bg-amber-500/20 border border-amber-400 shadow-[0_0_8px_#f59e0b]'
                    : 'bg-stone-800/80 border border-stone-700 opacity-40 hover:opacity-80'
                }`}
                title={`Clay Diya #${idx + 1} (${isLit ? 'Glowing' : 'Unlit'})`}
              >
                <Flame className={`w-3.5 h-3.5 ${isLit ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-stone-500'}`} />
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-stone-400">
          <span>🪷 108 Blue Lotuses of Devi Durga</span>
          {litDiyas === 108 && (
            <span className="text-amber-300 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              All 108 Sandhi Lamps Sanctified!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
