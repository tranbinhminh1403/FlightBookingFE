import { useSearchResults } from '../../context/SearchResultsContext';
import { ResultCard } from '../../components/resultCard';
import { Empty } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResult = () => {
  const { searchResults } = useSearchResults();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchResults.length === 0) {
      navigate('/');
    } else {
      console.log("Search results in result page:", searchResults);
    }
  }, [searchResults, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {searchResults.length > 0 ? (
          searchResults.map((flight) => (
            <ResultCard key={flight.flightId} flight={flight} />
          ))
        ) : (
          <Empty description="No flights found" />
        )}
      </div>
    </div>
  );
};

export default SearchResult;