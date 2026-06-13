import { useState } from 'react';
import { Hotel, Calendar, User, Eye, X, Compass, Sun, Moon, Award } from 'lucide-react';
import { Booking } from '../types';

interface NavbarProps {
  onNavigate: (page: 'home' | 'list' | 'details' | 'booking' | 'confirmation' | 'dashboard') => void;
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  activePage: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Navbar({ 
  onNavigate, 
  bookings, 
  onSelectBooking, 
  onCancelBooking, 
  activePage,
  theme,
  toggleTheme 
}: NavbarProps) {
  const [showBookingsDrawer, setShowBookingsDrawer] = useState(false);
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      isDark 
        ? 'border-zinc-800 bg-zinc-950/90 text-white backdrop-blur-md' 
        : 'border-slate-200 bg-white/90 text-slate-800 backdrop-blur-md'
    }`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90 animate-fade-in"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
            <Compass className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <span className={`font-serif text-xl font-bold tracking-tight uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>AURA</span>
            <span className="ml-1 font-sans text-xs font-bold tracking-widest text-blue-600 uppercase">STAY</span>
          </div>
        </button>

        {/* Global Nav Paths */}
        <nav className="hidden md:flex items-center gap-8 animate-fade-in">
          <button
            id="nav-home-btn"
            onClick={() => onNavigate('home')}
            className={`font-sans text-sm font-semibold tracking-wide transition-all pb-1 ${
              activePage === 'home' 
                ? (isDark ? 'text-white border-b-2 border-blue-500' : 'text-slate-900 border-b-2 border-blue-600') 
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Find Stays
          </button>
          <button
            id="nav-hotels-btn"
            onClick={() => onNavigate('list')}
            className={`font-sans text-sm font-semibold tracking-wide transition-all pb-1 ${
              activePage === 'list' || activePage === 'details' || activePage === 'booking'
                ? (isDark ? 'text-white border-b-2 border-blue-500' : 'text-slate-900 border-b-2 border-blue-600') 
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Resorts
          </button>
          <button
            id="nav-dashboard-btn"
            onClick={() => onNavigate('dashboard')}
            className={`font-sans text-sm font-semibold tracking-wide transition-all pb-1 flex items-center gap-1.5 ${
              activePage === 'dashboard'
                ? (isDark ? 'text-white border-b-2 border-blue-500' : 'text-slate-900 border-b-2 border-blue-600') 
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="h-4 w-4 text-amber-500" /> Executive Portal
          </button>
        </nav>

        {/* Actions Zone */}
        <div className="flex items-center gap-4.5">
          {/* Light/Dark Mode Switcher */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
              isDark 
                ? 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-amber-400' 
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-indigo-950'
            }`}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Action Button: My Bookings Indicator */}
          <button
            id="nav-view-bookings-btn"
            onClick={() => setShowBookingsDrawer(true)}
            className={`group relative flex items-center gap-2 rounded-xl border px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider transition-all ${
              isDark 
                ? 'border-zinc-850 bg-zinc-900/50 text-slate-100 hover:bg-zinc-850' 
                : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Calendar className="h-4 w-4 text-slate-450 transition-colors group-hover:text-slate-900 dark:group-hover:text-white" />
            <span>My Bookings</span>
            {bookings.length > 0 && (
              <span className="absolute -top-1.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                {bookings.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Bookings Drawer */}
      {showBookingsDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs">
          {/* Backdrop Closer */}
          <div className="absolute inset-0" onClick={() => setShowBookingsDrawer(false)} />

          {/* Drawer Body */}
          <div className={`relative z-10 flex h-full w-full max-w-md flex-col shadow-2xl animate-drawer-in ${
            isDark ? 'bg-zinc-950 border-l border-zinc-850 text-white' : 'bg-white text-slate-900'
          }`}>
            <div className={`flex items-center justify-between border-b p-6 ${
              isDark ? 'border-zinc-900' : 'border-slate-200'
            }`}>
              <div>
                <h3 className="font-serif text-lg font-bold">Your Reservations</h3>
                <p className="font-sans text-xs text-slate-400">Manage your simulated hotel bookings</p>
              </div>
              <button
                id="drawer-close-btn"
                onClick={() => setShowBookingsDrawer(false)}
                className={`rounded-lg p-2 ${
                  isDark ? 'text-zinc-500 hover:bg-zinc-800 hover:text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {bookings.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className={`mb-4 rounded-full p-4 ${isDark ? 'bg-zinc-905 text-zinc-700' : 'bg-slate-50 text-slate-300'}`}>
                    <Calendar className="h-10 w-10" />
                  </div>
                  <h4 className="font-serif text-sm font-semibold">No active bookings</h4>
                  <p className="mt-2 text-xs text-slate-400 max-w-xs leading-relaxed">
                    Once you select and book a luxury room, your mock reservation details will appear here.
                  </p>
                  <button
                    id="drawer-start-booking-btn"
                    onClick={() => {
                      setShowBookingsDrawer(false);
                      onNavigate('list');
                    }}
                    className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-white hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                  >
                    Browse Hotels
                  </button>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`group overflow-hidden rounded-xl border transition-all ${
                      isDark 
                        ? 'border-zinc-850 bg-zinc-900 hover:border-zinc-700' 
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="relative h-28 w-full bg-slate-50">
                      <img
                        src={booking.hotelImage}
                        alt={booking.hotelName}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 rounded bg-blue-50 text-blue-700 font-bold px-2 py-0.5 text-[10px] tracking-wider uppercase shadow-sm">
                        {booking.status}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif text-base font-bold">{booking.hotelName}</h4>
                      <p className="font-sans text-xs font-semibold text-slate-400 mt-0.5">{booking.roomName}</p>
                      
                      <div className={`mt-3 grid grid-cols-2 gap-2 border-t border-b py-3 text-[11px] ${
                        isDark ? 'border-zinc-850 text-slate-300' : 'border-slate-100 text-slate-600'
                      }`}>
                        <div>
                          <span className="block font-semibold text-slate-400 uppercase tracking-widest text-[9px]">Check-In</span>
                          <span className="font-medium">{booking.checkIn}</span>
                        </div>
                        <div>
                          <span className="block font-semibold text-slate-400 uppercase tracking-widest text-[9px]">Check-Out</span>
                          <span className="font-medium">{booking.checkOut}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400">Amount Paid</span>
                          <div className="text-sm font-bold text-blue-500">${booking.totalPrice}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            id={`drawer-view-booking-${booking.id}`}
                            onClick={() => {
                              onSelectBooking(booking);
                              setShowBookingsDrawer(false);
                              onNavigate('confirmation');
                            }}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                              isDark 
                                ? 'border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white' 
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                            title="View Receipt"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            id={`drawer-cancel-booking-${booking.id}`}
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this reservation? (This is a mock operation)')) {
                                onCancelBooking(booking.id);
                              }
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-105 text-red-500 hover:bg-red-500/10"
                            title="Cancel Booking"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
