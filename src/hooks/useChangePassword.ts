import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async (data: ChangePasswordData) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('flightToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/profile/password`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success('Password changed successfully');
        return true;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changePassword,
    isLoading,
    error,
  };
}; 