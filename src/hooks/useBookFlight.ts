import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

interface BookingRequest {
  flightId: number;
  seatClass: 'ECONOMY' | 'BUSINESS' | 'FIRST';
}

interface BookingResponse {
  bookingId: number;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  bookingDate: string;
  status: string;
  totalPrice: number;
  paymentStatus: string;
  updatedPoints: number;
  paymentUrl: string;
}

export const useBookFlight = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookFlight = async (data: BookingRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('flightToken');
      if (!token) {
        throw new Error('Please login to book flights');
      }

      const response = await axios.post<BookingResponse>(
        `${import.meta.env.VITE_API_URL}/bookings`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success('Flight booked successfully!');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Booking failed';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bookFlight,
    isLoading,
    error,
  };
}; 