import { useState } from 'react';
import axios from 'axios';

interface GuestOrder {
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
  paymentStatus: string | null;
}

export const useGuestOrders = () => {
  const [guestOrders, setGuestOrders] = useState<GuestOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuestOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get<GuestOrder[]>(
        `${import.meta.env.VITE_API_URL}/guest`
      );

      setGuestOrders(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch guest orders';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    guestOrders,
    isLoading,
    error,
    fetchGuestOrders,
  };
}; 