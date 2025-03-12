import { useState } from 'react';
import axios from 'axios';

interface Booking {
  bookingId: number;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  bookingDate: string;
  status: string;
  totalPrice: number;
  paymentStatus: string;
}

interface User {
  userId: number;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  initialAirport: string | null;
  bookings: Booking[];
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('flightToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get<User[]>(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    error,
    fetchUsers,
  };
}; 