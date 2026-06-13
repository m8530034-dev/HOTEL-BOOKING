import { useState, useMemo } from 'react';
import { MapPin, Star, Flame, SlidersHorizontal, Search, Coffee, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { Hotel, SearchQuery } from '../types';

interface HotelListViewProps {
  hotels: Hotel[];
  initialSearchQuery: SearchQuery;
  onSelectHotel: (hotel: Hotel) => void;
  onClearSearch: () => void;
}

export default function HotelListView({
  hotels,
  initialSearchQuery,
  onSelectHotel,
  onClearSearch,
}: HotelListViewProps) {
  // Filters local states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState(initialSearchQuery.destination || '');
  const [maxPrice, setMaxPrice] = useState(900);
  const [minRating, setMinRating] = useState(0);

  // Computed properties
  const availableCities = useMemo(() => {
    return Array.from(new Set(hotels.map((h) => h.city)));
  }, [hotels]);

  // Combined Filtering
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      // 1. Destination check
      if (selectedCity && hotel.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
      // 2. Search term check
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = hotel.name.toLowerCase().includes(query);
        const matchesLoc = hotel.location.toLowerCase().includes(query);
        const matchesDesc = hotel.description.toLowerCase().includes(query);
        if (!matchesName && !matchesLoc && !matchesDesc) {
          return false;
        }
      }
      // 3. Rating check
      if (hotel.rating < minRating) {
        return false;
      }
      // 4. Room price bounds (At least one room has a price <= maxPrice)
      const hasAffordableRoom = hotel.rooms.some((room) => room.pricePerNight <= maxPrice);
      if (!hasAffordableRoom) {
        return false;
      }

      return true;
    });
  }, [hotels, selectedCity, searchTerm, maxPrice, minRating]);

  // Reset Filters
  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setMaxPrice(900);
    setMinRating(0);
    onClearSearch();
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8 bg-slate-50/20">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6 mb-10">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Explore Luxury Resides
          </h1>
          <p className="mt-2 font-sans text-sm text-slate-500">
            Current query returns <span className="font-semibold text-blue-600">{filteredHotels.length}</span> premier boutique locations
          </p>
        </div>

        {/* Applied Search Tags indicator */}
        {initialSearchQuery.destination && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3.5 py-1.5 text-xs text-blue-800 font-bold border border-blue-100">
            <span>Searching Destination: <strong>{initialSearchQuery.destination}</strong></span>
            <button
              id="list-clear-search-btn"
              onClick={resetAllFilters}
              className="rounded-full bg-blue-100 p-0.5 hover:bg-blue-200 text-blue-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
        {/* 1. Filter Side Rail */}
        <aside className="lg:col-span-1 space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="flex items-center gap-2 font-serif text-base font-bold text-slate-900">
              <SlidersHorizontal className="h-4.5 w-4.5 text-slate-600" /> Filters
            </span>
            <button
              id="filters-reset-btn"
              onClick={resetAllFilters}
              className="font-sans text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors"
            >
              Reset all
            </button>
          </div>

          {/* Search text input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Search Keywords</label>
            <div className="relative">
              <input
                id="filter-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Hotel name, amenities, details..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 font-sans text-xs focus:border-blue-600 focus:bg-white focus:outline-hidden transition-all"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Destination city drop selective */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">City Location</label>
            <select
              id="filter-city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 font-sans text-xs font-medium text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden cursor-pointer h-10 transition-all"
            >
              <option value="">All Regions</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Range boundary slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Max Budget</label>
              <span className="font-mono text-xs font-bold text-blue-600">${maxPrice}/night</span>
            </div>
            <input
              id="filter-price-slider"
              type="range"
              min="150"
              max="900"
              step="25"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between font-mono text-[10px] text-slate-400">
              <span>$150</span>
              <span>$900</span>
            </div>
          </div>

          {/* Guest Rating Selectors */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Minimum Guest Rating</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 4.6, 4.8, 4.9].map((rating) => (
                <button
                  id={`filter-rating-${rating}`}
                  key={rating}
                  type="button"
                  onClick={() => setMinRating(rating)}
                  className={`rounded-lg py-2 font-sans text-xs font-bold px-1 transition-all border ${
                    minRating === rating
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-100'
                      : 'border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900 bg-white'
                  }`}
                >
                  {rating === 0 ? 'Any' : `${rating}★`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 2. Hotel Cards Listings Container  */}
        <div className="lg:col-span-3 space-y-8">
          {filteredHotels.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center border overflow-hidden border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
              <div className="p-4 rounded-full bg-white border border-slate-100 text-slate-300 shadow-xs mb-2">
                <SlidersHorizontal className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-bold text-slate-900">No rooms match your filter parameters</h3>
              <p className="mt-2 font-sans text-xs text-slate-400 max-w-sm leading-relaxed font-light">
                Try widening your budget ceilings, selecting different cities, or softening keywords to explore other beautiful listings.
              </p>
              <button
                id="search-retry-clear-btn"
                onClick={resetAllFilters}
                className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-white hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredHotels.map((hotel) => {
              // Calculate hotel starting price
              const prices = hotel.rooms.map((r) => r.pricePerNight);
              const minPrice = Math.min(...prices);
              const maxHotelPrice = Math.max(...prices);

              return (
                <div
                  key={hotel.id}
                  className="group flex flex-col md:flex-row overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-300"
                >
                  {/* Photo cover block */}
                  <div className="relative h-60 w-full md:h-auto md:w-[35%] bg-slate-50 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-103"
                      referrerPolicy="no-referrer"
                    />
                    {hotel.featured && (
                      <div className="absolute top-4 left-4 rounded bg-blue-600 px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white flex items-center gap-1 shadow-sm">
                        <Flame className="h-3 w-3 text-white fill-white" />
                        <span>AURA ELITE</span>
                      </div>
                    )}
                  </div>

                  {/* Text details content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      {/* Top Header details */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{hotel.city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-xs text-slate-900">{hotel.rating}</span>
                          <span className="text-slate-400 text-[11px] font-light">({hotel.reviewsCount} reviews)</span>
                        </div>
                      </div>

                      <h3 className="mt-3 font-serif text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {hotel.name}
                      </h3>
                      <p className="mt-1 font-sans text-xs text-slate-450 leading-relaxed font-light">
                        {hotel.location}
                      </p>
                      
                      <p className="mt-3.5 font-sans text-xs text-slate-500 leading-relaxed font-light line-clamp-2">
                        {hotel.description}
                      </p>

                      {/* Display key highlights */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded bg-slate-50 border border-slate-200/80 px-2.5 py-1 text-[10px] font-semibold text-slate-600 font-sans"
                          >
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <span className="text-[10px] text-slate-400 self-center font-medium pl-1">
                            +{hotel.amenities.length - 3} amenities
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom strip pricing / action */}
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-105 pt-5">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Accommodations</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-xl font-extrabold text-blue-600">${minPrice}</span>
                          <span className="text-[11px] text-slate-400 font-light font-sans">—</span>
                          <span className="text-sm font-bold text-slate-700">${maxHotelPrice}</span>
                          <span className="text-xs text-slate-500 font-light font-sans ml-1">/ night</span>
                        </div>
                      </div>
                      <button
                        id={`list-browse-rooms-${hotel.id}`}
                        onClick={() => onSelectHotel(hotel)}
                        className="group relative flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-wider hover:bg-blue-700 shadow-md shadow-blue-100 transition-all"
                      >
                        <span>Browse Rooms</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
