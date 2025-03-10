import { useState } from 'react';
import axios from 'axios';

interface UpdateProfileData {
  email?: string;
  phoneNumber?: string;
  initialAirport?: string;
}

export const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('flightToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading,
    error,
  };
}; 