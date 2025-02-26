import { useState } from 'react';
import axios from 'axios';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  message?: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post<LoginResponse>(
        `${import.meta.env.VITE_API_URL}/authenticate`,
        credentials
      );

      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};
