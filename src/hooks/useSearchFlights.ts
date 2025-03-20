import { useState, useEffect } from 'react'
import axios from 'axios'

interface Flight {
  flightId: number
  airline: {
    name: string
    code: string
  }
  flightNumber: string
  departureAirport: string
  arrivalAirport: string
  departureTime: string
  arrivalTime: string
  status: string
  economyPrice: number
  businessPrice: number
  firstClassPrice: number
  availableSeats: number
}

export const useSearchFlights = () => {
  const [flights, setFlights] = useState<Flight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFlights = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get<Flight[]>(
        `${import.meta.env.VITE_API_URL}/flights`
      )
      if (!Array.isArray(response.data)) {
        const parsed = JSON.parse(response.data)
        return Array.isArray(parsed) ? parsed : []
      }
      setFlights(response.data)
    } catch (err) {
      setError('Failed to fetch flights')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFlights()
  }, [])

  return {
    flights,
    isLoading,
    error,
  }
}