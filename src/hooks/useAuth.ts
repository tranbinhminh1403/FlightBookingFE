import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  role: string;
  username: string;
  email: string;
}

interface JwtPayload {
  role: string;
  sub: string;
  exp: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('flightToken');
      if (!token) {
        setUser(null);
        return false;
      }

      // Decode JWT token to get role
      const decoded = jwtDecode<JwtPayload>(token);
      const isAdmin = decoded.role === 'ADMIN';

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
      return isAdmin;
    } catch (error) {
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = () => {
    const token = localStorage.getItem('flightToken');
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.role === 'ADMIN';
    } catch {
      return false;
    }
  };

  return {
    user,
    isLoading,
    checkAuth,
    isAdmin: isAdmin(),
  };
}; 