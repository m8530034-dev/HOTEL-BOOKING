import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import HotelListView from './components/HotelListView';
import RoomDetailsView from './components/RoomDetailsView';
import BookingView from './components/BookingView';
import ConfirmationView from './components/ConfirmationView';
import DashboardView from './components/DashboardView';
import AiAssistantWidget from './components/AiAssistantWidget';

import { HOTELS_DATA } from './data/hotels';
import { Hotel, Room, Booking, SearchQuery } from './types';
import { MapPin, Mail, Phone, Compass, ArrowUpRight } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<'home' | 'list' | 'details' | 'booking' | 'confirmation' | 'dashboard'>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('aura_theme_pref') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      localStorage.setItem('aura_theme_pref', newTheme);
    } catch (e) {
      console.error(e);
    }
  };

  // Selected Entities
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  // Search Parameters
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    destination: '',
    checkIn: '2026-06-14',
    checkOut: '2026-06-19',
    guests: 2,
  });

  // Bookings Storage State
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load existing bookings from browser storage on startup
  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem('aura_reservations_db');
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      }
    } catch (e) {
      console.error('Failed to parse saved reservations database', e);
    }
  }, []);

  // Save bookings to local storage
  const saveBookings = (updatedBookings: Booking[]) => {
    setBookings(updatedBookings);
    try {
      localStorage.setItem('aura_reservations_db', JSON.stringify(updatedBookings));
    } catch (e) {
      console.error('Failed to save reservations to local storage', e);
    }
  };

  // 1. Search submissions
  const handleSearch = (query: SearchQuery) => {
    setSearchQuery(query);
    // Find matching hotel directly or redirect to selection layout
    if (query.destination) {
      const match = HOTELS_DATA.find(
        (h) => h.city.toLowerCase() === query.destination.toLowerCase()
      );
      if (match) {
        setSelectedHotel(match);
      }
    }
    setCurrentPage('list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Select Hotel
  const handleSelectHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Clear Search Filter
  const handleClearSearch = () => {
    setSearchQuery({
      destination: '',
      checkIn: '2026-06-14',
      checkOut: '2026-06-19',
      guests: 2,
    });
  };

  // 4. Select Room
  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 5. Submit Booking Receipt details
  const handleConfirmBooking = (bookingData: Omit<Booking, 'id' | 'status' | 'bookingDate'>) => {
    if (!selectedHotel || !selectedRoom) return;

    // Build custom reservation identifier code
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const identifierCode = `AURA-${randomCode}-${selectedHotel.city.toUpperCase()}`;

    const newBooking: Booking = {
      ...bookingData,
      id: identifierCode,
      status: 'confirmed',
      bookingDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    const updatedBookings = [newBooking, ...bookings];
    saveBookings(updatedBookings);
    setCurrentBooking(newBooking);
    setCurrentPage('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 6. Rescind/Cancel simulated Booking
  const handleCancelBooking = (bookingId: string) => {
    const updatedBookings = bookings.filter((b) => b.id !== bookingId);
    saveBookings(updatedBookings);
  };

  // 7. Select Booking for active details view
  const handleSelectBooking = (booking: Booking) => {
    setCurrentBooking(booking);
  };

  return (
    <div className={`flex flex-col min-h-screen transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-zinc-950 text-slate-100 dark' 
        : 'bg-[#fcfbf9] text-stone-900'
    }`}>
      {/* Dynamic Header */}
      <Navbar
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        bookings={bookings}
        onSelectBooking={handleSelectBooking}
        onCancelBooking={handleCancelBooking}
        activePage={currentPage}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Pages Router */}
      <main className="flex-1 animate-fade-in pb-16">
        {currentPage === 'home' && (
          <HomeView
            hotels={HOTELS_DATA}
            onSearch={handleSearch}
            onSelectHotel={handleSelectHotel}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'list' && (
          <HotelListView
            hotels={HOTELS_DATA}
            initialSearchQuery={searchQuery}
            onSelectHotel={handleSelectHotel}
            onClearSearch={handleClearSearch}
          />
        )}

        {currentPage === 'details' && selectedHotel && (
          <RoomDetailsView
            hotel={selectedHotel}
            onBack={() => setCurrentPage('list')}
            onSelectRoom={handleSelectRoom}
          />
        )}

        {currentPage === 'booking' && selectedHotel && selectedRoom && (
          <BookingView
            hotel={selectedHotel}
            room={selectedRoom}
            initialCheckIn={searchQuery.checkIn}
            initialCheckOut={searchQuery.checkOut}
            initialGuests={searchQuery.guests}
            onBack={() => setCurrentPage('details')}
            onSubmitBooking={handleConfirmBooking}
          />
        )}

        {currentPage === 'confirmation' && currentBooking && (
          <ConfirmationView
            booking={currentBooking}
            onNavigateHome={() => setCurrentPage('home')}
            onNavigateHotels={() => {
              handleClearSearch();
              setCurrentPage('list');
            }}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardView
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onSelectBooking={handleSelectBooking}
            onNavigatePage={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            theme={theme}
          />
        )}
      </main>

      {/* Floating Smart AI Butler Assist Drawer */}
      <AiAssistantWidget theme={theme} />

      {/* 3. High-End Luxury Footer */}
      <footer className={`border-t print:hidden ${
        theme === 'dark' 
          ? 'border-zinc-900 bg-zinc-950 text-slate-400' 
          : 'border-stone-200 bg-stone-50 text-stone-600'
      }`}>
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          {/* Logo & details */}
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 dark:bg-zinc-900 text-white">
              <Compass className="h-4 w-4" />
            </div>
            <span className={`font-serif text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>AURA</span>
            <span className="text-[10px] text-stone-405 font-bold tracking-wider uppercase ml-1">Resorts</span>
          </div>

          {/* Quick Support channels */}
          <div className="mt-8 flex justify-center gap-6 md:order-3 md:mt-0 font-sans text-xs font-light">
            <span className="flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-white transition-colors">
              <Mail className="h-3.5 w-3.5" /> support@aura-escape.local
            </span>
            <span className="flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-white transition-colors">
              <Phone className="h-3.5 w-3.5" /> +1 (800) Aura-Resort
            </span>
          </div>

          <div className="mt-8 md:order-1 md:mt-0 text-center md:text-left">
            <p className="font-sans text-[11px] text-stone-400 font-light leading-relaxed">
              &copy; {new Date().getFullYear()} Aura Resorts & Residences Ltd. All simulated bookings reserved under elite guidelines.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

