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

interface UserProfile {
  userId: number;
  username: string;
  email: string;
  phoneNumber: string;
  initialAirport: string;
  bookings: Booking[];
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('flightToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get<UserProfile>(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
  };
}; 