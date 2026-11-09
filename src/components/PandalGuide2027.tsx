import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ALL_RANGPUR_PANDALS, PandalInfo } from '../data/pandals';
import { searchPandals } from '../utils/pandalSearch';
import {
  Compass,
  Bike,
  Clock,
  Utensils,
  Check,
  Plus,
  Share2,
  MapPin,
  Sparkles,
  Search,
  ExternalLink,
  ListOrdered,
  X,
} from 'lucide-react';

export const PandalGuide2027: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'City Center' | 'Metropolitan' | 'Rural Sadar'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [viewStyle, setViewStyle] = useState<'cards' | 'table'>('cards');
  const [savedPandals, setSavedPandals] = useState<string[]>([
    'karunamoyee',
    'dharmashava',
    'tajhat_rajbari',
    'mahiganj_nd_hall',
    'palichara_zamindar',
  ]);
  const [selectedPandal, setSelectedPandal] = useState<PandalInfo>(ALL_RANGPUR_PANDALS[0]);
  const [copiedPass, setCopiedPass] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchPandals(ALL_RANGPUR_PANDALS, searchQuery);
  }, [searchQuery]);

  const filtered = useMemo(() => {
    let pool = ALL_RANGPUR_PANDALS;
    if (categoryFilter !== 'all') {
      pool = pool.filter((p) => p.category === categoryFilter);
    }
    if (!searchQuery.trim()) return pool;
    return searchPandals(pool, searchQuery);
  }, [categoryFilter, searchQuery]);

  const toggleSave = (id: string) => {
    if (savedPandals.includes(id)) {
      setSavedPandals(savedPandals.filter((item) => item !== id));
    } else {
      setSavedPandals([...savedPandals, id]);
    }
  };

  const handleCopyPass = () => {
    const list = ALL_RANGPUR_PANDALS.filter((p) => savedPandals.includes(p.id))
      .map((p) => `#${p.serialNumber}. ${p.bengaliName}\n   ঠিকানা: ${p.address}\n   স্ট্যান্ড: ${p.nearestMetro}\n   বিখ্যাত খাবার: ${p.famousFoodNearby}`)
      .join('\n\n');
    const text = `🌸 My Rangpur Durga Puja 2027 Hopping Pass 🌸\nরংপুর শারদোৎসব ২০২৭ মণ্ডপ পরিক্রমা তালিকা (${savedPandals.length} টি মণ্ডপ):\n\n${list}\n\nশুভ শারদীয়া! রংপুর শারদোৎসবে আপনাকে স্বাগতম!`;
    navigator.clipboard.writeText(text);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Visual Feature Banner with Rangpur Pandal & Street Cartoon Art */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-200/80 shadow-xl bg-stone-900">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="md:col-span-5 p-6 md:p-8 space-y-4 text-white z-10">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase">
              <span>Rangpur Mandap Directory 2027</span>
              <span aria-hidden="true">·</span>
              <span>৫০টি ঐতিহাসিক ও গ্রামীণ মণ্ডপ</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-festive">
              রংপুর মণ্ডপ পরিক্রমা ও উৎসব আনন্দ
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              রংপুর শহরের ঐতিহাসিক করুণাময়ী ও ধর্মসভা, তাজহাট ও মাহিগঞ্জ থেকে শুরু করে সদর উপজেলার ঐতিহ্যবাহী পালিচড়া জমিদার বাড়ি সহ ৫০টি পূজামণ্ডপের বিস্তারিত বিবরণ, সঠিক ঠিকানা ও জিপিএস নেভিগেশন।
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1.5 rounded-xl font-medium">
                {savedPandals.length} টি মণ্ডপ আপনার তালিকায় সংরক্ষিত
              </span>
              <button
                onClick={handleCopyPass}
                className="text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-300 px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shadow"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedPass ? 'পাস কপি হয়েছে!' : 'আমার পাস কপি করুন'}</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-7 relative h-64 md:h-80 overflow-hidden">
            <img
              src="/src/assets/images/rangpur_pandal_street_cartoon_1794262928509.jpg"
              alt="Cartoon illustration of Rangpur Durga Puja street scene with battery easy-bike, illuminated arch and chotpoti stall"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/40 to-transparent md:block hidden" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Zone */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-rose-600" />
            রংপুর ৫০টি মণ্ডপের সম্পূর্ণ বিবরণ ও গাইড
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            English বা বাংলায় নাম, সিরিয়াল (#1-#50) বা এলাকা লিখে সহজেই মণ্ডপ খুঁজুন।
          </p>
        </div>

        {/* View Toggle & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setViewStyle('cards')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                viewStyle === 'cards' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
            >
              কার্ড ভিউ
            </button>
            <button
              onClick={() => setViewStyle('table')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                viewStyle === 'table' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
              }`}
            >
              ৫০টি মণ্ডপের তালিকা ভিউ
            </button>
          </div>

          {/* Search Box with Autocomplete Dropdown */}
          <div ref={searchContainerRef} className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="English বা বাংলায় লিখুন (Tajhat, 17, Lalbagh)..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white border border-stone-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 text-stone-900 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchFocused(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Dropdown suggestions */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute right-0 left-0 top-full mt-2 bg-white rounded-2xl border-2 border-amber-400 shadow-2xl max-h-72 overflow-y-auto p-2 space-y-1 z-50 animate-in fade-in">
                <div className="px-2 py-1 text-[10px] font-bold text-stone-500 border-b border-stone-100 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-rose-700">
                    <ListOrdered className="w-3 h-3" />
                    <span>সিরিয়াল অনুসারে ফলাফল</span>
                  </span>
                  <span>{searchResults.length} টি</span>
                </div>

                {searchResults.length > 0 ? (
                  searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPandal(p);
                        setIsSearchFocused(false);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-amber-50 transition-colors flex items-start gap-2"
                    >
                      <span className="text-[11px] font-black bg-rose-700 text-white px-1.5 py-0.5 rounded shrink-0">
                        #{p.serialNumber}
                      </span>
                      <div className="min-w-0">
                        <div className="font-extrabold text-xs text-stone-900 truncate">
                          {p.bengaliName}
                        </div>
                        <div className="text-[10px] text-stone-500 font-serif truncate">
                          {p.name}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-stone-500">
                    কোনো মণ্ডপ মেলেনি
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Category Buttons */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200 overflow-x-auto">
        {[
          { id: 'all', label: 'সব মণ্ডপ (৫০টি)' },
          { id: 'City Center', label: '১. কেন্দ্রস্থল (১৫টি)' },
          { id: 'Metropolitan', label: '২. মহানগর ও শহরতলী (১৫টি)' },
          { id: 'Rural Sadar', label: '৩. সদর গ্রামীণ (২০টি)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id as any)}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              categoryFilter === tab.id
                ? 'bg-stone-900 text-amber-300 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conditional View: 1. Split Card View + Deep-Dive Inspector or 2. Full Table View */}
      {viewStyle === 'cards' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Pandal List Grid (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[760px] overflow-y-auto pr-1">
            {filtered.map((pandal) => {
              const isSaved = savedPandals.includes(pandal.id);
              const isSelected = selectedPandal.id === pandal.id;
              return (
                <div
                  key={pandal.id}
                  onClick={() => setSelectedPandal(pandal)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-400/30'
                      : 'bg-white hover:bg-stone-50/80 border-stone-200 shadow-sm'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black text-white bg-rose-700 px-2 py-0.5 rounded-md">
                        #{pandal.serialNumber}
                      </span>
                      <span className="text-[10px] font-bold text-stone-500 truncate">
                        {pandal.categoryBengali}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(pandal.id);
                        }}
                        className={`p-1.5 rounded-lg border text-xs transition-colors shrink-0 ${
                          isSaved
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-stone-50 text-stone-500 border-stone-200 hover:text-stone-800'
                        }`}
                        title={isSaved ? 'তালিকা থেকে সরান' : 'আমার তালিকায় যোগ করুন'}
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <h4 className="text-base font-extrabold text-stone-900 line-clamp-1">{pandal.bengaliName}</h4>
                    <div className="text-xs text-stone-500 font-serif line-clamp-1">{pandal.name}</div>
                    
                    {/* Address pill */}
                    <div className="text-[11px] text-stone-600 flex items-start gap-1 font-medium bg-stone-50 p-1.5 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{pandal.address}</span>
                    </div>

                    <div className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                      {pandal.highlights}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1 truncate max-w-[160px]">
                      <Bike className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">{pandal.nearestMetro}</span>
                    </span>
                    <span className="font-semibold text-amber-700 shrink-0">~{pandal.currentWaitMins}মি.</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Pandal Deep-Dive Sheet (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-lg flex flex-col justify-between space-y-4 sticky top-20">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white bg-rose-700 px-2.5 py-1 rounded-md">
                  #{selectedPandal.serialNumber} মণ্ডপ
                </span>
                <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
                  {selectedPandal.categoryBengali}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-stone-900">{selectedPandal.bengaliName}</h3>
                <div className="text-xs font-serif text-stone-500">{selectedPandal.name}</div>
              </div>

              {/* Exact Address */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-stone-800 space-y-1">
                <div className="font-bold flex items-center gap-1 text-rose-800">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>সঠিক ঠিকানা ও অবস্থান (Exact Location):</span>
                </div>
                <p className="font-semibold text-stone-900 text-[13px]">{selectedPandal.address}</p>
                <p className="text-[11px] text-stone-600">এলাকা: {selectedPandal.area}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-300/40">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  ২০২৭ বিশেষ আকর্ষণ ও বৈশিষ্ট্য:
                </div>
                <p className="text-xs font-semibold text-stone-800 mt-1 leading-relaxed">
                  {selectedPandal.highlights}
                </p>
                <div className="text-xs text-rose-800 font-bold mt-2">
                  থিম: {selectedPandal.theme2027}
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2">
                  <Bike className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">কাছের ইজিবাইক / রিকশা / অটো স্ট্যান্ড:</strong>
                    <span>{selectedPandal.nearestMetro} · {selectedPandal.walkingDistance}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">দর্শনের সেরা সময়:</strong>
                    <span>{selectedPandal.bestVisitingHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Utensils className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">কাছের বিখ্যাত খাবার:</strong>
                    <span>{selectedPandal.famousFoodNearby}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => toggleSave(selectedPandal.id)}
                className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  savedPandals.includes(selectedPandal.id)
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                {savedPandals.includes(selectedPandal.id) ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>তালিকায় সংরক্ষিত (Saved)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>তালিকায় যোগ করুন</span>
                  </>
                )}
              </button>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPandal.lat},${selectedPandal.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <span>গুগল ম্যাপস</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* Full 50-Mandap Master Table View */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-900 text-white">
                  <th className="p-3.5 font-bold">নং</th>
                  <th className="p-3.5 font-bold">মণ্ডপের নাম ও এলাকা</th>
                  <th className="p-3.5 font-bold">ক্যাটাগরি</th>
                  <th className="p-3.5 font-bold">সঠিক ঠিকানা</th>
                  <th className="p-3.5 font-bold">কাছের যানবাহন স্ট্যান্ড</th>
                  <th className="p-3.5 font-bold">বিশেষ আকর্ষণ</th>
                  <th className="p-3.5 font-bold text-center">ম্যাপস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filtered.map((p) => {
                  const isSelected = selectedPandal.id === p.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedPandal(p)}
                      className={`hover:bg-amber-50/70 transition-colors cursor-pointer ${
                        isSelected ? 'bg-amber-100/60 font-semibold' : ''
                      }`}
                    >
                      <td className="p-3.5 font-black text-rose-700">#{p.serialNumber}</td>
                      <td className="p-3.5 font-bold text-stone-900">
                        <div>{p.bengaliName}</div>
                        <div className="text-[11px] font-normal text-stone-500 font-serif">{p.name}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                          {p.categoryBengali}
                        </span>
                      </td>
                      <td className="p-3.5 text-stone-700 max-w-[220px]">{p.address}</td>
                      <td className="p-3.5 text-stone-600">{p.nearestMetro}</td>
                      <td className="p-3.5 text-stone-600 max-w-[260px] leading-relaxed">{p.highlights}</td>
                      <td className="p-3.5 text-center">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-amber-500 text-stone-950 inline-flex items-center justify-center hover:bg-amber-400 shadow-sm"
                          title="গুগল ম্যাপে নেভিগেট করুন"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
