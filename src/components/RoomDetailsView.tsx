import { ArrowLeft, Star, MapPin, Users, CheckCircle, Bed, Eye, Heart, Sparkles } from 'lucide-react';
import { Hotel, Room } from '../types';

interface RoomDetailsViewProps {
  hotel: Hotel;
  onBack: () => void;
  onSelectRoom: (room: Room) => void;
}

export default function RoomDetailsView({ hotel, onBack, onSelectRoom }: RoomDetailsViewProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8 bg-slate-50/20">
      {/* 1. Back Navigation & Quick Info */}
      <div className="mb-6 flex items-center justify-between">
        <button
          id="details-back-to-list-btn"
          onClick={onBack}
          className="group inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to hotel listings</span>
        </button>
      </div>

      {/* 2. Hotel Feature Poster Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl animate-fade-in">
        <div className="relative h-[360px] md:h-[420px] w-full">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="h-full w-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          {/* Shadow vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/20" />
        </div>

        {/* Floating Details Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-wider text-blue-400 ring-1 ring-blue-500/30">
                <Sparkles className="h-3 w-3 text-blue-400" /> Aura Handpicked Preferred
              </span>
              <h1 className="mt-4 font-serif text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white">
                {hotel.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  {hotel.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-450 fill-amber-400" />
                  <strong>{hotel.rating}</strong> ({hotel.reviewsCount} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Description & Amenities Info Grid */}
      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Main descriptors */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-serif text-2xl font-extrabold text-slate-900">About the Residence</h2>
          <p className="font-sans text-sm text-slate-500 leading-relaxed font-light whitespace-pre-line">
            {hotel.description}
          </p>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 mt-6 shadow-xs">
            <h3 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wide">Included Property Amenities</h3>
            <p className="mt-1 font-sans text-xs text-slate-400 font-light">Available for every guest during their stay</p>
            <div className="mt-4 grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {hotel.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 font-sans text-xs text-slate-600">
                  <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info card */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sticky top-28 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Booking Guidance</h3>
            <ul className="mt-4 space-y-4 font-sans text-xs text-slate-400 leading-relaxed font-light">
              <li className="flex gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-bold text-blue-600">1</span>
                <span className="text-slate-600">Select from the exclusive hotel suites and rooms listed below.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-bold text-blue-600">2</span>
                <span className="text-slate-600">Verify prices and click <strong>Book room</strong>.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-bold text-blue-600">3</span>
                <span className="text-slate-600">Complete the mock guest billing details to receive your digital receipt.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Room Lists Showcase */}
      <section className="mt-16 border-t border-slate-200 pt-16">
        <div>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900">
            Available Suites & Private Rooms
          </h2>
          <p className="mt-2 font-sans text-sm text-slate-500 leading-relaxed max-w-xl">
            Clean, bespoke spaces crafted with premium sound isolation, hypoallergenic mattresses, and luxury toiletries.
          </p>
        </div>

        {/* Room items rows */}
        <div className="mt-10 space-y-8">
          {hotel.rooms.map((room) => (
            <div
              key={room.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row"
            >
              {/* Room Image */}
              <div className="relative h-64 lg:h-auto lg:w-[40%] bg-slate-50 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 rounded bg-blue-50 text-blue-700 font-bold px-2.5 py-1 text-[10px] tracking-wider uppercase shadow-xs">
                  {room.type} Suite
                </div>
              </div>

              {/* Room Body details */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-serif text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {room.name}
                    </h3>
                    <span className="flex items-center gap-1 rounded-sm bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                      <Users className="h-3 w-3" /> Max {room.maxGuests} Guests
                    </span>
                  </div>

                  <p className="mt-3 font-sans text-xs text-slate-550 leading-relaxed font-light">
                    {room.description}
                  </p>

                  {/* Amenities highlights */}
                  <div className="mt-6">
                    <span className="text-[10px] tracking-widest text-slate-400 font-bold uppercase block">Room Amenities</span>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {room.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200/50 px-3 py-1 text-[11px] font-medium text-slate-600"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-650 mr-1.5" />
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom interactive area */}
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Price per stay</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-extrabold text-blue-600">${room.pricePerNight}</span>
                      <span className="text-xs text-slate-500 font-light font-sans">USD / night</span>
                    </div>
                  </div>
                  <button
                    id={`details-book-room-${room.id}`}
                    onClick={() => onSelectRoom(room)}
                    className="rounded-lg bg-blue-600 text-white px-7 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-blue-700 shadow-md shadow-blue-100 transition-all"
                  >
                    Book Room
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
