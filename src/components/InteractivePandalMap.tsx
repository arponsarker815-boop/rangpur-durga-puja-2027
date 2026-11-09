import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ALL_RANGPUR_PANDALS, PandalInfo } from '../data/pandals';
import { searchPandals } from '../utils/pandalSearch';
import { pujaAudio } from '../utils/audio';
import {
  MapPin,
  Navigation,
  Clock,
  Compass,
  Search,
  ExternalLink,
  Sparkles,
  Route,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Bike,
  Building2,
  Trees,
  Landmark,
  Eye,
  X,
  ListOrdered,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  LocateFixed,
  Maximize2,
  Minimize2,
  Layers,
  Footprints,
} from 'lucide-react';

// Haversine formula to calculate accurate distance between two GPS coordinates in meters
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Convert real-world Rangpur GPS lat/lng into SVG (0-100) coordinates
function gpsToSvgCoords(lat: number, lng: number): { x: number; y: number } {
  // Approximate bounding box of Rangpur Greater Sadar
  const minLng = 89.15;
  const maxLng = 89.35;
  const minLat = 25.68;
  const maxLat = 25.82;

  const x = Math.max(5, Math.min(95, ((lng - minLng) / (maxLng - minLng)) * 100));
  // Invert Y since SVG 0 is at the top (North)
  const y = Math.max(5, Math.min(95, ((maxLat - lat) / (maxLat - minLat)) * 100));

  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

export const InteractivePandalMap: React.FC = () => {
  const [selectedPandal, setSelectedPandal] = useState<PandalInfo>(ALL_RANGPUR_PANDALS[0]);
  const [hoveredPandal, setHoveredPandal] = useState<PandalInfo | null>(null);
  const [currentLocationId, setCurrentLocationId] = useState<string>('karunamoyee'); // Default at Karunamoyee Kalibari
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'City Center' | 'Metropolitan' | 'Rural Sadar'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'latenight'>('evening');
  const [showAllLabels, setShowAllLabels] = useState(true);
  const [showAlleyNames, setShowAlleyNames] = useState(true);

  // Zoom & Pan System
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapTheme, setMapTheme] = useState<'street' | 'dark' | 'satellite'>('street');

  // Live GPS Tracking state
  const [isTracking, setIsTracking] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
    mapX: number;
    mapY: number;
    isSimulated?: boolean;
  } | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mapViewportRef = useRef<HTMLDivElement>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastTouchDistanceRef = useRef<number | null>(null);

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

  // Cleanup geolocation watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const currentPandal = useMemo(
    () => ALL_RANGPUR_PANDALS.find((p) => p.id === currentLocationId) || ALL_RANGPUR_PANDALS[0],
    [currentLocationId]
  );

  // Live matching pandals based on English / Bengali search query (sorted by relevance and serial number)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchPandals(ALL_RANGPUR_PANDALS, searchQuery);
  }, [searchQuery]);

  // Filtered pandals for map display and listing
  const filteredPandals = useMemo(() => {
    let pool = ALL_RANGPUR_PANDALS;
    if (categoryFilter !== 'All') {
      pool = pool.filter((p) => p.category === categoryFilter);
    }
    if (!searchQuery.trim()) return pool;
    return searchPandals(pool, searchQuery);
  }, [categoryFilter, searchQuery]);

  // Closest pandal to user's live GPS location
  const nearestPandalToUser = useMemo(() => {
    if (!userLocation) return null;
    let closest: PandalInfo = ALL_RANGPUR_PANDALS[0];
    let minDistance = Infinity;

    for (const p of ALL_RANGPUR_PANDALS) {
      const d = calculateHaversineDistance(userLocation.lat, userLocation.lng, p.lat, p.lng);
      if (d < minDistance) {
        minDistance = d;
        closest = p;
      }
    }

    return { pandal: closest, distanceM: minDistance };
  }, [userLocation]);

  // Distance from user's live GPS to the currently selected pandal
  const distanceToSelected = useMemo(() => {
    if (!userLocation) return null;
    return calculateHaversineDistance(userLocation.lat, userLocation.lng, selectedPandal.lat, selectedPandal.lng);
  }, [userLocation, selectedPandal]);

  // Dynamic crowd wait multiplier depending on time of day
  const getDynamicCrowd = (baseLevel: string, waitMins: number) => {
    let multiplier = 1.0;
    if (timeOfDay === 'morning') multiplier = 0.35;
    else if (timeOfDay === 'afternoon') multiplier = 0.65;
    else if (timeOfDay === 'evening') multiplier = 1.25;
    else if (timeOfDay === 'latenight') multiplier = 0.8;

    const dynamicWait = Math.round(waitMins * multiplier);
    let level: 'Low' | 'Moderate' | 'High' | 'Mega Crowd' = 'Moderate';
    let badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    let dotColor = '#f59e0b';

    if (dynamicWait < 20) {
      level = 'Low';
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      dotColor = '#10b981';
    } else if (dynamicWait <= 40) {
      level = 'Moderate';
      badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
      dotColor = '#f59e0b';
    } else if (dynamicWait <= 60) {
      level = 'High';
      badgeColor = 'bg-orange-100 text-orange-800 border-orange-300';
      dotColor = '#f97316';
    } else {
      level = 'Mega Crowd';
      badgeColor = 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
      dotColor = '#dc2626';
    }

    return { dynamicWait, level, badgeColor, dotColor };
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setZoom((prev) => {
      const next = Math.min(3.8, prev + 0.4);
      pujaAudio.playStickClick(0.5);
      return Math.round(next * 10) / 10;
    });
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(1, prev - 0.4);
      if (next <= 1) {
        setPan({ x: 0, y: 0 });
      }
      pujaAudio.playStickClick(0.5);
      return Math.round(next * 10) / 10;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    pujaAudio.playStickClick(0.5);
  };

  // Focus zoom on Rangpur dense city center (Jahaj Company, Guptapara, Station Road)
  const handleFocusCityCenter = () => {
    setZoom(2.4);
    // Center around mapX: 49, mapY: 46
    setPan({ x: -18, y: -16 });
    pujaAudio.playGhanta();
  };

  // Center view on a specific pandal
  const handleCenterOnPandal = useCallback((pandal: PandalInfo) => {
    setSelectedPandal(pandal);
    const targetZoom = 2.5;
    setZoom(targetZoom);
    // Calculate pan so that (pandal.mapX, pandal.mapY) is centered in the 100x100 viewBox
    const panX = (50 - pandal.mapX) * 0.9;
    const panY = (50 - pandal.mapY) * 0.9;
    setPan({ x: Math.max(-50, Math.min(50, panX)), y: Math.max(-50, Math.min(50, panY)) });
    pujaAudio.playStickClick(0.7);
  }, []);

  const handleSelectPandal = (pandal: PandalInfo) => {
    setSelectedPandal(pandal);
    pujaAudio.playStickClick(0.7);
  };

  const handleSelectFromSearch = (pandal: PandalInfo) => {
    setSelectedPandal(pandal);
    setIsSearchFocused(false);
    handleCenterOnPandal(pandal);
    pujaAudio.playGhanta();
  };

  const handleSetCurrentLocation = (pandalId: string) => {
    setCurrentLocationId(pandalId);
    const p = ALL_RANGPUR_PANDALS.find((item) => item.id === pandalId);
    if (p) {
      setSelectedPandal(p);
      handleCenterOnPandal(p);
    }
    pujaAudio.playGhanta();
  };

  // Mouse drag handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    const maxOffset = (zoom - 1) * 35;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPan({
      x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
      y: Math.max(-maxOffset, Math.min(maxOffset, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag & pinch zoom handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistanceRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && zoom > 1) {
      const maxOffset = (zoom - 1) * 35;
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      setPan({
        x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
        y: Math.max(-maxOffset, Math.min(maxOffset, newY)),
      });
    } else if (e.touches.length === 2 && lastTouchDistanceRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist - lastTouchDistanceRef.current;
      if (Math.abs(delta) > 10) {
        if (delta > 0) {
          setZoom((prev) => Math.min(3.8, prev + 0.15));
        } else {
          setZoom((prev) => Math.max(1, prev - 0.15));
        }
        lastTouchDistanceRef.current = dist;
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouchDistanceRef.current = null;
  };

  // Live GPS Tracking Toggle
  const toggleLiveTracking = () => {
    if (isTracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsTracking(false);
      setUserLocation(null);
      setGpsError(null);
      return;
    }

    if (!('geolocation' in navigator)) {
      setGpsError('আপনার ব্রাউজারে জিপিএস সুবিধা পাওয়া যায়নি।');
      return;
    }

    setGpsError(null);
    setIsTracking(true);
    pujaAudio.playGhanta();

    // Use watchPosition for real-time live navigation
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        // Check if user is within or near Rangpur region (25.4 to 26.0 Lat, 88.8 to 89.6 Lng)
        const isNearRangpur =
          latitude >= 25.4 && latitude <= 26.1 && longitude >= 88.8 && longitude <= 89.6;

        let mapCoords = gpsToSvgCoords(latitude, longitude);

        if (!isNearRangpur) {
          // If user is accessing from outside Rangpur (e.g. Dhaka or abroad), simulate at Jahaj Company / Karunamoyee
          // but show real distance notice
          mapCoords = { x: 49, y: 44 };
          setUserLocation({
            lat: latitude,
            lng: longitude,
            accuracy,
            mapX: 49,
            mapY: 44,
            isSimulated: true,
          });
        } else {
          setUserLocation({
            lat: latitude,
            lng: longitude,
            accuracy,
            mapX: mapCoords.x,
            mapY: mapCoords.y,
            isSimulated: false,
          });
        }
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        // Fallback simulation mode so user can test tracking seamlessly
        setGpsError('জিপিএস এক্সেস পাওয়া যায়নি। রংপুর কেন্দ্রস্থলে ডেমো লাইভ ট্র্যাকিং সক্রিয় করা হয়েছে।');
        setUserLocation({
          lat: 25.7462,
          lng: 89.2415,
          accuracy: 15,
          mapX: 47.5,
          mapY: 45,
          isSimulated: true,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );
  };

  // Center map on user's live position
  const handleCenterOnUser = () => {
    if (!userLocation) {
      toggleLiveTracking();
      return;
    }
    setZoom(2.8);
    const panX = (50 - userLocation.mapX) * 0.9;
    const panY = (50 - userLocation.mapY) * 0.9;
    setPan({ x: Math.max(-50, Math.min(50, panX)), y: Math.max(-50, Math.min(50, panY)) });
    pujaAudio.playGhanta();
  };

  // Google Maps external directions URL for exact Rangpur coordinates
  const getGoogleMapsDirectionsUrl = (destination: PandalInfo) => {
    if (userLocation && !userLocation.isSimulated) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destination.lat},${destination.lng}&travelmode=walking`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`;
  };

  const getCategoryColor = (cat: 'City Center' | 'Metropolitan' | 'Rural Sadar') => {
    if (cat === 'City Center') return { fill: '#e11d48', stroke: '#fbbf24', text: 'text-rose-700' };
    if (cat === 'Metropolitan') return { fill: '#4f46e5', stroke: '#38bdf8', text: 'text-indigo-700' };
    return { fill: '#059669', stroke: '#34d399', text: 'text-emerald-700' };
  };

  const activeDisplayPandal = hoveredPandal || selectedPandal;
  const activeCrowd = getDynamicCrowd(activeDisplayPandal.baseCrowdLevel, activeDisplayPandal.currentWaitMins);

  return (
    <div
      className={`bg-[#fffef8] rounded-3xl p-4 sm:p-7 border border-amber-200/90 shadow-2xl space-y-6 relative ${
        isFullscreen ? 'fixed inset-2 z-50 overflow-y-auto bg-white p-4 shadow-2xl' : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs tracking-wider uppercase mb-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Rangpur Durga Puja 2027 • ৫০টি প্রধান মণ্ডপ
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-bold">লাইভ জিপিএস ট্র্যাকিং ও অলিগলি ম্যাপ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 flex items-center gap-2 font-festive">
            রংপুর শহর ও সদর উপজেলার অলিগলি ও লাইভ ম্যাপ
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-3xl">
            গুগল ম্যাপসের নিখুঁত অলিগলি ও সংযোগ সড়ক, <strong>জুম ইন/আউট (+/-)</strong>, লাইভ <strong>GPS ট্র্যাকিং</strong>, আপনার অবস্থান থেকে নিকটতম মণ্ডপ দূরত্ব এবং English &amp; বাংলা সার্চের পূর্ণ সুবিধা।
          </p>
        </div>

        {/* Live GPS & Simulation Strip */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
          <button
            onClick={toggleLiveTracking}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border ${
              isTracking
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 ring-2 ring-emerald-300 animate-pulse'
                : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
          >
            <LocateFixed className="w-4 h-4 text-emerald-300" />
            <span>{isTracking ? 'লাইভ জিপিএস সক্রিয় (ON)' : 'আমার লাইভ লোকেশন চালু করুন'}</span>
          </button>

          {/* Time of Day Congestion Simulator */}
          <div className="bg-amber-50 p-2 rounded-xl border border-amber-200 flex items-center gap-1 text-[11px] font-bold text-stone-700">
            <Clock className="w-3.5 h-3.5 text-rose-700 shrink-0" />
            {(['morning', 'afternoon', 'evening', 'latenight'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeOfDay(t)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                  timeOfDay === t
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                {t === 'morning' ? 'সকাল' : t === 'afternoon' ? 'দুপুর' : t === 'evening' ? 'সন্ধ্যা' : 'রাত'}
              </button>
            ))}
          </div>

          {/* Fullscreen Expand Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700"
            title={isFullscreen ? 'সাধারণ স্ক্রিন' : 'ফুল স্ক্রিন ম্যাপ'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* GPS Status Banner when Active */}
      {isTracking && userLocation && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <div>
              <span className="font-extrabold text-emerald-950">
                {userLocation.isSimulated
                  ? 'রংপুর কেন্দ্রস্থল সিমুলেশন মোড (Jahaj Company - Karunamoyee Center)'
                  : 'আপনার রিয়েল-টাইম GPS লোকেশন চালু আছে'}
              </span>
              <span className="text-emerald-800 ml-2">
                (সঠিকতা: ±{Math.round(userLocation.accuracy)} মি.)
              </span>
            </div>
          </div>

          {nearestPandalToUser && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-stone-700">সবচেয়ে কাছে:</span>
              <button
                onClick={() => handleCenterOnPandal(nearestPandalToUser.pandal)}
                className="bg-emerald-700 text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 hover:bg-emerald-800 transition-colors shadow-sm"
              >
                <Footprints className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  #{nearestPandalToUser.pandal.serialNumber}. {nearestPandalToUser.pandal.bengaliName} (
                  {nearestPandalToUser.distanceM >= 1000
                    ? `${(nearestPandalToUser.distanceM / 1000).toFixed(1)} কি.মি.`
                    : `${nearestPandalToUser.distanceM} মি.`}
                  )
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {gpsError && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{gpsError}</span>
          </div>
          <button
            onClick={() => setGpsError(null)}
            className="text-stone-500 hover:text-stone-800 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick 1-50 Number Pills Navigator Bar */}
      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-300 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-amber-950">
          <span className="flex items-center gap-1.5 text-rose-800">
            <Sparkles className="w-4 h-4 text-rose-600" />
            দ্রুত সিরিয়াল নেভিগেটর (১ থেকে ৫০ যেকোনো নম্বরে ট্যাপ করে সরাসরি জুম ও ম্যাপে দেখুন):
          </span>
          <span className="text-[11px] text-stone-600 hidden sm:inline">
            নির্বাচিত: #{selectedPandal.serialNumber}. {selectedPandal.bengaliName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {ALL_RANGPUR_PANDALS.map((p) => {
            const isSelected = selectedPandal.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleCenterOnPandal(p)}
                title={`#${p.serialNumber}. ${p.bengaliName} (${p.name})`}
                className={`px-2.5 py-1 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-rose-700 text-white shadow-md scale-105 ring-2 ring-amber-400'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                #{p.serialNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Stage: Interactive Visual Map + Route Hopper Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column (7 cols): Interactive Rangpur Regional & City SVG Map */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls: Search + Map Theme + Label Toggles */}
          <div ref={searchContainerRef} className="relative z-40 space-y-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              {/* Search Input Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="English বা বাংলায় খুঁজুন (যেমন: Guptapara, Tajhat, Dharma, 17, Lalbagh, 31)..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl bg-white border-2 border-stone-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 text-stone-900 shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded-full hover:bg-stone-100"
                    title="ক্লিয়ার করুন"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Map Theme Selector */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-300 shrink-0">
                <button
                  onClick={() => setMapTheme('street')}
                  className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                    mapTheme === 'street'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="গুগল ম্যাপস স্ট্রিম ক্লিয়ার ভিউ"
                >
                  স্ট্রিম (Street)
                </button>
                <button
                  onClick={() => setMapTheme('dark')}
                  className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                    mapTheme === 'dark'
                      ? 'bg-slate-900 text-amber-300 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="নাইট মোড শারদীয় ভিউ"
                >
                  নাইট (Dark)
                </button>
                <button
                  onClick={() => setMapTheme('satellite')}
                  className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                    mapTheme === 'satellite'
                      ? 'bg-emerald-950 text-emerald-200 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="স্যাটেলাইট ভূপ্রকৃতি ভিউ"
                >
                  স্যাটেলাইট
                </button>
              </div>

              {/* Alleyways & Label Toggles */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setShowAlleyNames(!showAlleyNames)}
                  className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-colors flex items-center gap-1 ${
                    showAlleyNames
                      ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
                  }`}
                  title="অলিগলির নাম দৃশ্যমান বা লুকান"
                >
                  <Eye className="w-3 h-3" />
                  <span>{showAlleyNames ? 'অলিগলি নাম ON' : 'অলিগলি নাম OFF'}</span>
                </button>

                <button
                  onClick={() => setShowAllLabels(!showAllLabels)}
                  className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-colors flex items-center gap-1 ${
                    showAllLabels
                      ? 'bg-rose-700 text-white border-rose-800 shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-50 border-stone-200'
                  }`}
                  title="মণ্ডপের নাম দৃশ্যমান বা লুকান"
                >
                  <span>{showAllLabels ? 'মণ্ডপ নাম ON' : 'মণ্ডপ নাম OFF'}</span>
                </button>
              </div>
            </div>

            {/* Live Autocomplete Suggestions Dropdown showing Serial Numbers & Names */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border-2 border-amber-400 shadow-2xl max-h-80 overflow-y-auto overflow-x-hidden p-2 space-y-1 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[11px] font-bold text-stone-500 border-b border-stone-100 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-rose-700">
                    <ListOrdered className="w-3.5 h-3.5" />
                    <span>খোঁজা হয়েছে: &quot;{searchQuery}&quot; (সিরিয়াল অনুসারে তালিকা)</span>
                  </span>
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    {searchResults.length} টি ফলাফল
                  </span>
                </div>

                {searchResults.length > 0 ? (
                  searchResults.map((p) => {
                    const isCurrentSelected = selectedPandal.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectFromSearch(p)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between gap-3 ${
                          isCurrentSelected
                            ? 'bg-amber-100/80 border border-amber-400'
                            : 'hover:bg-amber-50/70 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className="text-xs font-black bg-rose-700 text-white px-2 py-0.5 rounded-md shrink-0 mt-0.5">
                            #{p.serialNumber}
                          </span>
                          <div className="min-w-0">
                            <div className="font-extrabold text-xs sm:text-sm text-stone-900 truncate">
                              {p.bengaliName}
                            </div>
                            <div className="text-[11px] text-stone-600 font-serif truncate">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-stone-500 flex items-center gap-1.5 mt-0.5 truncate">
                              <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                              <span className="truncate">{p.address}</span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 whitespace-nowrap shrink-0">
                          {p.categoryBengali.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-stone-500 space-y-1">
                    <p className="font-bold text-stone-700">কোনো মণ্ডপ পাওয়া যায়নি!</p>
                    <p className="text-[11px]">
                      চেষ্টা করুন: <span className="text-rose-700 font-mono">Tajhat</span>,{' '}
                      <span className="text-rose-700 font-mono">Dharma</span>,{' '}
                      <span className="text-rose-700 font-mono">Lalbagh</span>,{' '}
                      <span className="text-rose-700 font-mono">Palichara</span> বা সিরিয়াল নম্বর{' '}
                      <span className="text-rose-700 font-mono">#1</span>,{' '}
                      <span className="text-rose-700 font-mono">#17</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'All', label: 'সব মণ্ডপ (৫০টি)', icon: Sparkles },
              { id: 'City Center', label: '১. কেন্দ্রস্থল (১৫টি)', icon: Landmark },
              { id: 'Metropolitan', label: '২. মহানগর ও শহরতলী (১৫টি)', icon: Building2 },
              { id: 'Rural Sadar', label: '৩. সদর গ্রামীণ (২০টি)', icon: Trees },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id as any)}
                  className={`p-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-center border ${
                    isActive
                      ? 'bg-stone-900 text-amber-300 border-stone-950 shadow-md ring-2 ring-amber-400/50'
                      : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Visual Rangpur Map Container with Zoom & Pan Engine */}
          <div
            ref={mapViewportRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative rounded-3xl overflow-hidden border-2 border-amber-300 shadow-xl select-none transition-colors ${
              mapTheme === 'street'
                ? 'bg-[#f4f3ea]'
                : mapTheme === 'satellite'
                ? 'bg-[#0f1f1a]'
                : 'bg-slate-950'
            } aspect-[4/3] sm:aspect-[16/11] ${zoom > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
          >
            {/* SVG Interactive Canvas */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full select-none"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: '50% 50%',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
              }}
            >
              <defs>
                {/* Ghaghot River gradient */}
                <linearGradient id="ghaghotWater" x1="0" y1="0" x2="1" y2="1">
                  <stop
                    offset="0%"
                    stopColor={mapTheme === 'street' ? '#38bdf8' : '#0284c7'}
                  />
                  <stop
                    offset="100%"
                    stopColor={mapTheme === 'street' ? '#0ea5e9' : '#0369a1'}
                  />
                </linearGradient>

                {/* Street map patterns */}
                <pattern id="streetGrid" width="6" height="6" patternUnits="userSpaceOnUse">
                  <path
                    d="M 6 0 L 0 0 0 6"
                    fill="none"
                    stroke={mapTheme === 'street' ? '#e7e5d8' : '#1e293b'}
                    strokeWidth="0.2"
                  />
                </pattern>
              </defs>

              {/* Background Color & City Texture */}
              <rect
                width="100"
                height="100"
                fill={mapTheme === 'street' ? '#f5f4eb' : mapTheme === 'satellite' ? '#11221b' : '#0b1329'}
              />
              <rect width="100" height="100" fill="url(#streetGrid)" opacity="0.7" />

              {/* Parks & Green zones (যেমন: চিড়িয়াখানা, কারমাইকেল কলেজ ক্যাম্পাস, কালেক্টরেট সুরভী উদ্যান, তাজহাট দিঘি) */}
              <g id="parks" opacity={mapTheme === 'street' ? '0.75' : '0.4'}>
                {/* Carmichael College Campus greenery */}
                <rect x="46" y="73" width="7" height="6" rx="2" fill="#dcfce7" stroke="#bbf7d0" strokeWidth="0.3" />
                <text x="49.5" y="76.5" fill="#15803d" fontSize="1.1" fontWeight="bold" textAnchor="middle">
                  কারমাইকেল ক্যাম্পাস
                </text>

                {/* Tajhat Palace Grounds & Dighi */}
                <rect x="61" y="78" width="9" height="7" rx="2" fill="#dcfce7" stroke="#bbf7d0" strokeWidth="0.3" />
                <circle cx="67" cy="82" r="1.8" fill="#38bdf8" />
                <text x="65.5" y="80" fill="#15803d" fontSize="1.1" fontWeight="bold" textAnchor="middle">
                  তাজহাট দিঘি ও উদ্যান
                </text>

                {/* Collectorate / Suravi Udyan / Zoo */}
                <rect x="43" y="32" width="6" height="4" rx="1.5" fill="#dcfce7" stroke="#bbf7d0" strokeWidth="0.3" />
                <text x="46" y="34.5" fill="#15803d" fontSize="1.1" fontWeight="bold" textAnchor="middle">
                  সুরভী উদ্যান
                </text>
              </g>

              {/* Ghaghot River (ঘাঘট নদী) with banks */}
              <g id="ghaghot-river">
                {/* River Outer Bank */}
                <path
                  d="M 5 22 Q 22 14 36 22 Q 46 28 44 42 Q 33 46 29 65 Q 23 85 8 98"
                  fill="none"
                  stroke={mapTheme === 'street' ? '#bae6fd' : '#0369a1'}
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                {/* River Core Stream */}
                <path
                  d="M 5 22 Q 22 14 36 22 Q 46 28 44 42 Q 33 46 29 65 Q 23 85 8 98"
                  fill="none"
                  stroke="url(#ghaghotWater)"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                />
                <text
                  x="10"
                  y="19"
                  fill={mapTheme === 'street' ? '#0369a1' : '#7dd3fc'}
                  fontSize="1.8"
                  fontWeight="bold"
                  fontStyle="italic"
                >
                  Ghaghot River (ঘাঘট নদী)
                </text>
              </g>

              {/* =============================================================== */}
              {/* DETAILED STREET & ALLEYWAY NETWORK (রংপুর অলিগলি ও সড়ক নেটওয়ার্ক) */}
              {/* =============================================================== */}

              {/* 1. Primary Arterials / Highways (প্রধান মহাসড়ক) */}
              <g
                id="highways"
                stroke={mapTheme === 'street' ? '#fcd34d' : '#475569'}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Highway casing for Google Maps feel */}
                {mapTheme === 'street' && (
                  <g stroke="#f59e0b" strokeWidth="2.8" opacity="0.6">
                    <path d="M 7 18 L 17 12 L 30 26 L 44 34 L 50 42 L 52 53 L 55 72 L 56 82 L 30 92" />
                    <path d="M 50 42 L 62 47 L 78 61 L 96 58" />
                    <path d="M 46 38 L 48 33 L 50 12" />
                  </g>
                )}

                {/* Dinajpur - Rangpur Highway */}
                <path d="M 7 18 L 17 12 L 30 26 L 44 34" strokeWidth="2.0" />
                {/* Rangpur - Dhaka Highway */}
                <path d="M 44 34 L 50 42 L 52 53 L 55 72 L 56 82 L 30 92" strokeWidth="2.2" />
                {/* Kurigram / Mahiganj Highway */}
                <path d="M 50 42 L 62 47 L 78 61 L 96 58" strokeWidth="2.0" />
                {/* Burirhat Road */}
                <path d="M 46 38 L 48 33 L 50 12" strokeWidth="1.6" />
                {/* Haragach Road */}
                <path d="M 48 33 L 68 24 L 88 18" strokeWidth="1.6" />
              </g>

              {/* 2. Secondary City Streets (সংযোগ সড়ক) */}
              <g
                id="secondary-streets"
                stroke={mapTheme === 'street' ? '#ffffff' : '#64748b'}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Station Road: Jahaj Company -> Shapla -> Station -> Alamnagar */}
                <path d="M 50 42 L 52 53 L 55 60 L 57 66" strokeWidth="1.5" />
                {/* GL Roy Road: Jahaj Company -> Guptapara -> Grand Hotel Mor -> Payra Chhattar */}
                <path d="M 50 42 L 47 45 L 47 49 L 48 40" strokeWidth="1.4" />
                {/* Central Road: Payra Chhattar -> Super Market -> Jahaj Company */}
                <path d="M 48 40 L 46 42 L 50 42" strokeWidth="1.4" />
                {/* Jail Road & Zilla School Road */}
                <path d="M 47 39 L 44 34 L 41 36" strokeWidth="1.3" />
                {/* Shalbon Road: Shalbon Mor -> Grand Hotel Mor */}
                <path d="M 43 52 L 47 49" strokeWidth="1.3" />
                {/* Medical Road: DC Mor -> Medical East Gate -> Dhap */}
                <path d="M 44 34 L 41 36 L 39 38" strokeWidth="1.3" />
                {/* Tajhat Palace Avenue & Kotpara Road */}
                <path d="M 55 72 L 61 74 L 64 80 L 67 82" strokeWidth="1.4" />
                {/* Mahiganj loop: Satmatha -> Kaaripara -> Chowkbazar */}
                <path d="M 78 61 L 80 63 L 83 60 L 78 61" strokeWidth="1.3" />
              </g>

              {/* 3. Detailed Inner Para Alleys & Lanes (অলিগলি) */}
              <g
                id="inner-alleys"
                stroke={mapTheme === 'street' ? '#cbd5e1' : '#334155'}
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeDasharray="0.9 0.6"
              >
                {/* Guptapara 1-4 No Lanes (গুপ্তপাড়া ১-৪নং অলিগলি) */}
                <line x1="47" y1="45" x2="49" y2="44" />
                <line x1="47" y1="47" x2="49" y2="46" />
                <line x1="46" y1="49" x2="44" y2="48" />
                {/* Palpara Kumartuli Lane (পালপাড়া কুমারটুলি বাইলেন) */}
                <line x1="44" y1="48" x2="46" y2="47" />
                <line x1="44" y1="48" x2="43" y2="46" />

                {/* Mulatol Amtola & Bazar Lanes (মুলাটোল আমতলা ও বাজার অলিগলি) */}
                <line x1="46" y1="31" x2="48" y2="33" />
                <line x1="47" y1="33" x2="49" y2="35" />
                <line x1="49" y1="32" x2="51" y2="34" />

                {/* Senpara & Kamarpara Roth Mandir Lanes (সেনপাড়া ও কামারপাড়া অলিগলি) */}
                <line x1="49" y1="36" x2="51" y2="38" />
                <line x1="50" y1="39" x2="52" y2="40" />
                <line x1="51" y1="38" x2="53" y2="37" />

                {/* Shalbon Central Road & Bagan Lanes (শালবন বাগান গলি) */}
                <line x1="43" y1="52" x2="41" y2="54" />
                <line x1="44" y1="53" x2="45" y2="55" />
                <line x1="42" y1="51" x2="40" y2="53" />

                {/* Dhap & Medical East Gate Lanes (মেডিকেল ও ধাপ সাগরপাড়া লেন) */}
                <line x1="42" y1="35" x2="43" y2="37" />
                <line x1="40" y1="38" x2="38" y2="39" />
                <line x1="41" y1="36" x2="40" y2="33" />

                {/* Station Road & Railway Colony Lanes (রেলওয়ে কলোনি ও ক্ষত্রিয় সমিতি গলি) */}
                <line x1="53" y1="57" x2="55" y2="58" />
                <line x1="54" y1="58" x2="56" y2="59" />
                <line x1="56" y1="64" x2="58" y2="65" />
                <line x1="57" y1="66" x2="59" y2="68" />

                {/* Kamal Kachna Riverside Lanes (কামাল কাছনা নদী সংলগ্ন গলি) */}
                <line x1="58" y1="46" x2="60" y2="48" />
                <line x1="62" y1="47" x2="64" y2="45" />

                {/* Mahiganj Heritage Lanes (মাহিগঞ্জ কাড়িপাড়া ও চকবাজার গলি) */}
                <line x1="77" y1="62" x2="79" y2="63" />
                <line x1="79" y1="63" x2="81" y2="64" />
                <line x1="78" y1="61" x2="80" y2="59" />
                <line x1="81" y1="60" x2="83" y2="62" />

                {/* Tajhat & Kotpara Inner Alleys (তাজহাট ও কোটপাড়া দিঘিপাড় গলি) */}
                <line x1="60" y1="74" x2="62" y2="75" />
                <line x1="63" y1="79" x2="65" y2="82" />

                {/* Sadar Rural Branches (পাগলাপীর, পালিচড়া, শ্যামপুর, বুড়িরহাট লিংক) */}
                <line x1="12" y1="10" x2="15" y2="12" />
                <line x1="28" y1="90" x2="31" y2="92" />
                <line x1="15" y1="53" x2="18" y2="56" />
                <line x1="48" y1="12" x2="51" y2="14" />
                <line x1="38" y1="86" x2="41" y2="88" />
              </g>

              {/* Inner Alleyway Street Names (displayed when showAlleyNames is active) */}
              {showAlleyNames && (
                <g id="alley-labels" className="pointer-events-none select-none">
                  {/* City center dense alleys */}
                  <text
                    x="48"
                    y="46.8"
                    fill={mapTheme === 'street' ? '#64748b' : '#94a3b8'}
                    fontSize="0.9"
                    fontWeight="600"
                  >
                    গুপ্তপাড়া গলি
                  </text>
                  <text
                    x="43.5"
                    y="48.8"
                    fill={mapTheme === 'street' ? '#64748b' : '#94a3b8'}
                    fontSize="0.9"
                    fontWeight="600"
                  >
                    পালপাড়া লেন
                  </text>
                  <text
                    x="47"
                    y="32.4"
                    fill={mapTheme === 'street' ? '#64748b' : '#94a3b8'}
                    fontSize="0.9"
                    fontWeight="600"
                  >
                    আমতলা গলি
                  </text>
                  <text
                    x="50.8"
                    y="37.8"
                    fill={mapTheme === 'street' ? '#64748b' : '#94a3b8'}
                    fontSize="0.9"
                    fontWeight="600"
                  >
                    রথ মন্দির গলি
                  </text>
                  <text
                    x="41"
                    y="53.8"
                    fill={mapTheme === 'street' ? '#64748b' : '#94a3b8'}
                    fontSize="0.9"
                    fontWeight="600"
                  >
                    শালবন লেন
                  </text>
                  <text
                    x="56"
                    y="58.2"
                    fill={mapTheme === 'street' ? '#64748b' : '#94a3b8'}
                    fontSize="0.9"
                    fontWeight="600"
                  >
                    ক্ষত্রিয় সমিতি গলি
                  </text>
                  <text
                    x="57.8"
                    y="65.2"
                    fill={mapTheme === 'street' ? '#64748b' : '#94a3b8'}
                    fontSize="0.9"
                    fontWeight="600"
                  >
                    রবার্টসনগঞ্জ গলি
                  </text>
                  <text
                    x="80"
                    y="64.5"
                    fill={mapTheme === 'street' ? '#64748b' : '#94a3b8'}
                    fontSize="0.9"
                    fontWeight="600"
                  >
                    কাড়িপাড়া গলি
                  </text>
                  <text
                    x="62.5"
                    y="76.2"
                    fill={mapTheme === 'street' ? '#64748b' : '#94a3b8'}
                    fontSize="0.9"
                    fontWeight="600"
                  >
                    কোটপাড়া লেন
                  </text>
                </g>
              )}

              {/* Major Landmarks & Hub Nodes */}
              <g id="landmarks">
                {/* Jahaj Company Mor (জাহাজ কোম্পানি মোড়) */}
                <circle
                  cx="50"
                  cy="42"
                  r="1.8"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="0.5"
                />
                <text
                  x="52"
                  y="41.2"
                  fill={mapTheme === 'street' ? '#b45309' : '#fde047'}
                  fontSize="1.7"
                  fontWeight="bold"
                >
                  জাহাজ কোম্পানি
                </text>

                {/* Shapla Chhattar (শাপলা চত্বর) */}
                <circle
                  cx="52"
                  cy="53"
                  r="1.8"
                  fill="#ec4899"
                  stroke="#ffffff"
                  strokeWidth="0.5"
                />
                <text
                  x="54"
                  y="53.2"
                  fill={mapTheme === 'street' ? '#be185d' : '#f472b6'}
                  fontSize="1.7"
                  fontWeight="bold"
                >
                  শাপলা চত্বর
                </text>

                {/* Rail Station (রেলওয়ে স্টেশন) */}
                <circle
                  cx="55"
                  cy="60"
                  r="1.8"
                  fill="#0284c7"
                  stroke="#ffffff"
                  strokeWidth="0.5"
                />
                <text
                  x="57"
                  y="60.8"
                  fill={mapTheme === 'street' ? '#0369a1' : '#7dd3fc'}
                  fontSize="1.7"
                  fontWeight="bold"
                >
                  রেল স্টেশন
                </text>

                {/* Medical Mor & DC Mor */}
                <circle
                  cx="44"
                  cy="34"
                  r="1.5"
                  fill="#6366f1"
                  stroke="#ffffff"
                  strokeWidth="0.4"
                />
                <text
                  x="41"
                  y="33.5"
                  fill={mapTheme === 'street' ? '#4338ca' : '#a5b4fc'}
                  fontSize="1.5"
                  fontWeight="bold"
                >
                  কাচারি / ডিসি মোড়
                </text>

                {/* Mahiganj Satmatha */}
                <circle
                  cx="78"
                  cy="61"
                  r="1.7"
                  fill="#ea580c"
                  stroke="#ffffff"
                  strokeWidth="0.4"
                />
                <text
                  x="80"
                  y="60.5"
                  fill={mapTheme === 'street' ? '#c2410c' : '#fdba74'}
                  fontSize="1.7"
                  fontWeight="bold"
                >
                  মাহিগঞ্জ সাতমাথা
                </text>

                {/* Tajhat Palace */}
                <rect
                  x="62"
                  y="78.5"
                  width="4"
                  height="2.5"
                  rx="0.6"
                  fill="#818cf8"
                  stroke="#ffffff"
                  strokeWidth="0.3"
                />
                <text
                  x="64"
                  y="83"
                  fill={mapTheme === 'street' ? '#4338ca' : '#c7d2fe'}
                  fontSize="1.6"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  তাজহাট প্রাসাদ
                </text>

                {/* Paglapir & Palichara */}
                <text
                  x="14"
                  y="10"
                  fill={mapTheme === 'street' ? '#047857' : '#34d399'}
                  fontSize="1.7"
                  fontWeight="bold"
                >
                  পাগলাপীর
                </text>
                <text
                  x="21"
                  y="91"
                  fill={mapTheme === 'street' ? '#047857' : '#34d399'}
                  fontSize="1.7"
                  fontWeight="bold"
                >
                  পালিচড়া
                </text>
              </g>

              {/* Connecting Walking / Easy-Bike Paths from Current Selected Mandap */}
              {currentPandal.nearbyPandals.map((hop) => {
                const target = ALL_RANGPUR_PANDALS.find((p) => p.id === hop.pandalId);
                if (!target) return null;
                return (
                  <line
                    key={hop.pandalId}
                    x1={currentPandal.mapX}
                    y1={currentPandal.mapY}
                    x2={target.mapX}
                    y2={target.mapY}
                    stroke="#f59e0b"
                    strokeWidth="0.9"
                    strokeDasharray="1.2 1"
                    className="animate-pulse"
                  />
                );
              })}

              {/* Current Location Beacon Ripple */}
              <circle
                cx={currentPandal.mapX}
                cy={currentPandal.mapY}
                r="5"
                fill="none"
                stroke="#0284c7"
                strokeWidth="0.8"
                className="animate-ping"
              />

              {/* Live GPS User Location Beacon (Real GPS / Simulation) */}
              {userLocation && (
                <g id="user-live-beacon">
                  {/* Accuracy circle */}
                  <circle
                    cx={userLocation.mapX}
                    cy={userLocation.mapY}
                    r={Math.min(9, Math.max(3, userLocation.accuracy / 4))}
                    fill="#38bdf8"
                    fillOpacity="0.18"
                    stroke="#0284c7"
                    strokeWidth="0.4"
                  />
                  {/* Pulse radar wave */}
                  <circle
                    cx={userLocation.mapX}
                    cy={userLocation.mapY}
                    r="6.5"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="0.9"
                    className="animate-ping"
                  />
                  {/* User marker pin */}
                  <circle
                    cx={userLocation.mapX}
                    cy={userLocation.mapY}
                    r="2.8"
                    fill="#0284c7"
                    stroke="#ffffff"
                    strokeWidth="0.8"
                  />
                  <circle cx={userLocation.mapX} cy={userLocation.mapY} r="1.1" fill="#ffffff" />
                  <text
                    x={userLocation.mapX}
                    y={userLocation.mapY - 3.4}
                    textAnchor="middle"
                    fill="#0369a1"
                    fontSize="1.3"
                    fontWeight="extrabold"
                    className="drop-shadow bg-white/80"
                  >
                    আমার অবস্থান
                  </text>
                </g>
              )}

              {/* Mandap Interactive Map Pins */}
              {filteredPandals.map((pandal) => {
                const isSelected = selectedPandal.id === pandal.id;
                const isHovered = hoveredPandal?.id === pandal.id;
                const isCurrent = currentPandal.id === pandal.id;
                const catColor = getCategoryColor(pandal.category);

                return (
                  <g
                    key={pandal.id}
                    onClick={() => handleSelectPandal(pandal)}
                    onMouseEnter={() => setHoveredPandal(pandal)}
                    onMouseLeave={() => setHoveredPandal(null)}
                    onTouchStart={() => handleSelectPandal(pandal)}
                    className="cursor-pointer group"
                  >
                    {/* Generous touch target */}
                    <circle cx={pandal.mapX} cy={pandal.mapY} r="4.8" fill="transparent" />

                    {/* Glow outline on selection or hover */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={pandal.mapX}
                        cy={pandal.mapY}
                        r="4.2"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.2"
                        className="animate-pulse"
                      />
                    )}

                    {/* Outer Pin Body with category color */}
                    <circle
                      cx={pandal.mapX}
                      cy={pandal.mapY}
                      r={isCurrent ? 3.2 : isSelected ? 3.0 : isHovered ? 2.8 : 2.2}
                      fill={
                        isCurrent
                          ? '#0284c7'
                          : isSelected
                          ? '#f59e0b'
                          : isHovered
                          ? '#fbbf24'
                          : catColor.fill
                      }
                      stroke="#ffffff"
                      strokeWidth={isCurrent || isSelected || isHovered ? 0.9 : 0.5}
                      className="transition-transform group-hover:scale-125"
                    />

                    {/* Serial Number inside the pin */}
                    <text
                      x={pandal.mapX}
                      y={pandal.mapY + 0.6}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="1.5"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {pandal.serialNumber}
                    </text>

                    {/* Bengali Mandap Label on touch/click, hover or when showAllLabels is active */}
                    {(isSelected || isHovered || isCurrent || showAllLabels) && (
                      <g className="pointer-events-none">
                        <rect
                          x={pandal.mapX - 10}
                          y={pandal.mapY - 4.4}
                          width="20"
                          height="3.0"
                          rx="0.9"
                          fill={isSelected ? '#f59e0b' : '#0f172a'}
                          opacity={isSelected ? '0.95' : '0.88'}
                        />
                        <text
                          x={pandal.mapX}
                          y={pandal.mapY - 2.4}
                          textAnchor="middle"
                          fill={isSelected ? '#0f172a' : '#ffffff'}
                          fontSize="1.6"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          className="drop-shadow"
                        >
                          #{pandal.serialNumber}. {pandal.bengaliName.split(' ')[0]}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Floating Zoom & Pan Controls (Top Right Overlay) */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-stone-300 shadow-xl z-30">
              <button
                onClick={handleZoomIn}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-800 flex items-center justify-center transition-colors"
                title="জুম ইন (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-800 flex items-center justify-center transition-colors"
                title="জুম আউট (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-800 flex items-center justify-center text-xs font-bold transition-colors"
                title="রিসেট ভিউ (১x)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="h-px bg-stone-200 my-0.5" />

              {/* City Center Focus */}
              <button
                onClick={handleFocusCityCenter}
                className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 flex items-center justify-center transition-colors shadow-xs"
                title="রংপুর কেন্দ্রস্থল (১৫ মণ্ডপ ক্লাস্টার জুম)"
              >
                <Landmark className="w-4 h-4" />
              </button>

              {/* User Location Center */}
              <button
                onClick={handleCenterOnUser}
                className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-xs"
                title="আমার অবস্থানে জুম করুন"
              >
                <LocateFixed className="w-4 h-4" />
              </button>
            </div>

            {/* Instant Floating Callout Card inside Map when Touched/Selected */}
            <div className="absolute top-3 left-3 right-12 sm:right-auto sm:max-w-xs bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-amber-400 text-white shadow-2xl space-y-2 pointer-events-auto transition-all animate-in fade-in zoom-in-95 z-20">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-md">
                      #{activeDisplayPandal.serialNumber}
                    </span>
                    <span className="text-[11px] font-bold text-amber-300">
                      {activeDisplayPandal.categoryBengali}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white mt-1 leading-snug">
                    {activeDisplayPandal.bengaliName}
                  </h4>
                  <div className="text-[11px] text-stone-300 font-serif">
                    {activeDisplayPandal.name}
                  </div>
                </div>

                <div
                  className={`px-2 py-1 rounded-xl text-center shrink-0 border text-[10px] font-bold ${activeCrowd.badgeColor}`}
                >
                  <div>{activeCrowd.level}</div>
                  <div>~{activeCrowd.dynamicWait}মি.</div>
                </div>
              </div>

              <div className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                <strong>ঠিকানা:</strong> {activeDisplayPandal.address}
              </div>

              {/* Distance from user if tracking */}
              {distanceToSelected !== null && (
                <div className="text-[11px] bg-emerald-950/80 text-emerald-200 px-2.5 py-1.5 rounded-xl border border-emerald-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                    <span>আপনার থেকে দূরত্ব:</span>
                  </span>
                  <strong className="font-mono text-white">
                    {distanceToSelected >= 1000
                      ? `${(distanceToSelected / 1000).toFixed(1)} কি.মি.`
                      : `${distanceToSelected} মিটার`}
                  </strong>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 gap-2 text-[11px]">
                <button
                  onClick={() => handleSetCurrentLocation(activeDisplayPandal.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-white transition-colors flex items-center gap-1 shadow"
                >
                  <CheckCircle2 className="w-3 h-3 text-amber-300" />
                  <span>এখানে আছি</span>
                </button>

                <a
                  href={getGoogleMapsDirectionsUrl(activeDisplayPandal)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 transition-colors flex items-center gap-1 shadow"
                >
                  <span>গুগল ম্যাপস GPS</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Map Legend Floating Tag */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[10px] text-white flex flex-wrap items-center gap-2.5 z-20">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span>১-১৫ কেন্দ্রস্থল</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span>১৬-৩০ মহানগর</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>৩১-৫০ সদর গ্রামীণ</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>আমার অবস্থান</span>
              </span>
              <span className="text-stone-400 font-mono">Zoom: {zoom}x</span>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="p-3 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Bike className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>ফিল্টার করা মণ্ডপ:</strong> {filteredPandals.length} টি / মোট ৫০ টি মণ্ডপ
              </span>
            </div>
            <div className="flex items-center gap-2 text-amber-400 shrink-0">
              <Compass className="w-4 h-4" />
              <span>মাউস টেনে বা দুই আঙুলে পিঞ্চ করে ম্যাপ ঘোরানো ও জুম করা যায়</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Smart Next-Hop Route Finder & Selected Pandal Inspector */}
        <div className="lg:col-span-5 space-y-5">
          {/* Smart Next-Hop Route Planner Box */}
          <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
              <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
                <Route className="w-4 h-4" />
                <span>#{currentPandal.serialNumber} থেকে পরবর্তী সহজ মণ্ডপসমূহ</span>
              </div>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                {currentPandal.nearbyPandals.length} টি সংযোগ
              </span>
            </div>

            <p className="text-xs text-stone-600">
              আপনি বর্তমানে <strong>#{currentPandal.serialNumber}. {currentPandal.bengaliName}</strong> মণ্ডপে আছেন। এখান থেকে সহজে পরবর্তী মণ্ডপে যাওয়ার অলিগলি রুট:
            </p>

            {/* List of Connected Nearby Pandals */}
            <div className="space-y-2.5">
              {currentPandal.nearbyPandals.map((hop) => {
                const target = ALL_RANGPUR_PANDALS.find((p) => p.id === hop.pandalId);
                if (!target) return null;
                const crowd = getDynamicCrowd(target.baseCrowdLevel, target.currentWaitMins);

                return (
                  <div
                    key={hop.pandalId}
                    className="p-3 rounded-2xl bg-white border border-amber-200/90 hover:border-amber-400 transition-all shadow-sm flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                          <span className="text-xs font-mono bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded">
                            #{target.serialNumber}
                          </span>
                          <span>{target.bengaliName}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                          <span className="font-semibold text-rose-700">
                            {hop.distanceM >= 1000
                              ? `${(hop.distanceM / 1000).toFixed(1)} কি.মি.`
                              : `${hop.distanceM} মিটার`}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-sky-700 font-medium">
                            {hop.recommendedMode === 'Walk'
                              ? 'হেঁটে যান'
                              : hop.recommendedMode === 'Metro'
                              ? 'ইজিবাইক / রিকশা'
                              : 'সিএনজি / অটো'}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${crowd.badgeColor}`}>
                        ~{crowd.dynamicWait} মি. অপেক্ষা
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 bg-amber-50/70 p-2 rounded-xl border border-amber-100 flex items-start gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>{hop.routeTip}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        onClick={() => handleSetCurrentLocation(target.id)}
                        className="text-[11px] font-bold text-rose-700 hover:text-rose-800 underline"
                      >
                        এখানে পৌঁছালাম! (Hop Here)
                      </button>

                      <a
                        href={getGoogleMapsDirectionsUrl(target)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                      >
                        <span>গুগল ম্যাপস জিপিএস</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Pandal Live Status Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-lg space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white bg-rose-700 px-2 py-0.5 rounded-md">
                    #{selectedPandal.serialNumber}
                  </span>
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                    {selectedPandal.categoryBengali} · {selectedPandal.area}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                  {selectedPandal.bengaliName}
                </h3>
                <div className="text-xs font-serif text-stone-500">{selectedPandal.name}</div>
              </div>

              {/* Live Crowd Badge */}
              {(() => {
                const crowd = getDynamicCrowd(selectedPandal.baseCrowdLevel, selectedPandal.currentWaitMins);
                return (
                  <div className={`p-2.5 rounded-2xl border text-center shrink-0 ${crowd.badgeColor}`}>
                    <div className="text-xs font-extrabold">{crowd.level}</div>
                    <div className="text-xs font-mono font-bold mt-0.5">~{crowd.dynamicWait} মি. লাইন</div>
                  </div>
                );
              })()}
            </div>

            {/* Address */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-bold">সঠিক ঠিকানা (Address):</strong>
                <span>{selectedPandal.address}</span>
              </div>
            </div>

            {/* Highlights */}
            <p className="text-xs text-stone-600 leading-relaxed">{selectedPandal.highlights}</p>

            {/* 2027 Theme Highlight */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300/60">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                ২০২৭ বিশেষ থিম ও রূপসজ্জা:
              </div>
              <p className="text-xs font-semibold text-stone-800 mt-1">{selectedPandal.theme2027}</p>
            </div>

            {/* Street Congestion Warning */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  সড়ক ও ট্রাফিক পরিস্থিতি:
                </span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-md text-[10px] uppercase ${
                    selectedPandal.streetCongestion === 'Choc-a-bloc'
                      ? 'bg-red-100 text-red-800'
                      : selectedPandal.streetCongestion === 'Heavy Rush'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedPandal.streetCongestion}
                </span>
              </div>
              <div className="text-stone-600">
                <strong>প্রধান সড়ক:</strong> {selectedPandal.majorRoad}
              </div>
              <div className="text-stone-600">
                <strong>কাছের বিখ্যাত খাবার:</strong> {selectedPandal.famousFoodNearby}
              </div>
            </div>

            {/* Transit & Easy-Bike Directions */}
            <div className="space-y-2 text-xs text-stone-700">
              <div className="flex items-start gap-2">
                <Bike className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">কাছের ইজিবাইক/রিকশা/অটো স্ট্যান্ড:</strong>
                  <span>
                    {selectedPandal.nearestMetro} · {selectedPandal.walkingDistance}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">দর্শনের সেরা সময়:</strong>
                  <span>{selectedPandal.bestVisitingHours}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => handleSetCurrentLocation(selectedPandal.id)}
                className="flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>আমি এখন #{selectedPandal.serialNumber} মণ্ডপে আছি</span>
              </button>

              <a
                href={getGoogleMapsDirectionsUrl(selectedPandal)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
                title="গুগল ম্যাপসে জিপিএস ডিরেকশন খুলুন"
              >
                <span>গুগল ম্যাপস</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
