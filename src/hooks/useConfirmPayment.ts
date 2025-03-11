import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

export const useConfirmPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmPayment = async (bookingId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('flightToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/confirm-payment`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success('Payment confirmed successfully');
        return true;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment confirmation failed';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    confirmPayment,
    isLoading,
    error,
  };
}; 