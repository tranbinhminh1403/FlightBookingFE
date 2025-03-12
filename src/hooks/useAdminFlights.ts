import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

interface Airline {
  airlineId: number;
  name: string;
  code: string;
  country: string;
}

interface Flight {
  flightId: number;
  airline: Airline;
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

export const useAdminFlights = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFlights = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('flightToken');
      const response = await axios.get<Flight[]>(
        `${import.meta.env.VITE_API_URL}/flights`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFlights(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch flights';
      message.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    flights,
    isLoading,
    error,
    fetchFlights,
  };
}; 