import { Card, Form, Input, DatePicker, Select, Button, Typography, Space, Divider, Empty } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSearchFlights } from '../../hooks/useSearchFlights';
import { useSearchResults } from '../../context/SearchResultsContext';
import { ResultCard } from '../../components/resultCard';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { code } from '../../code';

const { Title } = Typography;
const { Text } = Typography;

interface SearchFormValues {
  from: string;
  to: string;
  dates?: [dayjs.Dayjs, dayjs.Dayjs];
  airlineName?: string;
  status?: string;
}

const SearchPage = () => {
  const [form] = Form.useForm();
  const { searchFlights, isLoading } = useSearchFlights();
  const { searchResults, setSearchResults } = useSearchResults();
  const location = useLocation();

  // Handle initial search if navigated from homepage
  useEffect(() => {
    const searchParams = location.state?.searchParams;
    if (searchParams) {
      form.setFieldsValue({
        from: searchParams.departureAirport,
        to: searchParams.arrivalAirport,
        dates: [
          dayjs(searchParams.departureTimeStart),
          dayjs(searchParams.departureTimeEnd)
        ]
      });
      handleSearch(searchParams);
    }
  }, []);

  const handleSearch = async (values: any) => {
    try {
      const params = {
        departureAirport: values.from ? values.from.toUpperCase().slice(0, 3) : null,
        arrivalAirport: values.to ? values.to.toUpperCase().slice(0, 3) : null,
        airlineName: values.airlineName || null,
        departureTimeStart: values.dates?.[0]?.format("YYYY-MM-DDTHH:mm:ss") || null,
        departureTimeEnd: values.dates?.[0]?.format("YYYY-MM-DDT23:59:59") || null,
      };

      // Remove null values from params before making the request
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== null)
      );

      const results = await searchFlights(cleanParams);
      setSearchResults(results);
      console.log("Search params:", cleanParams);
      console.log("Search results:", results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
          <Title level={2} className="!text-blue-800 !mb-2">
            Find Your Perfect Flight
          </Title>
          <Text className="text-gray-600">Search across multiple airlines and find the best deals</Text>
        </div>

        <Card className="mb-8 shadow-lg rounded-xl overflow-hidden border-0">
          <Form
            form={form}
            onFinish={handleSearch}
            layout="vertical"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Form.Item name="from" label="From">
                <Select showSearch options={code} placeholder="Departure Airport (e.g., SGN)" />
              </Form.Item>

              <Form.Item name="to" label="To">
                <Select showSearch options={code} placeholder="Arrival Airport (e.g., BKK)" />
              </Form.Item>

              <Form.Item name="dates" label="Travel Dates">
                <DatePicker.RangePicker className="w-full" />
              </Form.Item>

              <Form.Item name="airlineName" label="Airline">
                <Select
                    // mode="multiple"
                    allowClear
                  placeholder="Select Airline"
                  options={[
                    { value: 'Vietnam Airlines', label: 'Vietnam Airlines' },
                    { value: 'Vietjet Air', label: 'Vietjet Air' },
                    { value: 'Bamboo Airways', label: 'Bamboo Airways' },
                    { value: 'Vietravel Airlines', label: 'Vietravel Airlines' },
                  ]}
                />
              </Form.Item>
            </div>

            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SearchOutlined />} 
              loading={isLoading}
            >
              Search Flights
            </Button>
          </Form>
        </Card>

        <div className="space-y-4">
          {searchResults.length > 0 ? (
            <>
              <div className="mb-6">
                <Title level={4} className="!text-gray-700 !mb-4">
                  {searchResults.length} {searchResults.length === 1 ? "Flight" : "Flights"} Found
                </Title>
                <Divider className="my-4" />
              </div>
              {searchResults.map((flight) => (
                <ResultCard key={flight.flightId} flight={flight} />
              ))}
            </>
          ) : (
            <Card className="text-center py-12">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="space-y-2">
                    <Text className="text-gray-500 text-lg">No flights found</Text>
                    <div className="text-gray-400">
                      Try adjusting your search criteria:
                      <ul className="list-disc list-inside mt-2">
                        <li>Check different dates</li>
                        <li>Try different airports</li>
                        <li>Remove airline filter</li>
                      </ul>
                    </div>
                  </div>
                }
              >
                <Button type="primary" onClick={() => form.resetFields()}>
                  Reset Search
                </Button>
              </Empty>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;