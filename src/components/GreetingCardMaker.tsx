import React, { useState } from 'react';
import { Copy, Check, Download, Sparkles, Heart } from 'lucide-react';

interface GreetingCardMakerProps {
  onWishCreated?: () => void;
}

const PRESET_MESSAGES = [
  {
    title: 'Warm Rangpur Sharodiya Greetings',
    bengali: 'শুভ শারদীয়া! মা দুর্গার আশীর্বাদে রংপুরবাসীর প্রতিটি ঘর আনন্দে, শান্তিতে, সুস্বাস্থ্যে ও সমৃদ্ধিতে ভরে উঠুক।',
    english: 'Warm Sharodiya greetings! May Goddess Durga shower peace, happiness, and prosperity upon your family in Rangpur and beyond.',
  },
  {
    title: 'Ghaghot Breeze & Autumn Melody',
    bengali: 'তিস্তা ও ঘাঘটের কূলে কাশফুলের শুভ্র দোলা, ঢাকের তালে মুখরিত চারপাশ। মা আসছেন ২০২৭-এ সবার মাঝে সম্প্রীতি ও আনন্দ নিয়ে!',
    english: 'Autumn breeze over Ghaghot river and rhythmic dhak beats—Maa Durga arrives with harmony and joy in Rangpur 2027!',
  },
  {
    title: 'Rangpuria Pujo Masti & Adda',
    bengali: 'বাহে, ধর্মসভা থেকে ডিমলা রাজবাড়ি ও তাজহাট—মণ্ডপে মণ্ডপে ইজিবাইকে ঘোরা আর আড্ডা! হৈ হুল্লোড়ে কাটুক রংপুর শারদোৎসব ২০২৭!',
    english: 'Hopping between Dharmashava and Tajhat Rajbari on easy-bikes with friends—wishing you an unforgettable Rangpur Durga Puja 2027!',
  },
  {
    title: 'Subho Bijoya Blessing',
    bengali: 'রংপুর শারদোৎসবের বিজয়ার আন্তরিক প্রীতি ও ভালোবাসা। বড়দের শ্রদ্ধা ও ছোটদের প্রাণঢালা আশীর্বাদ। শুভ বিজয়া ২০২৭!',
    english: 'Heartfelt Subho Bijoya wishes from Rangpur! Respects to elders and love to young ones for a blessed year ahead.',
  },
];

const CARD_BACKGROUNDS = [
  {
    id: 'rangpur_durga',
    label: 'রংপুর তাজহাট ও দুর্গা',
    image: '/src/assets/images/rangpur_durga_cartoon_hero_1794262927895.jpg',
  },
  {
    id: 'rangpur_street',
    label: 'রংপুর মণ্ডপ ও ইজিবাইক',
    image: '/src/assets/images/rangpur_pandal_street_cartoon_1794262928509.jpg',
  },
  {
    id: 'dhaki',
    label: 'ঢাকি ও ধুনুচি নাচ',
    image: '/src/assets/images/cartoon_dhaki_dhunuchi_1794260145095.jpg',
  },
];

export const GreetingCardMaker: React.FC<GreetingCardMakerProps> = () => {
  const [selectedBg, setSelectedBg] = useState(CARD_BACKGROUNDS[0]);
  const [selectedPreset, setSelectedPreset] = useState(PRESET_MESSAGES[0]);
  const [recipient, setRecipient] = useState('প্রিয়জন (Priyojon)');
  const [sender, setSender] = useState('রংপুর থেকে শারদ শুভেচ্ছা (From Rangpur with Love)');
  const [customWish, setCustomWish] = useState(PRESET_MESSAGES[0].bengali);
  const [copied, setCopied] = useState(false);

  const handleCopyWish = () => {
    const cardText = `🌸 শুভ শারদীয়া ২০২৭ • Rangpur Durga Puja 🌸\n\nTo: ${recipient}\n\n${customWish}\n\n— ${sender}\n\nরংপুর শারদোৎসব ২০২৭ উদযাপন করুন!`;
    navigator.clipboard.writeText(cardText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-amber-200/80 shadow-xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <span>Festival Greetings Maker</span>
            <span aria-hidden="true">·</span>
            <span>রংপুর শারদোৎসব ২০২৭</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center gap-2 font-festive">
            কার্টুন শারদীয়া শুভেচ্ছা কার্ড তৈরি করুন
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-0.5 max-w-xl">
            রংপুরের তাজহাট রাজবাড়ি ও মণ্ডপের কার্টুন চিত্র সহ নিজের নাম ও শুভেচ্ছা বার্তা দিয়ে শুভ শারদীয়া ডিজিটাল কার্ড তৈরি করে ফেসবুক, হোয়াটসঅ্যাপে শেয়ার করুন।
          </p>
        </div>

        <button
          onClick={handleCopyWish}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors flex items-center gap-1.5 shadow self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'কার্ড বার্তা কপি হয়েছে!' : 'শুভেচ্ছা কার্ড কপি করুন'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Customization */}
        <div className="lg:col-span-6 space-y-6">
          {/* Background selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              ১. কার্টুন ব্যাকগ্রাউন্ড নির্বাচন করুন
            </label>
            <div className="grid grid-cols-3 gap-3">
              {CARD_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setSelectedBg(bg)}
                  className={`p-2 rounded-2xl border transition-all text-left group overflow-hidden ${
                    selectedBg.id === bg.id
                      ? 'border-amber-500 ring-2 ring-amber-400/50 shadow-md'
                      : 'border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <img
                    src={bg.image}
                    alt={bg.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-16 object-cover rounded-xl mb-1.5 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[11px] font-semibold text-stone-800 block truncate">
                    {bg.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient & Sender input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                কার জন্য শুভেচ্ছা (Recipient Name)
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="যেমন: মা-বাবা, প্রিয় বন্ধু, পরিবার"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-stone-900 bg-stone-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                আপনার নাম (Sender Name)
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="যেমন: রংপুর থেকে শুভ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-stone-900 bg-stone-50"
              />
            </div>
          </div>

          {/* Preset Wishes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              ২. বাংলা শুভেচ্ছা বার্তা নির্বাচন করুন
            </label>
            <div className="space-y-2">
              {PRESET_MESSAGES.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPreset(msg);
                    setCustomWish(msg.bengali);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                    selectedPreset.title === msg.title
                      ? 'bg-amber-50/80 border-amber-500 text-stone-900 font-medium'
                      : 'bg-stone-50 hover:bg-stone-100/70 border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="font-bold text-rose-700">{msg.title}</div>
                  <div className="text-[11px] text-stone-600 line-clamp-1 font-serif mt-0.5">
                    {msg.bengali}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Edit Wish Textarea */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              ৩. শুভেচ্ছা বার্তা সম্পাদনা করুন (Edit Wish)
            </label>
            <textarea
              rows={3}
              value={customWish}
              onChange={(e) => setCustomWish(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm text-stone-900 bg-stone-50 font-serif"
            />
          </div>
        </div>

        {/* Right Column: Live Card Preview */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-md rounded-3xl overflow-hidden border-2 border-amber-300 shadow-2xl relative bg-stone-950 text-white">
            {/* Card Background image */}
            <div className="relative h-60 w-full overflow-hidden">
              <img
                src={selectedBg.image}
                alt={selectedBg.label}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-3 left-3 bg-rose-600/90 backdrop-blur-sm text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest border border-rose-400">
                রংপুর শারদোৎসব ২০২৭
              </div>
            </div>

            {/* Card Letter Body */}
            <div className="p-6 space-y-4 relative -mt-6 bg-stone-950/95 backdrop-blur-md rounded-t-3xl border-t border-amber-400/30">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-xs text-amber-400 font-semibold font-mono">
                  TO: <strong className="text-white font-sans">{recipient}</strong>
                </span>
                <span className="text-[11px] text-stone-400">রংপুর ২০২৭</span>
              </div>

              <div className="py-2">
                <p className="text-sm sm:text-base text-amber-100 font-serif leading-relaxed italic">
                  &ldquo;{customWish}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-400">শারদ প্রীতি ও শুভেচ্ছাসহ,</span>
                <span className="font-bold text-amber-400 font-serif">{sender}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-500 mt-4 text-center">
            উপরে <strong>&quot;শুভেচ্ছা কার্ড কপি করুন&quot;</strong> বোতামে ক্লিক করে সহজেই সামাজিক মাধ্যমে শেয়ার করুন!
          </p>
        </div>
      </div>
    </div>
  );
};
