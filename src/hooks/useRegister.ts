import { useState } from 'react';
import axios from 'axios';

interface RegisterCredentials {
  username: string;
  passwordHash: string;
  email: string;
  phoneNumber: string;
  role: 'USER' | 'ADMIN'; // Using union type to restrict role values
}

interface RegisterResponse {
  message?: string;
  user?: {
    username: string;
    email: string;
    // Add other fields that your API returns
  };
}

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post<RegisterResponse>(
        `${import.meta.env.VITE_API_URL}/register`,
        credentials
      );

      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
};
