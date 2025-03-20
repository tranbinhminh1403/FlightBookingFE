import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

export const usePaypalConfirm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmPaypal = async (token: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const flightToken = localStorage.getItem('flightToken');
      const endpoint = flightToken ? '/paypal/confirm' : '/paypal/guest-confirm';

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        { token }
      );

      if (response.data.message === "Payment confirmed successfully") {
        setIsConfirmed(true);
        message.success('Payment confirmed successfully');
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
    confirmPaypal,
    isLoading,
    isConfirmed,
    error,
  };
}; 