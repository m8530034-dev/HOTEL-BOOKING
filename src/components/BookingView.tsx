import React, { useState, useMemo } from 'react';
import { ArrowLeft, Calendar, Users, Star, Info, CreditCard, ShieldCheck } from 'lucide-react';
import { Hotel, Room, Booking } from '../types';

interface BookingViewProps {
  hotel: Hotel;
  room: Room;
  initialCheckIn: string;
  initialCheckOut: string;
  initialGuests: number;
  onBack: () => void;
  onSubmitBooking: (bookingData: Omit<Booking, 'id' | 'status' | 'bookingDate'>) => void;
}

export default function BookingView({
  hotel,
  room,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  onBack,
  onSubmitBooking,
}: BookingViewProps) {
  // Local Room override state allowing changing room types direct in this view!
  const [selectedRoomId, setSelectedRoomId] = useState(room.id);

  // Look up full room details from selected ID
  const currentRoom = useMemo(() => {
    return hotel.rooms.find((r) => r.id === selectedRoomId) || room;
  }, [hotel.rooms, selectedRoomId, room]);

  // Local Booking Details States
  const [checkIn, setCheckIn] = useState(initialCheckIn || '2026-06-14');
  const [checkOut, setCheckOut] = useState(initialCheckOut || '2026-06-19');
  const [guests, setGuests] = useState(initialGuests || 2);

  // Guest Contact Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Mock Card Details
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Calculations reactive to date spans and selected room rate
  const calculations = useMemo(() => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    let nights = 1;
    if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      nights = diffDays > 0 ? diffDays : 1;
    }

    const subtotal = currentRoom.pricePerNight * nights;
    const taxes = Math.round(subtotal * 0.12); // Mock 12% Tax
    const resortFee = 25 * nights; // $25 wellness fee
    const total = subtotal + taxes + resortFee;

    return { nights, subtotal, taxes, resortFee, total };
  }, [checkIn, checkOut, currentRoom.pricePerNight]);

  // Extensive Validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    // Name validation
    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (firstName.trim().length < 2) {
      errors.firstName = 'First name must contain at least 2 characters';
    }
    
    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (lastName.trim().length < 2) {
      errors.lastName = 'Last name must contain at least 2 characters';
    }
    
    // Email Validation (RFC 5322 Standard format)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailPattern.test(email)) {
      errors.email = 'Please provide a valid email format (e.g. name@domain.com)';
    }

    // Mobile Phone Validation (At least 7 digits, supports +, spaces, hyphens)
    const phonePattern = /^\+?[0-9\s\-()]{7,18}$/;
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phonePattern.test(phone)) {
      errors.phone = 'Enter a valid mobile number (e.g., +44 7911 123456, min 7 digits)';
    }

    // Check-In / Check-Out Date Validation
    const today = new Date('2026-06-13'); // Target date reference from environment metadata
    today.setHours(0, 0, 0, 0);

    const checkInDate = new Date(checkIn);
    checkInDate.setHours(0, 0, 0, 0);

    const checkOutDate = new Date(checkOut);
    checkOutDate.setHours(0, 0, 0, 0);

    if (isNaN(checkInDate.getTime())) {
      errors.checkIn = 'Please provide a valid check-in date';
    } else if (checkInDate < today) {
      errors.checkIn = 'Check-in date cannot be in the past';
    }

    if (isNaN(checkOutDate.getTime())) {
      errors.checkOut = 'Please provide a valid check-out date';
    } else if (checkOutDate <= checkInDate) {
      errors.checkOut = 'Check-out date must remain after your check-in date';
    }

    // Guests Count cap validation
    if (guests <= 0) {
      errors.guests = 'Party size must include at least 1 guest';
    } else if (guests > currentRoom.maxGuests) {
      errors.guests = `Party size cannot exceed ${currentRoom.maxGuests} guests for the ${currentRoom.name}.`;
    }

    // Mock payments validation (only if card number provided)
    if (cardNumber.trim() && cardNumber.replace(/\s/g, '').length < 16) {
      errors.cardNumber = 'Mock credit card number must contain exactly 16 digits';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Smooth scroll back to form errors at the top
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    onSubmitBooking({
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.image,
      roomId: currentRoom.id,
      roomName: currentRoom.name,
      roomPrice: currentRoom.pricePerNight,
      checkIn,
      checkOut,
      guests,
      guestName: `${firstName.trim()} ${lastName.trim()}`,
      guestEmail: email.trim(),
      guestPhone: phone.trim(),
      specialRequests: specialRequests.trim(),
      cardNumber: cardNumber ? `**** **** **** ${cardNumber.replace(/\s/g, '').slice(-4)}` : undefined,
      cardExpiry,
      totalPrice: calculations.total,
    });
  };

  // Safe credit card spacing injector
  const handleCardNumberChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 16);
    // Add spacer drafts (1234 5678 1234 5678)
    const formatted = digitsOnly.match(/.{1,4}/g)?.join(' ') || digitsOnly;
    setCardNumber(formatted);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8 bg-slate-50/20">
      {/* 1. Back Header link */}
      <button
        id="booking-back-to-details-btn"
        onClick={onBack}
        className="group inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Return to room select</span>
      </button>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* 2. Customer billing & details submission FORM (Col size: 7) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-10 animate-fade-in">
            {/* Form Title */}
            <div>
              <h1 className="font-serif text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                Secure Stay Reservation
              </h1>
              <p className="mt-2 font-sans text-sm text-slate-500">
                Please complete the following details. Your stay will be immediately secured as a simulated reservation.
              </p>
            </div>

            {/* Part A: Dynamic Room type selection */}
            <div className="space-y-6">
              <h2 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-150 pb-3">
                1. Accommodation & Room Class
              </h2>
              <div>
                <label htmlFor="room-type-select" className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Selected Suite / Room Class</label>
                <div className="relative mt-1.5">
                  <select
                    id="room-type-select"
                    value={selectedRoomId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setSelectedRoomId(newId);
                      const targetRoom = hotel.rooms.find((r) => r.id === newId);
                      if (targetRoom && guests > targetRoom.maxGuests) {
                        setGuests(targetRoom.maxGuests);
                      }
                    }}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 font-sans text-xs font-bold text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden transition-all cursor-pointer"
                  >
                    {hotel.rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.type} class) — ${r.pricePerNight} USD / night (Max {r.maxGuests} guests)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Micro Room Card inside the form for delightful feedback */}
                <div className="mt-4 flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-100 bg-white shadow-xs">
                  <div className="h-24 w-full sm:w-36 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src={currentRoom.image}
                      alt={currentRoom.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-block rounded bg-blue-50 text-blue-700 font-bold px-2 py-0.5 text-[9px] tracking-wider uppercase">
                        {currentRoom.type} Suite
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Max {currentRoom.maxGuests} guests</span>
                    </div>
                    <h4 className="font-serif text-sm font-bold text-slate-900 truncate">{currentRoom.name}</h4>
                    <p className="font-sans text-[11px] text-slate-500 font-light line-clamp-2 leading-normal">
                      {currentRoom.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Part B: Guest contact Details */}
            <div className="space-y-6">
              <h2 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-150 pb-3">
                2. Guest Contact Information
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">First Name</label>
                  <input
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`mt-1.5 block w-full rounded-xl border p-3 font-sans text-xs text-slate-800 focus:outline-hidden transition-all ${
                      formErrors.firstName
                        ? 'border-red-500 bg-red-50/5 focus:border-red-655 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 bg-slate-50/50 focus:border-blue-600 focus:bg-white'
                    }`}
                    placeholder="E.g. Alexander"
                  />
                  {formErrors.firstName && <p className="text-[11px] text-red-500 mt-1">{formErrors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="last-name" className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Last Name</label>
                  <input
                    id="last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`mt-1.5 block w-full rounded-xl border p-3 font-sans text-xs text-slate-800 focus:outline-hidden transition-all ${
                      formErrors.lastName
                        ? 'border-red-500 bg-red-50/5 focus:border-red-655 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 bg-slate-50/50 focus:border-blue-600 focus:bg-white'
                    }`}
                    placeholder="E.g. Dubois"
                  />
                  {formErrors.lastName && <p className="text-[11px] text-red-500 mt-1">{formErrors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Email Address</label>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`mt-1.5 block w-full rounded-xl border p-3 font-sans text-xs text-slate-800 focus:outline-hidden transition-all ${
                      formErrors.email
                        ? 'border-red-500 bg-red-50/5 focus:border-red-655 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 bg-slate-50/50 focus:border-blue-600 focus:bg-white'
                    }`}
                    placeholder="alexander@domain.com"
                  />
                  {formErrors.email && <p className="text-[11px] text-red-500 mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`mt-1.5 block w-full rounded-xl border p-3 font-sans text-xs text-slate-800 focus:outline-hidden transition-all ${
                      formErrors.phone
                        ? 'border-red-500 bg-red-50/5 focus:border-red-655 focus:ring-2 focus:ring-red-100'
                        : 'border-slate-200 bg-slate-50/50 focus:border-blue-600 focus:bg-white'
                    }`}
                    placeholder="+44 7911 123456"
                  />
                  {formErrors.phone && <p className="text-[11px] text-red-550 mt-1">{formErrors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="special-requests" className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Special Requests (Optional)</label>
                <textarea
                  id="special-requests"
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 font-sans text-xs text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden transition-all"
                  placeholder="E.g. Early check-in, dietary preferences, or sound isolation priority details..."
                />
              </div>
            </div>

            {/* Part C: Simulated Card payment */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                <h2 className="font-serif text-lg font-bold text-slate-900">
                  2. Dynamic Simulation Payment
                </h2>
                <span className="inline-flex items-center gap-1 rounded bg-blue-55 px-2 py-0.5 text-[9px] font-bold text-blue-750 uppercase">
                  No charges apply
                </span>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-200 p-5 bg-slate-50/60 flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="font-sans text-xs text-slate-405 leading-relaxed font-light">
                  Aura employs a simulated billing structure. You can utilize fake details or leave these card coordinates blank—your booking will succeed immediately.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="card-name" className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5 text-slate-400" /> Cardholder Name
                  </label>
                  <input
                    id="card-name"
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 font-sans text-xs text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden transition-all"
                    placeholder="Alexander Dubois"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label htmlFor="card-number" className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Card Number</label>
                    <input
                      id="card-number"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 font-sans text-xs text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden transition-all"
                      placeholder="4000 1234 5678 9010"
                    />
                    {formErrors.cardNumber && <p className="text-[11px] text-red-500 mt-1">{formErrors.cardNumber}</p>}
                  </div>
                  <div>
                    <label htmlFor="card-expiry" className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Expiry</label>
                    <input
                      id="card-expiry"
                      type="text"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 font-sans text-xs text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-hidden text-center transition-all"
                      placeholder="MM/YY"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-6 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
              <button
                id="booking-quit-btn"
                type="button"
                onClick={onBack}
                className="rounded-lg border border-slate-200 text-slate-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
              >
                Go Back
              </button>
              <button
                id="booking-confirm-btn"
                type="submit"
                className="rounded-lg bg-blue-600 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="h-4 w-4" /> Confirm Reservation
              </button>
            </div>
          </form>
        </div>

        {/* 3. Right SIDEBAR Summary Receipt Breakdown (Col size: 5) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sticky top-28 space-y-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Stay Summary
            </h3>

            {/* Selected Resort Details Block */}
            <div className="flex gap-4 pb-4 border-b border-slate-150">
              <div className="h-20 w-24 rounded-lg bg-slate-200 overflow-hidden shrink-0 shadow-xs">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="flex items-center gap-0.5 font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {hotel.city} <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500 ml-1" /> {hotel.rating}
                </span>
                <h4 className="font-serif text-base font-bold text-slate-900 leading-tight mt-1">{hotel.name}</h4>
                <p className="font-sans text-xs text-slate-500 font-semibold mt-0.5">{currentRoom.name}</p>
              </div>
            </div>

            {/* Interactive Travel date selectors inside the statement */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Configure Stay Dates</span>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div className={`rounded-xl border p-3 ${formErrors.checkIn ? 'border-red-500 bg-red-50/5' : 'border-slate-200 bg-slate-50/50'}`}>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Check-In</span>
                  <input
                    id="booking-checkin-date"
                    type="date"
                    value={checkIn}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (formErrors.checkIn) {
                        setFormErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.checkIn;
                          return copy;
                        });
                      }
                    }}
                    className="block w-full border-0 p-0 font-sans text-xs font-semibold text-slate-800 focus:ring-0 cursor-pointer mt-0.5 bg-transparent focus:outline-hidden"
                  />
                </div>
                <div className={`rounded-xl border p-3 ${formErrors.checkOut ? 'border-red-500 bg-red-50/5' : 'border-slate-200 bg-slate-50/50'}`}>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Check-Out</span>
                  <input
                    id="booking-checkout-date"
                    type="date"
                    value={checkOut}
                    onChange={(e) => {
                      setCheckOut(e.target.value);
                      if (formErrors.checkOut) {
                        setFormErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.checkOut;
                          return copy;
                        });
                      }
                    }}
                    className="block w-full border-0 p-0 font-sans text-xs font-semibold text-slate-800 focus:ring-0 cursor-pointer mt-0.5 bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>
              
              {formErrors.checkIn && <p className="text-[11px] text-red-550 font-light mt-1">● {formErrors.checkIn}</p>}
              {formErrors.checkOut && <p className="text-[11px] text-red-550 font-light mt-1">● {formErrors.checkOut}</p>}

              <div className={`flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-medium ${formErrors.guests ? 'border-red-550 bg-red-50/5' : 'border-slate-200 bg-slate-50/50'}`}>
                <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase"><Users className="h-3.5 w-3.5 text-slate-500" /> Party Size</span>
                <select
                  id="booking-party-select"
                  value={guests}
                  onChange={(e) => {
                    setGuests(Number(e.target.value));
                    if (formErrors.guests) {
                      setFormErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.guests;
                        return copy;
                      });
                    }
                  }}
                  className="font-sans text-xs font-bold text-slate-850 bg-transparent border-none p-0 cursor-pointer focus:ring-0"
                >
                  {Array.from({ length: Math.max(currentRoom.maxGuests, 6) }).map((_, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {idx + 1} {idx + 1 === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
              {formErrors.guests && <p className="text-[11px] text-red-550 font-light mt-1">● {formErrors.guests}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-slate-150 pt-5 space-y-3.5 font-sans">
              <div className="flex justify-between text-xs font-medium text-slate-550">
                <span>${currentRoom.pricePerNight} x {calculations.nights} night{calculations.nights > 1 ? 's' : ''}</span>
                <span className="font-mono font-semibold text-slate-900">${calculations.subtotal}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-550">
                <span>Estimated Resort Tax (12%)</span>
                <span className="font-mono text-slate-900">${calculations.taxes}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-550">
                <span>Wellness Amenity Levy (${calculations.resortFee/calculations.nights}/day)</span>
                <span className="font-mono text-slate-900">${calculations.resortFee}</span>
              </div>

              <div className="flex justify-between items-end border-t border-slate-200 pt-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Balance Due</span>
                  <span className="font-serif text-3xl font-extrabold text-blue-600 leading-none">${calculations.total}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Inclusive of local taxes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
