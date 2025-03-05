import { useState } from 'react'
import axios from 'axios'

interface FlightSearchParams {
  departureAirport?: string
  arrivalAirport?: string
  airlineName?: string
  departureTimeStart?: string
  departureTimeEnd?: string
}

interface Flight {
  id: string
  departureAirport: string
  arrivalAirport: string
  status: string
  airlineName: string
  departureTime: string
  arrivalTime: string
  // Add other flight properties as needed
}

export const useSearchFlights = () => {
  const [flights, setFlights] = useState<Flight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchFlights = async (params: FlightSearchParams) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await axios.get<Flight[]>(
        `${import.meta.env.VITE_API_URL}/flights/tickets/search`,
        { params }
      )

      setFlights(response.data)
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search flights'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    flights,
    isLoading,
    error,
    searchFlights,
  }
}