import { CheckCircle2, MapPin, Calendar, Clock, Sparkles, Printer, Clipboard, Home, Compass } from 'lucide-react';
import { Booking } from '../types';

interface ConfirmationViewProps {
  booking: Booking;
  onNavigateHome: () => void;
  onNavigateHotels: () => void;
}

export default function ConfirmationView({
  booking,
  onNavigateHome,
  onNavigateHotels,
}: ConfirmationViewProps) {
  
  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.id);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 lg:px-8 bg-slate-50/20">
      {/* 1. Header Success State */}
      <div className="text-center space-y-4 mb-10 max-w-lg mx-auto">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100 animate-fade-in">
          <CheckCircle2 className="h-9 w-9 text-blue-600" />
        </div>
        <span className="block font-sans text-xs font-bold uppercase tracking-wider text-blue-700">Stay Secured Successfully</span>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Your Reservation is Confirmed
        </h1>
        <p className="font-sans text-sm text-slate-500 font-light leading-relaxed">
          We’ve dispatched a simulated itinerary confirmation to <strong className="text-slate-705">{booking.guestEmail}</strong>. Please review details below.
        </p>
      </div>

      {/* 2. Visual Ticket Pass Sheet */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl max-w-2xl mx-auto print:border-none print:shadow-none animate-fade-in">
        {/* Ticket Header Banner */}
        <div className="relative h-48 bg-slate-900 text-white p-6 md:p-8 flex items-end">
          <img
            src={booking.hotelImage}
            alt={booking.hotelName}
            className="absolute inset-0 h-full w-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          {/* Shading filter */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-slate-950/10" />

          {/* Core hotel identifier */}
          <div className="relative z-10">
            <span className="flex items-center gap-1 font-sans text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">
              <Sparkles className="h-3 w-3" /> Aura Residences Guest ticket
            </span>
            <h2 className="font-serif text-2xl font-bold text-white mt-1.5 leading-none">{booking.hotelName}</h2>
          </div>
        </div>

        {/* Ticket Body details sheet */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Reservation Code block */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Reservation Identifier</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-base font-extrabold text-slate-900 tracking-wide">{booking.id}</span>
                <button
                  id="ticket-copy-code-btn"
                  onClick={handleCopyCode}
                  className="rounded-lg bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100 transition-colors"
                  title="Copy Reservation Code"
                >
                  <Clipboard className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            
            {/* Status indicators */}
            <div className="flex sm:text-right flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Payment Status</span>
              <span className="mt-1 inline-flex items-center gap-1.5 self-start sm:self-end rounded bg-slate-100 px-3 py-1 font-sans text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" /> SIMULATED PAID
              </span>
            </div>
          </div>

          {/* Time & calendar schedule grid */}
          <div className="grid grid-cols-2 gap-6 border-b border-slate-100 pb-5 text-slate-800">
            <div>
              <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <Calendar className="h-3.5 w-3.5 text-slate-400" /> Check-In
              </span>
              <span className="block font-sans text-sm font-bold mt-1">{booking.checkIn}</span>
              <span className="text-[11px] text-slate-400 font-light mt-0.5 block leading-none">After 3:00 PM</span>
            </div>
            <div>
              <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                <Calendar className="h-3.5 w-3.5 text-slate-400" /> Check-Out
              </span>
              <span className="block font-sans text-sm font-bold mt-1">{booking.checkOut}</span>
              <span className="text-[11px] text-slate-400 font-light mt-0.5 block leading-none">Before 11:00 AM</span>
            </div>
          </div>

          {/* Room type + party specs details */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-b border-slate-100 pb-5">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Accommodation Type</span>
              <span className="font-sans text-sm font-semibold text-slate-800 mt-1 block">{booking.roomName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Stay Party capacity</span>
              <span className="font-sans text-sm font-semibold text-slate-800 mt-1 block">{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Registered Billing coordinates */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Primary Resident</span>
              <span className="font-sans text-sm font-bold text-slate-800 mt-1 block">{booking.guestName}</span>
              <span className="text-[11px] text-slate-400 font-light mt-0.5 block leading-none">{booking.guestPhone}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Paid Transaction</span>
              <span className="font-serif text-xl font-bold text-blue-600 mt-1 block">${booking.totalPrice} USD</span>
              <span className="text-[10px] text-slate-400 font-light mt-0.5 block leading-none animate-fade-in">
                {booking.cardNumber ? `Billed to card ending ${booking.cardNumber.slice(-4)}` : 'Secured via standard desk hold'}
              </span>
            </div>
          </div>

          {/* Special Requests, if present */}
          {booking.specialRequests && (
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Stay Instructions & Requests</span>
              <p className="text-slate-600 italic font-light">"{booking.specialRequests}"</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Helpful advice guidelines */}
      <div className="max-w-xl mx-auto mt-8 flex gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-slate-500 leading-relaxed font-light">
        <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-700 font-semibold block">Important Check-In advice</strong>
          Please arrive with a valid photo ID matching the primary resident name. Standard check-in starts at 3:00 PM local time. To configure early key pickups, please link this reservation ticket within your drawer panel.
        </div>
      </div>

      {/* 4. Navigation & Sheet management triggers */}
      <div className="mt-12 flex flex-wrap justify-center gap-4 print:hidden animate-fade-in">
        <button
          id="confirm-print-receipt-btn"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
        >
          <Printer className="h-4 w-4" /> Print Itinerary
        </button>
        <button
          id="confirm-goto-home-btn"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all"
        >
          <Home className="h-4 w-4" /> Home Panel
        </button>
        <button
          id="confirm-goto-browse-btn"
          onClick={onNavigateHotels}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-100"
        >
          <Compass className="h-4 w-4" /> Browse hotels
        </button>
      </div>
    </div>
  );
}
