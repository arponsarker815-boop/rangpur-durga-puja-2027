import React, { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { InteractivePandalMap } from './components/InteractivePandalMap';
import { CartoonFamilyPlayground } from './components/CartoonFamilyPlayground';
import { AlponaStudio } from './components/AlponaStudio';
import { DhakStudio } from './components/DhakStudio';
import { DhunuchiGame } from './components/DhunuchiGame';
import { PandalGuide2027 } from './components/PandalGuide2027';
import { PujoFoodBazaar } from './components/PujoFoodBazaar';
import { PujaCalendar2027 } from './components/PujaCalendar2027';
import { GreetingCardMaker } from './components/GreetingCardMaker';
import { FallingAutumnDecor } from './components/FallingAutumnDecor';
import { BengaliBorderNoksha } from './components/AlponaMotifs';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeNav, setActiveNav] = useState('hero');

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf7] text-stone-900 selection:bg-rose-500 selection:text-white flex flex-col relative font-sans">
      {/* Falling Kash Phool & Shiuli Canvas Decor + Swaying Bottom Stalks */}
      <FallingAutumnDecor />

      {/* Top Bar adhering to 3-Zone Contract */}
      <header className="sticky top-0 z-30 bg-[#fffdf7]/90 backdrop-blur-md border-b border-amber-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
            className="text-lg sm:text-xl font-extrabold tracking-tight text-rose-700 whitespace-nowrap shrink-0 font-festive flex items-center gap-1.5"
          >
            <span>Rangpur Durga Puja 2027 • রংপুর শারদোৎসব</span>
          </a>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-stone-600">
            <button
              onClick={() => scrollToSection('map')}
              className={`hover:text-rose-700 transition-colors whitespace-nowrap shrink-0 ${
                activeNav === 'map' ? 'text-rose-700 font-bold' : ''
              }`}
            >
              মণ্ডপ ম্যাপ ও রুট
            </button>
            <button
              onClick={() => scrollToSection('cartoon-family')}
              className={`hover:text-rose-700 transition-colors whitespace-nowrap shrink-0 ${
                activeNav === 'cartoon-family' ? 'text-rose-700 font-bold' : ''
              }`}
            >
              কার্টুন পরিবার
            </button>
            <button
              onClick={() => scrollToSection('dhak')}
              className={`hover:text-rose-700 transition-colors whitespace-nowrap shrink-0 ${
                activeNav === 'dhak' ? 'text-rose-700 font-bold' : ''
              }`}
            >
              ঢাকের বোল
            </button>
            <button
              onClick={() => scrollToSection('alpona')}
              className={`hover:text-rose-700 transition-colors whitespace-nowrap shrink-0 ${
                activeNav === 'alpona' ? 'text-rose-700 font-bold' : ''
              }`}
            >
              আলপনা স্টুডিও
            </button>
            <button
              onClick={() => scrollToSection('dhunuchi')}
              className={`hover:text-rose-700 transition-colors whitespace-nowrap shrink-0 ${
                activeNav === 'dhunuchi' ? 'text-rose-700 font-bold' : ''
              }`}
            >
              ধুনুচি নাচ
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => scrollToSection('greetings')}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>শারদ শুভেচ্ছা পাঠান</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 space-y-16 sm:space-y-24 pb-20">
        {/* Section 1: Hero Section with Countdown, Rangpur Artwork & Festive Audio */}
        <section id="hero">
          <HeroSection onNavigate={scrollToSection} />
        </section>

        {/* Decorative Bengali Alpona Ribbon Border */}
        <BengaliBorderNoksha className="my-2" />

        {/* Section 2: Interactive Rangpur Mandap Map, Live Crowd & Route Hopper */}
        <section id="map" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractivePandalMap />
        </section>

        {/* Decorative Bengali Alpona Ribbon Border */}
        <BengaliBorderNoksha className="my-2" />

        {/* Section 3: Durga Paribar Cartoon Playground (Ganesha, Saraswati, Lakshmi, Kartikeya, Lion) */}
        <section id="cartoon-family" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CartoonFamilyPlayground />
        </section>

        {/* Section 4: Interactive Dhak Studio */}
        <section id="dhak" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DhakStudio />
        </section>

        {/* Decorative Bengali Alpona Ribbon Border */}
        <BengaliBorderNoksha className="my-2" />

        {/* Section 5: Animated Alpona & Colorful Noksha Studio with Kash Phool */}
        <section id="alpona" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AlponaStudio />
        </section>

        {/* Section 6: Cartoon Dhunuchi Naach Arcade Rhythm Game */}
        <section id="dhunuchi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DhunuchiGame />
        </section>

        {/* Decorative Bengali Alpona Ribbon Border */}
        <BengaliBorderNoksha className="my-2" />

        {/* Section 7: Rangpur 2027 Mandap Hopping Directory */}
        <section id="pandals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PandalGuide2027 />
        </section>

        {/* Section 8: Pujor Food & Bhog Bazaar */}
        <section id="food" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PujoFoodBazaar />
        </section>

        {/* Section 9: 2027 Calendar & 108 Diya Sandhi Ritual */}
        <section id="calendar" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PujaCalendar2027 />
        </section>

        {/* Section 10: Shubho Sharodiya E-Greeting Card Maker */}
        <section id="greetings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GreetingCardMaker />
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800">
            <div>
              <div className="text-xl font-bold text-amber-400 font-festive">
                Rangpur Durga Puja 2027 • রংপুর শারদোৎসব
              </div>
              <p className="text-xs text-stone-400 mt-1 max-w-md">
                ঐতিহাসিক ধর্মসভা মন্দির, ডিমলা রাজবাড়ি, তাজহাট রাজপ্রাসাদ ও উত্তরবঙ্গের ঐতিহ্যবাহী সংস্কৃতি। সার্বজনীন সৌহার্দ্য ও সম্প্রীতির উৎসব।
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs text-stone-400">
              <button onClick={() => scrollToSection('hero')} className="hover:text-amber-400 transition-colors">
                উপরে যান
              </button>
              <button onClick={() => scrollToSection('dhak')} className="hover:text-amber-400 transition-colors">
                ঢাক স্টুডিও
              </button>
              <button onClick={() => scrollToSection('pandals')} className="hover:text-amber-400 transition-colors">
                মণ্ডপ তালিকা
              </button>
              <button onClick={() => scrollToSection('greetings')} className="hover:text-amber-400 transition-colors">
                শুভেচ্ছা কার্ড
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
            <div>
              © 2027 Rangpur Sharodotsav Guide (Bangladesh) · শুভ শারদীয়া
            </div>
            <div className="flex items-center gap-1.5 text-stone-300">
              <span>Made with love</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>for Rangpur, Bangladesh</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
