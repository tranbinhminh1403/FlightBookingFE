import { createContext, useContext, useState } from 'react';

interface Flight {
  flightId: number;
  flightNumber: string;
  airlineName: string;
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

interface SearchResultsContextType {
  searchResults: Flight[];
  setSearchResults: (results: Flight[]) => void;
}

const SearchResultsContext = createContext<SearchResultsContextType | undefined>(undefined);

export const SearchResultsProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchResults, setSearchResults] = useState<Flight[]>([]);

  return (
    <SearchResultsContext.Provider value={{ searchResults, setSearchResults }}>
      {children}
    </SearchResultsContext.Provider>
  );
};

export const useSearchResults = () => {
  const context = useContext(SearchResultsContext);
  if (!context) {
    throw new Error('useSearchResults must be used within a SearchResultsProvider');
  }
  return context;
}; 