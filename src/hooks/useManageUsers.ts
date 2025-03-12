import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

interface UpdateUserData {
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  initialAirport: string | null;
  status: string;
}

export const useManageUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (userId: number, data: UpdateUserData) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('flightToken');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success('User updated successfully');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      message.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('flightToken');
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('User deactivated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deactivate user';
      message.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUser,
    deleteUser,
    isLoading,
    error,
  };
}; 