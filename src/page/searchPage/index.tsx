import {
  Card,
  Input,
  DatePicker,
  Select,
  Typography,
  Space,
  Empty,
  Pagination,
  Button,
} from "antd";
import { useSearchFlights } from "../../hooks/useSearchFlights";
import { ResultCard } from "../../components/resultCard";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { code } from "../../code";

const { Title } = Typography;
const { Text } = Typography;

// interface SearchFormValues {
//   from: string;
//   to: string;
//   dates?: [dayjs.Dayjs, dayjs.Dayjs];
//   airlineName?: string;
//   status?: string;
// }

const SearchPage = () => {
  const { flights, isLoading } = useSearchFlights();
  const [searchText, setSearchText] = useState("");
  const [departureAirport, setDepartureAirport] = useState<string>("");
  const [arrivalAirport, setArrivalAirport] = useState<string>("");
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);
  const [selectedAirline, setSelectedAirline] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 30;

  useEffect(() => {
    const savedParams = localStorage.getItem('searchParams');
    if (savedParams) {
      const params = JSON.parse(savedParams);
      setDepartureAirport(params.departureAirport || '');
      setArrivalAirport(params.arrivalAirport || '');
      if (params.dateRange) {
        setDateRange([
          dayjs(params.dateRange[0]),
          dayjs(params.dateRange[1])
        ]);
      }
      setSelectedAirline(params.selectedAirline || '');
      
      // Clear the stored params after using them
      localStorage.removeItem('searchParams');
    }
  }, []);

  const filteredFlights = flights?.filter((flight) => {
    const matchesSearch =
      flight.flightNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      flight.airline.name.toLowerCase().includes(searchText.toLowerCase());

    const matchesDeparture =
      !departureAirport || flight.departureAirport === departureAirport;
    const matchesArrival =
      !arrivalAirport || flight.arrivalAirport === arrivalAirport;
    const matchesAirline =
      !selectedAirline || flight.airline.name === selectedAirline;

    const flightDepartureDate = dayjs(flight.departureTime);
    const matchesDateRange =
      !dateRange ||
      !dateRange[0] ||
      !dateRange[1] ||
      (flightDepartureDate.isAfter(dateRange[0].startOf("day")) &&
        flightDepartureDate.isBefore(dateRange[1].endOf("day")));

    return (
      matchesSearch &&
      matchesDeparture &&
      matchesArrival &&
      matchesAirline &&
      matchesDateRange
    );
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedFlights = filteredFlights?.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <Title level={2} className="!text-blue-800 !mb-2">
            Find Your Perfect Flight
          </Title>
          <Text className="text-gray-600">
            Search across multiple airlines and find the best deals
          </Text>
        </div>
        <Card className="mb-8 shadow-lg rounded-xl overflow-hidden border-0">
          <Space wrap className="w-full justify-between">
            <Space wrap>
              {/* <Input.Search
                placeholder="Search flights..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
              /> */}
              <Select
                showSearch
                allowClear
                placeholder="Departure Airport"
                style={{ width: 150 }}
                onChange={setDepartureAirport}
                value={departureAirport || undefined}
                options={code}
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
              <Select
                showSearch
                allowClear
                placeholder="Arrival Airport"
                style={{ width: 150 }}
                onChange={setArrivalAirport}
                value={arrivalAirport || undefined}
                options={code}
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
              <DatePicker.RangePicker
                style={{ width: 280 }}
                onChange={(dates) =>
                  setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])
                }
                value={dateRange}
              />
              <Select
                allowClear
                placeholder="Select Airline"
                style={{ width: 200 }}
                onChange={setSelectedAirline}
                value={selectedAirline || undefined}
                options={[
                  { value: "Vietnam Airlines", label: "Vietnam Airlines" },
                  { value: "Vietjet Air", label: "Vietjet Air" },
                  { value: "Bamboo Airways", label: "Bamboo Airways" },
                  { value: "Vietravel Airlines", label: "Vietravel Airlines" },
                ]}
              />
            </Space>
            <Button 
              onClick={() => {
                setDepartureAirport('');
                setArrivalAirport('');
                setDateRange([null, null]);
                setSelectedAirline('');
                setSearchText('');
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          </Space>
        </Card>

        <div className="mt-4 mb-4 flex justify-between items-center">
          <Text>
            Found <span className="font-semibold">{filteredFlights?.length || 0}</span> flights
          </Text>
          {!isLoading && flights?.length > 0 && (
            <Text className="text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredFlights?.length || 0)} of {filteredFlights?.length} flights
            </Text>
          )}
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : filteredFlights?.length > 0 ? (
            <>
              {paginatedFlights.map((flight) => (
                <ResultCard key={flight.flightId} flight={flight} />
              ))}
              <div className="mt-6 flex justify-center">
                <Pagination
                  current={currentPage}
                  total={filteredFlights.length}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <Empty description="No flights found" />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
