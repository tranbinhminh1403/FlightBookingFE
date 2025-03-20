import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

interface GuestBookingRequest {
  guestName: string;
  email: string;
  phoneNumber: string;
  flightId: number;
  seatClass: 'ECONOMY' | 'BUSINESS' | 'FIRST';
}

interface GuestBookingResponse {
  orderId: number;
  guestName: string;
  email: string;
  phoneNumber: string;
  flight: {
    flightId: number;
    airline: {
      airlineId: number;
      name: string;
      code: string;
      country: string;
    };
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    status: string;
    economyPrice: number;
    businessPrice: number;
    firstClassPrice: number;
    availableSeats: number;
  };
  price: number;
  orderDate: string;
  seatClass: string;
  paypalOrderId: string;
  paymentUrl: string;
  paymentStatus: string;
}

export const useGuestBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookAsGuest = async (data: GuestBookingRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post<GuestBookingResponse>(
        `${import.meta.env.VITE_API_URL}/guest`,
        data
      );

      message.success('Flight booked successfully!');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Guest booking failed';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bookAsGuest,
    isLoading,
    error,
  };
}; 