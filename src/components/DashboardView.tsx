import { useState, useMemo } from 'react';
import { Booking } from '../types';
import { 
  Award, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Compass, 
  User, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Printer, 
  Trash2, 
  Smartphone,
  Info
} from 'lucide-react';

interface DashboardViewProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onSelectBooking: (booking: Booking) => void;
  onNavigatePage: (page: 'home' | 'list' | 'details' | 'booking' | 'confirmation') => void;
  theme: 'light' | 'dark';
}

export default function DashboardView({ 
  bookings, 
  onCancelBooking, 
  onSelectBooking, 
  onNavigatePage,
  theme 
}: DashboardViewProps) {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'canceled'>('all');
  const [showInvoiceId, setShowInvoiceId] = useState<string | null>(null);

  // Statistics calculation based on bookings
  const stats = useMemo(() => {
    let totalNights = 0;
    let totalSpent = 0;
    let completedStays = 0;
    
    // Sort or calculate for real data
    bookings.forEach(b => {
      // Calculate night delta
      const start = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        totalNights += diffDays;
      } else {
        totalNights += 1;
      }
      
      if (b.status === 'confirmed') {
        totalSpent += b.totalPrice;
        completedStays += 1;
      }
    });

    // Loyalty Tier classification based on bookings
    let tier = 'Silver Select';
    let discount = '5%';
    let tierColor = 'from-slate-400 to-zinc-500';
    let milesEarned = Math.round(totalSpent * 1.5);

    if (totalSpent > 1200) {
      tier = 'Obsidian Onyx Royal';
      discount = '20% + Helipad';
      tierColor = 'from-indigo-600 to-slate-950';
    } else if (totalSpent > 500) {
      tier = 'Signature Gold Patron';
      discount = '12% + Late Checkout';
      tierColor = 'from-amber-500 to-indigo-900';
    }

    return { totalNights, totalSpent, completedStays, tier, discount, tierColor, milesEarned };
  }, [bookings]);

  // Filtered stay rows
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (activeTab === 'all') return true;
      if (activeTab === 'active') return b.status === 'confirmed';
      if (activeTab === 'completed') return b.status === 'confirmed'; // In our sandbox we treat active/confirmed similarly
      if (activeTab === 'canceled') return b.status === 'canceled';
      return true;
    });
  }, [bookings, activeTab]);

  // Custom function to print receipt/invoice
  const handlePrint = (bookingId: string) => {
    setShowInvoiceId(bookingId);
    setTimeout(() => {
      window.print();
    }, 450);
  };

  return (
    <div className={`mx-auto max-w-7xl px-6 py-12 lg:px-8 transition-colors duration-300 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/50 dark:border-slate-800/50">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-blue-500 uppercase">
            Executive Club Portal
          </span>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight md:text-4xl mt-1.5 flex items-center gap-2">
            Welcome, Elite Guest <Award className="h-6 w-6 text-amber-500 animate-pulse" />
          </h1>
          <p className="font-sans text-xs text-slate-400 mt-1 max-w-md font-light">
            Manage your bespoke reservations, track your Aura royal milestone points, and download invoices.
          </p>
        </div>

        {/* Executive Loyalty Tier Emblem - Glassmorphic badge */}
        <div className={`rounded-2xl bg-gradient-to-r ${stats.tierColor} p-5 text-white shadow-xl max-w-xs shrink-0 flex items-center gap-4`}>
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
            <Compass className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <span className="block text-[9px] font-bold tracking-widest text-slate-200 uppercase">AURA LOYALTY TIER</span>
            <span className="text-base font-serif font-bold tracking-tight block">{stats.tier}</span>
            <span className="text-[10px] text-slate-300 font-light">{stats.discount} benefits unlocked</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive SVG metrics and statistics counters */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Spending */}
        <div className={`rounded-2xl border p-6 transition-all duration-300 backdrop-blur-md ${
          isDark 
            ? 'bg-zinc-900/50 border-zinc-800 shadow-zinc-950/20 shadow-md' 
            : 'bg-white/80 border-slate-200 shadow-slate-100 shadow-md'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold uppercase tracking-widest text-[10px]">Total Investment</span>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="font-sans text-3xl font-extrabold tracking-tight">${stats.totalSpent}</span>
            <span className="text-slate-400 text-xs font-light">USD</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-light">Based on verified active reservations with Aura.</p>
        </div>

        {/* Metric 2: Evenings Spent */}
        <div className={`rounded-2xl border p-6 transition-all duration-300 backdrop-blur-md ${
          isDark 
            ? 'bg-zinc-900/50 border-zinc-800 shadow-zinc-950/20 shadow-md' 
            : 'bg-white/80 border-slate-200 shadow-slate-100 shadow-md'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold uppercase tracking-widest text-[10px]">Evenings Reserved</span>
            <Calendar className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="font-sans text-3xl font-extrabold tracking-tight">{stats.totalNights}</span>
            <span className="text-slate-400 text-xs font-light">Nights</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-light">Total times sleeping in classic or imperial suites.</p>
        </div>

        {/* Metric 3: Stays counter */}
        <div className={`rounded-2xl border p-6 transition-all duration-300 backdrop-blur-md ${
          isDark 
            ? 'bg-zinc-900/50 border-zinc-800 shadow-zinc-950/20 shadow-md' 
            : 'bg-white/80 border-slate-200 shadow-slate-100 shadow-md'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold uppercase tracking-widest text-[10px]">Bookings Made</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="font-sans text-3xl font-extrabold tracking-tight">{bookings.length}</span>
            <span className="text-slate-400 text-xs font-light">Stays</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-light">Success rate: {bookings.length > 0 ? "100%" : "No trips yet"}</p>
        </div>

        {/* Metric 4: Aura Miles Balance */}
        <div className={`rounded-2xl border p-6 transition-all duration-300 backdrop-blur-md ${
          isDark 
            ? 'bg-zinc-900/50 border-zinc-800 shadow-zinc-950/20 shadow-md' 
            : 'bg-white/80 border-slate-200 shadow-slate-100 shadow-md'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold uppercase tracking-widest text-[10px]">Aura Miles Balance</span>
            <Compass className="h-5 w-5 text-purple-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="font-sans text-3xl font-extrabold tracking-tight">{stats.milesEarned}</span>
            <span className="text-slate-400 text-xs font-light">Points</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-light">1.5x Multiplier actively active at all properties.</p>
        </div>
      </div>

      {/* 3. Main Dashboard Layout Section */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: List of Reservations and filters (Spans 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
            <h2 className="font-serif text-lg font-bold">Your Travel Ledger</h2>
            
            {/* Filter Tabs */}
            <div className={`p-1 rounded-xl flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
              isDark ? 'bg-zinc-900' : 'bg-slate-100'
            }`}>
              {(['all', 'active', 'canceled'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-3 py-1.5 transition-all text-[10px] uppercase font-bold tracking-wider ${
                    activeTab === tab 
                      ? 'bg-white text-slate-900 shadow-xs' 
                      : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings table/rows details */}
          {filteredBookings.length === 0 ? (
            <div className={`rounded-3xl border border-dashed p-12 text-center ${
              isDark ? 'border-zinc-800' : 'border-slate-200'
            }`}>
              <div className="mx-auto h-12 w-12 text-slate-300 rounded-full flex items-center justify-center bg-slate-100 mb-4">
                <Compass className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="font-serif font-bold text-sm">No reservations matching criteria</h3>
              <p className="text-xs text-slate-400 mt-1">Ready for custom travel? Browse accommodations to start.</p>
              <button
                onClick={() => onNavigatePage('list')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all"
              >
                Browse Our Resorts
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg hover:border-blue-400 flex flex-col md:flex-row gap-5 items-center ${
                    isDark 
                      ? 'bg-zinc-900/40 border-zinc-805/50 shadow-md shadow-zinc-950/10' 
                      : 'bg-white/90 border-slate-150 shadow-md shadow-slate-100/50'
                  }`}
                >
                  {/* Hotel miniature image thumbnail */}
                  <div className="h-24 w-full md:w-36 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative">
                    <img 
                      src={b.hotelImage} 
                      alt={b.hotelName} 
                      className="h-full w-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 rounded bg-slate-950/70 backdrop-blur-xs text-[8px] font-bold text-white px-2 py-0.5 uppercase">
                      {b.id.split('-')[1] || b.id}
                    </div>
                  </div>

                  <div className="flex-1 w-full text-center md:text-left space-y-1">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="inline-block rounded-md bg-blue-50/10 dark:bg-blue-900/10 text-blue-800 dark:text-blue-300 font-bold px-2 py-0.5 text-[8px] tracking-widest uppercase">
                        {b.roomName}
                      </span>
                      <span className={`rounded-md font-bold px-2 py-0.5 text-[8px] tracking-widest uppercase flex items-center gap-1 ${
                        b.status === 'confirmed' 
                          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/35 dark:text-emerald-400' 
                          : 'bg-red-50 text-red-800 dark:bg-red-950/35 dark:text-red-400'
                      }`}>
                        {b.status === 'confirmed' ? <CheckCircle2 className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                        {b.status}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-extrabold text-slate-900 dark:text-white">{b.hotelName}</h4>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 pt-1 font-light">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-slate-400" /> {b.checkIn} to {b.checkOut}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-400" /> Member key ID provided</span>
                    </div>
                  </div>

                  {/* Pricing action drawer block */}
                  <div className="flex flex-row md:flex-col items-center justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-6 pt-4 md:pt-0 w-full md:w-36 shrink-0 gap-3">
                    <div className="text-left md:text-center w-auto">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold block leading-tight">Total Payment</span>
                      <span className="text-base font-extrabold text-blue-600 block">${b.totalPrice}</span>
                    </div>

                    <div className="flex gap-2 w-auto">
                      {/* View & Print Recelpt Button */}
                      <button
                        onClick={() => handlePrint(b.id)}
                        className={`p-2 rounded-xl transition-all border flex items-center justify-center hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white ${
                          isDark ? 'border-zinc-800 text-slate-400' : 'border-slate-205 text-slate-500'
                        }`}
                        title="Download Luxury Invoice PDF"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          onSelectBooking(b);
                          onNavigatePage('confirmation');
                        }}
                        className={`p-2 rounded-xl transition-all border flex items-center justify-center hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-950 dark:hover:text-white ${
                          isDark ? 'border-zinc-800 text-slate-400' : 'border-slate-205 text-slate-500'
                        }`}
                        title="View Full Booking Details"
                      >
                        <Compass className="h-3.5 w-3.5" />
                      </button>

                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to cancel your luxury stay? Under standard guidelines, a refund coupon will issue immediately.")) {
                              onCancelBooking(b.id);
                            }
                          }}
                          className="p-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50/50 flex items-center justify-center transition-all"
                          title="Cancel Reservation"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Profile & Suite Key Details (Spans 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Executive Profile details with User status badge */}
          <div className={`rounded-2xl border p-6 transition-all duration-300 backdrop-blur-md ${
            isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white/80 border-slate-200'
          }`}>
            <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Executive Profile
            </h3>
            
            <div className="flex items-center gap-3.5 py-4">
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-base font-bold uppercase shadow-md shadow-blue-200">
                EG
              </div>
              <div>
                <span className="font-serif font-bold text-sm block">Elite Guest</span>
                <span className="text-[10px] text-slate-400 font-medium block">Member ID: AURA-ONYX-2026</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-300 font-light border-b border-slate-100 dark:border-slate-800 pb-2">
                <span>Guest Email</span>
                <span className="font-sans font-semibold text-slate-900 dark:text-white">M8530034@gmail.com</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-300 font-light border-b border-slate-100 dark:border-slate-800 pb-2">
                <span>VIP Pref Pack</span>
                <span className="font-bold text-indigo-500">Active (Complimentary)</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-300 font-light pb-1">
                <span>High Floor Priority</span>
                <span className="font-sans font-semibold text-slate-900 dark:text-white">Yes, guaranteed</span>
              </div>
            </div>
          </div>

          {/* QR Code Embedded Digital Room Key Card for instant premium showcase */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-6 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-28 w-28 bg-indigo-500/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 h-20 w-20 bg-blue-500/15 rounded-full blur-xl" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="flex items-center gap-1.5 self-start">
                <Smartphone className="h-4 w-4 text-blue-400" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-300">Digital Suite Entry Key</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl shadow-xl border border-white/10 mt-2 flex justify-center items-center">
                {/* Simulated professional QR code */}
                <svg className="h-28 w-28" viewBox="0 0 100 100">
                  <path d="M5,5 h30 v10 h-20 v20 h-10 z" fill="#000" />
                  <path d="M65,5 h30 v30 h-10 v-20 h-20 z" fill="#000" />
                  <path d="M5,65 h10 v20 h-20 v30 z" fill="#000" />
                  <path d="M65,95 h30 v-30 h-10 v20 h-20 z" fill="#000" />
                  <rect x="20" y="20" width="20" height="20" fill="#000" />
                  <rect x="60" y="20" width="20" height="20" fill="#000" />
                  <rect x="20" y="60" width="20" height="20" fill="#000" />
                  <rect x="65" y="65" width="15" height="15" fill="#4f46e5" />
                  <circle cx="50" cy="50" r="10" fill="#1e1b4b" />
                  <circle cx="50" cy="50" r="5" fill="#60a5fa" />
                </svg>
              </div>

              <div className="space-y-0.5 mt-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">NFC RFID active</span>
                <span className="text-xs font-serif font-bold text-slate-100 block">Tap against screen door lock</span>
                <span className="text-[9px] font-mono text-indigo-300 font-light block">Status: Bluetooth Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PDF INVOICE TEMPLATE (HIDDEN ON SCREEN, REVEALED ENTIRELY ON FILE PRINT) */}
      {showInvoiceId && (
        <div className="hidden print:block fixed inset-0 bg-white text-black p-12 z-9999 font-sans overflow-visible">
          {bookings.find(b => b.id === showInvoiceId) && (() => {
            const invoice = bookings.find(b => b.id === showInvoiceId)!;
            return (
              <div className="space-y-8 text-slate-900">
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b border-slate-300 pb-8">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">AURA RESORTS</h1>
                    <span className="text-xs text-slate-500 block uppercase tracking-wide mt-1">Heritage & Residences Elite Stays</span>
                    <p className="text-xs text-slate-500 mt-2 font-light">12 Avenue des Champs-Élysées, Paris, France</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-800 rounded">
                      Receipt & Statement
                    </span>
                    <p className="text-sm font-bold text-slate-850 mt-3 font-mono">ID: {invoice.id}</p>
                    <p className="text-xs text-slate-400 mt-1 font-light">Date: {invoice.bookingDate}</p>
                  </div>
                </div>

                {/* Bill To Info */}
                <div className="grid grid-cols-2 gap-8 text-xs">
                  <div>
                    <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-2">Registered Guest</h5>
                    <p className="font-bold text-sm text-slate-900">{invoice.guestName}</p>
                    <p className="text-slate-500 mt-1 font-light">{invoice.guestEmail}</p>
                    <p className="text-slate-500 mt-0.5 font-light">{invoice.guestPhone}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-2">Property Details</h5>
                    <p className="font-bold text-sm text-slate-900">{invoice.hotelName}</p>
                    <p className="text-slate-500 mt-1 font-light">{invoice.roomName}</p>
                    <p className="text-slate-500 mt-0.5 font-light">{invoice.checkIn} to {invoice.checkOut}</p>
                  </div>
                </div>

                {/* Invoice Line Items */}
                <div className="mt-12">
                  <table className="w-full text-left text-xs text-slate-800">
                    <thead>
                      <tr className="border-b border-slate-300/50 pb-2 text-[10px] uppercase font-bold text-slate-400">
                        <th className="pb-3">Description</th>
                        <th className="pb-3 text-right">Rate</th>
                        <th className="pb-3 text-center">Nights</th>
                        <th className="pb-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-light">
                      <tr>
                        <td className="py-4">Luxury Suite Booking - {invoice.roomName} (Complimentary High Floor guarantees)</td>
                        <td className="py-4 text-right font-mono">${invoice.roomPrice}</td>
                        <td className="py-4 text-center">Calculated</td>
                        <td className="py-4 text-right font-bold text-slate-900 font-mono">${invoice.totalPrice - Math.round(invoice.totalPrice * 0.12) - 25}</td>
                      </tr>
                      <tr>
                        <td className="py-3">Heritage Wellness Resort Taxes (12% standard)</td>
                        <td className="py-3 text-right font-mono">-</td>
                        <td className="py-3 text-center">-</td>
                        <td className="py-3 text-right font-mono">${Math.round(invoice.totalPrice * 0.12)}</td>
                      </tr>
                      <tr>
                        <td className="py-3">Aura Concierge & Private Butler Amenity surcharge</td>
                        <td className="py-3 text-right font-mono">$25</td>
                        <td className="py-3 text-center">Inclusive</td>
                        <td className="py-3 text-right font-mono">$25</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Invoice Footer total pricing */}
                <div className="border-t border-slate-300 pt-6 flex justify-between items-center text-xs">
                  <div className="max-w-xs text-slate-400 font-light text-[10px] leading-relaxed">
                    Thank you for selecting **AURA**. Stays are authenticated by Aura Resorts Ltd. All reservation and refund parameters are handled under elite security codes.
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Total Settled</span>
                    <span className="text-xl font-serif font-extrabold text-blue-600 block">${invoice.totalPrice} USD</span>
                    <span className="text-[9px] text-emerald-600 font-bold block uppercase tracking-wider flex items-center justify-end gap-1">● PAID IN FULL</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
