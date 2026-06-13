import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Star, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Hotel, SearchQuery } from '../types';

interface HomeViewProps {
  hotels: Hotel[];
  onSearch: (query: SearchQuery) => void;
  onSelectHotel: (hotel: Hotel) => void;
  onNavigate: (page: 'home' | 'list' | 'details' | 'booking' | 'confirmation' | 'dashboard') => void;
}

export default function HomeView({ hotels, onSearch, onSelectHotel, onNavigate }: HomeViewProps) {
  // Setup nice defaults relative to the 2026 target time
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('2026-06-14');
  const [checkOut, setCheckOut] = useState('2026-06-19');
  const [guests, setGuests] = useState(2);

  // AI Recommendation States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [recommendedHotel, setRecommendedHotel] = useState<Hotel | null>(null);

  const featuredHotels = hotels.filter((h) => h.featured);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      destination,
      checkIn,
      checkOut,
      guests,
    });
  };

  const selectDestination = (city: string) => {
    setDestination(city);
    onSearch({
      destination: city,
      checkIn,
      checkOut,
      guests,
    });
  };

  const handleAiRecommendation = async (customPrompt: string) => {
    if (!customPrompt.trim()) return;
    setLoadingAi(true);
    setAiResult('');
    setRecommendedHotel(null);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `You are the stay recommendation scanner. Map the user request to one or more of these available cities: "London", "Paris", "New York", "Tokyo", "Rome".
Briefly explain why you chose it in exactly 2 sentences max, then at the very absolute end of your response, output a single line containing exactly: "RECOMMEND_CITY:" followed by the name of the chosen city (either London, Paris, New York, Tokyo, or Rome).
User Request: ${customPrompt}`
            }
          ]
        })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      
      const text = data.content || '';
      const cityMatch = text.match(/RECOMMEND_CITY:\s*(\w+)/i);
      const cleanExplanation = text.replace(/RECOMMEND_CITY:\s*(\w+)/gi, '').trim();

      setAiResult(cleanExplanation);

      if (cityMatch && cityMatch[1]) {
        const matchedCity = cityMatch[1].trim();
        const matchedHotel = hotels.find(
          (h) => h.city.toLowerCase() === matchedCity.toLowerCase() || h.name.toLowerCase().includes(matchedCity.toLowerCase())
        );
        if (matchedHotel) {
          setRecommendedHotel(matchedHotel);
        }
      }
    } catch (err) {
      console.error(err);
      setAiResult("No premium suite matches found at the moment. Try 'Tokyo hot springs' or 'Paris honeymoon'.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* 1. Hero Banner */}
      <section className="relative flex min-h-[580px] items-center justify-center overflow-hidden bg-slate-900 text-white">
        {/* Background Image Grid Layer */}
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1600"
            alt="Luxury resort exterior poolside view"
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Subtle radial overlay for ambient contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl px-6 py-20 text-center lg:px-8">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5 font-sans text-xs font-bold uppercase tracking-wider text-blue-400 ring-1 ring-blue-500/30">
              <Sparkles className="h-3 w-3 text-blue-400" /> Boutique Luxury Escapes
            </span>
            <h1 className="mt-6 font-serif text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
              Sojourns that Inspire. <br />
              <span className="italic font-normal text-slate-200">Spaces that breathe.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg font-sans text-sm md:text-base text-slate-300 leading-relaxed font-light">
              Carefully curated luxury stays spanning the world’s most mesmerizing cultural hubs. Book directly with Aura for select benefits.
            </p>
          </div>

          {/* Search Console Overlay */}
          <div className="mx-auto mt-12 max-w-5xl">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl md:grid-cols-4 lg:gap-3 shadow-2xl"
            >
              {/* Destination Dropdown */}
              <div className="flex flex-col text-left rounded-xl bg-white px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-600">
                <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <MapPin className="h-3.5 w-3.5 text-slate-450" /> Destination
                </label>
                <select
                  id="search-dest-select"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="mt-1 block w-full border-0 p-0 font-sans text-sm font-semibold text-slate-900 bg-transparent focus:outline-hidden focus:ring-0 cursor-pointer"
                >
                  <option value="" className="text-slate-500">Any destination</option>
                  <option value="London" className="text-slate-900">London, United Kingdom</option>
                  <option value="Paris" className="text-slate-900">Paris, France</option>
                  <option value="New York" className="text-slate-900">New York, USA</option>
                  <option value="Tokyo" className="text-slate-900">Tokyo, Japan</option>
                  <option value="Rome" className="text-slate-900">Rome, Italy</option>
                </select>
              </div>

              {/* Check In Date */}
              <div className="flex flex-col text-left rounded-xl bg-white px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-600">
                <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <Calendar className="h-3.5 w-3.5 text-slate-450" /> Check-In
                </label>
                <input
                  id="search-checkin-input"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="mt-1 block w-full border-0 p-0 font-sans text-sm font-semibold text-slate-900 bg-transparent focus:outline-hidden focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Check Out Date */}
              <div className="flex flex-col text-left rounded-xl bg-white px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-600">
                <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  <Calendar className="h-3.5 w-3.5 text-slate-450" /> Check-Out
                </label>
                <input
                  id="search-checkout-input"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="mt-1 block w-full border-0 p-0 font-sans text-sm font-semibold text-slate-900 bg-transparent focus:outline-hidden focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Guests Count */}
              <div className="relative flex items-center justify-between gap-2.5 rounded-xl bg-white pl-4 pr-3.5 py-1">
                <div className="flex flex-col text-left">
                  <label className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    <Users className="h-3.5 w-3.5 text-slate-450" /> Guests
                  </label>
                  <select
                     id="search-guests-select"
                     value={guests}
                     onChange={(e) => setGuests(Number(e.target.value))}
                     className="mt-1 block w-10 border-0 p-0 font-sans text-sm font-semibold text-slate-900 bg-transparent focus:outline-hidden focus:ring-0 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Form Search Action */}
                <button
                  id="search-submit-btn"
                  type="submit"
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white transition-all hover:bg-blue-700 shadow-md shadow-blue-200"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Quick Link Targets */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="text-slate-300 font-medium">Browse by Destination:</span>
              {['Paris', 'Tokyo', 'New York', 'London', 'Rome'].map((city) => (
                <button
                  id={`quick-dest-${city}`}
                  key={city}
                  type="button"
                  onClick={() => selectDestination(city)}
                  className="rounded-lg bg-white/10 px-3.5 py-1.5 font-medium text-slate-200 backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Resorts Showcase */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div>
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Featured Properties
            </h2>
            <p className="mt-2 font-sans text-sm text-slate-500 leading-relaxed max-w-md">
              High review scores, magnificent architectural locations, and exclusive client amenities.
            </p>
          </div>
          <button
            id="featured-view-all-btn"
            onClick={() => onNavigate('list')}
            className="group flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors"
          >
            Explore all properties
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Resort Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {featuredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            >
              {/* Hotel Imagery banner */}
              <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 rounded bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span>{hotel.rating}</span>
                </div>
              </div>

              {/* Details card body */}
              <div className="p-6">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{hotel.city}</span>
                </div>
                <h3 className="mt-2.5 font-serif text-xl font-bold text-slate-900 line-clamp-1">{hotel.name}</h3>
                <p className="mt-2 text-xs text-slate-550 leading-relaxed font-light line-clamp-2">
                  {hotel.description}
                </p>

                {/* Suite details / price display info */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Suites from</span>
                    <span className="text-lg font-extrabold text-blue-600">${hotel.rooms[0]?.pricePerNight}</span>
                    <span className="text-xs text-slate-500 font-light font-sans"> / night</span>
                  </div>
                  <button
                    id={`featured-view-hotel-${hotel.id}`}
                    onClick={() => onSelectHotel(hotel)}
                    className="rounded-lg bg-blue-600 text-white px-5 py-2.5 text-xs font-bold text-sans uppercase tracking-wider hover:bg-blue-700 hover:shadow-md transition-all"
                  >
                    View Rooms
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2.5. Dynamic Empress AI Stay Recommender Banner */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
        <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-8 text-white shadow-2xl relative overflow-hidden">
          {/* subtle decorative blur nodes */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 h-40 w-40 bg-purple-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-12 xl:col-span-5 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-550/25 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300 ring-1 ring-blue-400/20">
                <Sparkles className="h-4 w-4 text-blue-300 animate-pulse" /> Aura Empress Smart-AI
              </span>
              <h2 className="font-serif text-3xl font-extrabold tracking-tight">
                AI Stay Recommender
              </h2>
              <p className="text-sm font-sans text-slate-350 leading-relaxed font-light">
                Tell our neural hospitality engine what you are seeking (e.g., romantic honeymoon, tranquil hot springs, or corporate penthouse). It will select the matching suite instantly!
              </p>
            </div>
            
            <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {[
                  { label: "🌅 Romantic Honeymoon", prompt: "I am planning an ultra-romantic, gourmet honeymoon escape of a lifetime." },
                  { label: "🧘 Zen Wellness Stay", prompt: "Looking for a peaceful, tranquil relaxation stay with luxury hot baths, sauna, and massage." },
                  { label: "🏛️ Ancient History Tour", prompt: "I want to explore historic Renaissance structures and walking tours near ancient monuments." },
                  { label: "🌃 NYC Sky Highrise", prompt: "I need a vibrant, executive sky highrise suite close to the heart of the city views with a private desk." }
                ].map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => handleAiRecommendation(tag.prompt)}
                    className="p-3 text-left rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 h-30 hover:border-blue-400 transition-all text-xs flex flex-col justify-between font-sans shadow-xs cursor-pointer"
                  >
                    <span className="font-bold block tracking-tight text-white">{tag.label}</span>
                    <span className="text-[10px] text-blue-400 font-bold block">Ask Concierge &rarr;</span>
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2.5 mt-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAiRecommendation(aiPrompt);
                    }
                  }}
                  placeholder="E.g., A quiet, heritage retreat details with fine dining chef in London..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4.5 py-3 font-sans text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleAiRecommendation(aiPrompt)}
                  disabled={loadingAi}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-900/40"
                >
                  {loadingAi ? "Analyzing..." : "Ask AI"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              
              {/* AI recommendation preview */}
              {aiResult && (
                <div className="p-4 p-y-4.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-sans text-slate-100 font-light leading-relaxed animate-fade-in space-y-3">
                  <div className="flex items-center gap-1.5 font-bold text-blue-300">
                    <Sparkles className="h-4 w-4" /> Recommended Destination Details:
                  </div>
                  <p className="italic text-slate-200">"{aiResult}"</p>
                  {recommendedHotel && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-3.5 mt-2 gap-3">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Suite Matched</span>
                        <span className="font-bold text-sm text-white">{recommendedHotel.name} ({recommendedHotel.city})</span>
                      </div>
                      <button
                        onClick={() => onSelectHotel(recommendedHotel)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4.5 py-2 text-[10px] font-bold tracking-wider uppercase transition-all shadow-md shadow-blue-500/10 cursor-pointer text-center"
                      >
                        Book Stay Now
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Aura Hospitality Services / Value Proposition Banner */}
      <section className="bg-slate-50 py-24 sm:py-32 border-t border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Elevating the Modern Traveler
            </h2>
            <p className="mt-4 font-sans text-sm text-slate-500 leading-relaxed">
              We stand at the intersection of architectural heritage and elite customer care. Sleep soundly, live purposefully.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl grid grid-cols-1 gap-12 sm:grid-cols-3">
            {/* Value prop 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-100">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-serif text-lg font-bold text-slate-900">Best Price & Flexible Policy</h3>
              <p className="mt-2.5 font-sans text-xs text-slate-400 font-light leading-relaxed max-w-xs">
                Book without fear. Benefit from fee-free cancellations and guaranteed pricing matched against general markets.
              </p>
            </div>

            {/* Value prop 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-100">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-serif text-lg font-bold text-slate-900">Seamless Smart Check-In</h3>
              <p className="mt-2.5 font-sans text-xs text-slate-400 font-light leading-relaxed max-w-xs">
                Zero waiting times. Utilize digital guest links to unlock dynamic floor plans and rooms straight from your screen.
              </p>
            </div>

            {/* Value prop 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-100">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-serif text-lg font-bold text-slate-900">Handcrafted Guest Experience</h3>
              <p className="mt-2.5 font-sans text-xs text-slate-400 font-light leading-relaxed max-w-xs">
                Each room is initialized with curated local maps, artisan amenities, and instant access to a luxury desk host.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
