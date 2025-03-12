import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

interface UpdateFlightData {
  flightId: number;
  airline: {
    airlineId: number;
    name: string;
    code: string;
    country: string;
  };
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  economyPrice: number;
  businessPrice: number;
  firstClassPrice: number;
  availableSeats: number;
}

export const useManageFlights = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFlight = async (flightId: number, data: UpdateFlightData) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('flightToken');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/flights/${flightId}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success('Flight updated successfully');
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update flight';
      message.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateFlight,
    isLoading,
    error,
  };
}; 