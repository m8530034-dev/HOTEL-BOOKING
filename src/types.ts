export interface Room {
  id: string;
  name: string;
  type: 'Standard' | 'Deluxe' | 'Suite' | 'Family';
  pricePerNight: number;
  maxGuests: number;
  description: string;
  amenities: string[];
  image: string;
  available: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: 'London' | 'Paris' | 'New York' | 'Tokyo' | 'Rome';
  rating: number;
  reviewsCount: number;
  description: string;
  image: string;
  amenities: string[];
  featured: boolean;
  rooms: Room[];
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  roomId: string;
  roomName: string;
  roomPrice: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  cardNumber?: string;
  cardExpiry?: string;
  totalPrice: number;
  status: 'confirmed' | 'canceled';
  bookingDate: string;
}

export interface SearchQuery {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}
