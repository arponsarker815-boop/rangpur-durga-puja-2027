import React, { useState } from 'react';
import { pujaAudio } from '../utils/audio';
import { Utensils, Heart, Sparkles, MessageCircle } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  bengaliName: string;
  category: 'Street Food' | 'Sacred Bhog' | 'Sweet Delight' | 'Iconic Snack';
  description: string;
  secretIngredient: string;
  famousJoints: string;
  vendorQuote: string;
  cartoonIcon: string;
}

const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'phuchka_chotpoti',
    name: 'Rangpur Tok Phuchka & Chotpoti',
    bengaliName: 'জাহাজ কোম্পানি মোড়ের চটপটি ও ফুচকা',
    category: 'Street Food',
    description: 'Crispy hollow shells loaded with spicy chickpea-potato mash, boiled egg shavings, roasted cumin, green chilies, and sour tamarind-lemon water crafted in the iconic style of Jahaj Company Mor.',
    secretIngredient: 'Desi tamarind pulp infused with Rangpur roasted chili flakes and boiled egg slivers.',
    famousJoints: 'Jahaj Company Mor, Shapla Chhattar, Guptapara Mor.',
    vendorQuote: '“বাহে! ঝাল আর টক একটু বেশি দিমু? গরম চটপটির উপরে ডিমের কুচি!”',
    cartoonIcon: '🥟',
  },
  {
    id: 'mahiganj_peda',
    name: 'Historic Mahiganj Peda',
    bengaliName: 'মাহিগঞ্জের খাঁটি ক্ষীরের প্যাঁড়া',
    category: 'Sweet Delight',
    description: 'Legendary dense, golden sweet fudge handcrafted from thickened pure cow milk (khoya ksheer) and aromatic cardamom. A centuries-old specialty of Mahiganj sweetmakers.',
    secretIngredient: 'Hours of slow-boiling pure cow milk in heavy iron karahi until thick golden reduction.',
    famousJoints: 'Mahiganj Puratan Bazar historic sweet shops, Babupara road.',
    vendorQuote: '“মাহিগঞ্জের খাঁটি ক্ষীরের প্যাঁড়া মুখে দিলেই অমৃত, ২০০ বছরের পারিবারিক রেসিপি!”',
    cartoonIcon: '🍮',
  },
  {
    id: 'bhog',
    name: 'Maha Ashtami Bhog Thali',
    bengaliName: 'অষ্টমীর প্রসাদ ও খিচুড়ি ভোগ',
    category: 'Sacred Bhog',
    description: 'The blessed offering given to Maa Durga: fragrant Chinigura/Kalijira rice and roasted moong dal khichuri cooked in pure ghee, accompanied by seasonal vegetable labra, crisp eggplant beguni, and sweet tomato-khejur chutney.',
    secretIngredient: 'Chinigura aromatic rice slow-cooked with devotion, whole spices, and pure cow ghee.',
    famousJoints: 'Rangpur Dharmashava Mandir, Dimla Rajbari, Karunamoyee Mandir.',
    vendorQuote: '“মা দুর্গার প্রসাদ খিচুড়ি আর লাবড়ার তৃপ্তি কোনো রেস্তোরাঁয় মিলবে না!”',
    cartoonIcon: '🍚',
  },
  {
    id: 'station_chaap',
    name: 'Station Road Moghlai & Chaap',
    bengaliName: 'স্টেশন রোডের মোগলাই ও কাবাব',
    category: 'Iconic Snack',
    description: 'Crisp golden layered paratha stuffed with spicy minced egg, onions, and coriander, served alongside spicy slow-cooked chicken/beef chaap and fresh cucumber salad after late night mandap hopping.',
    secretIngredient: 'Crispy flaky pastry dough fried in pure ghee, served with special roasted gravy.',
    famousJoints: 'Rangpur Railway Station Road, GL Roy Road night stalls.',
    vendorQuote: '“মণ্ডপ দেখে রাত বারোটায় গরম মোগলাই আর লাল চা—পুজোর আসল আড্ডা!”',
    cartoonIcon: '🌯',
  },
  {
    id: 'haribhanga_doi',
    name: 'Rangpur Sweet Curd & Chomchom',
    bengaliName: 'হাঁড়িভাঙ্গা মিষ্টি দই ও রসালো চমচম',
    category: 'Sweet Delight',
    description: 'Rich caramelized sweet yogurt traditionally set in clay handis, accompanied by soft juicy chomchom sprinkled with mawa flakes.',
    secretIngredient: 'Natural fermentation in baked North Bengal clay pots that locks in dense creaminess.',
    famousJoints: 'Central Road Mishti Mela, Senpara sweet houses, Jahaj Company shops.',
    vendorQuote: '“মাটির ভাঁড়ের ঠান্ডা মিষ্টি দই ছাড়া পুজো পরিক্রমা অসম্পূর্ণ!”',
    cartoonIcon: '🍯',
  },
];

export const PujoFoodBazaar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<FoodItem>(FOOD_ITEMS[0]);
  const [phuchkaCount, setPhuchkaCount] = useState<number>(0);
  const [vendorShout, setVendorShout] = useState<string>(FOOD_ITEMS[0].vendorQuote);

  const handleTaste = (food: FoodItem) => {
    setActiveItem(food);
    setVendorShout(food.vendorQuote);
    pujaAudio.playStickClick(0.9);
  };

  const eatPhuchka = () => {
    setPhuchkaCount((c) => c + 1);
    pujaAudio.playDhakRim(520, 0.7);
    const shouts = [
      '“বাহে, আরও একবাটি ঝাল চটপটি!”',
      '“জাহাজ কোম্পানির আসল টক ফুচকা!”',
      '“মাহিগঞ্জের প্যাঁড়া এক টুকরো মুখে দেন!”',
      '“গরম মোগলাই সাথে স্পেশাল তেঁতুলের সস!”',
    ];
    setVendorShout(shouts[Math.floor(Math.random() * shouts.length)]);
  };

  return (
    <div className="bg-amber-100/40 rounded-3xl p-6 md:p-8 border border-amber-200/80 shadow-md space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <span>Rangpur Traditional Gastronomy &amp; Prasadam</span>
            <span aria-hidden="true">·</span>
            <span>রংপুর ২০২৭</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 flex items-center gap-2 font-festive">
            রংপুরিয়া পুজোর ভোজ ও স্ট্রিট ফুড বাজার
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-0.5 max-w-xl">
            মণ্ডপ ঘোরার ফাঁকে জাহাজ কোম্পানি মোড়ের স্পেশাল চটপটি, মাহিগঞ্জের ক্ষীরের প্যাঁড়া আর অষ্টমীর মহাভোগের খাঁটি স্বাদ উপভোগ করুন!
          </p>
        </div>

        {/* Interactive Phuchka Counter Widget */}
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-amber-300 shadow-sm">
          <div className="text-2xl">🥟</div>
          <div>
            <div className="text-[10px] text-stone-500 uppercase font-bold">ফুচকা খাওয়ার স্কোর</div>
            <div className="text-lg font-black text-amber-700 font-mono tabular-nums leading-none">
              {phuchkaCount} টি ফুচকা
            </div>
          </div>
          <button
            onClick={eatPhuchka}
            className="ml-2 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-sm transition-transform active:scale-95"
          >
            ক্রাঞ্চ +১!
          </button>
        </div>
      </div>

      {/* Main Interactive Stall Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Dish Selection Cards */}
        <div className="lg:col-span-5 space-y-2.5">
          {FOOD_ITEMS.map((item) => {
            const isSelected = activeItem.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTaste(item)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-300/40'
                    : 'bg-white/70 hover:bg-white border-amber-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-amber-50 border border-amber-200/60">
                    {item.cartoonIcon}
                  </span>
                  <div>
                    <div className="font-bold text-sm text-stone-900">{item.bengaliName}</div>
                    <div className="text-xs text-rose-700 font-serif">{item.name}</div>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full shrink-0">
                  {item.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Dish Feature Showcase with Cartoon Vendor Bubble */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-amber-300 shadow-lg relative">
          {/* Vendor Speech Bubble */}
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-stone-800">রংপুরিয়া আড্ডা ও স্বাদ:</div>
              <p className="text-xs sm:text-sm text-stone-700 italic mt-0.5 font-medium">
                {vendorShout}
              </p>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                {activeItem.category}
              </span>
              <h3 className="text-2xl font-extrabold text-stone-900 mt-0.5">
                {activeItem.bengaliName} <span className="text-sm font-serif text-stone-500">({activeItem.name})</span>
              </h3>
            </div>
            <span className="text-4xl">{activeItem.cartoonIcon}</span>
          </div>

          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-6">
            {activeItem.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-stone-200">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                ঐতিহ্যবাহী গোপন রেসিপি:
              </span>
              <span className="text-stone-600 leading-normal">{activeItem.secretIngredient}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1 flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-rose-600" />
                রংপুরের বিখ্যাত স্থান:
              </span>
              <span className="text-stone-600 leading-normal">{activeItem.famousJoints}</span>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => handleTaste(activeItem)}
              className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>এই খাবারের স্বাদ নিন!</span>
            </button>
            <span className="text-xs text-stone-400">রংপুর শারদোৎসব ২০২৭ স্পেশাল</span>
          </div>
        </div>
      </div>
    </div>
  );
};
