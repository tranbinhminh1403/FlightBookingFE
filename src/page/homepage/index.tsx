import { Card, Button, DatePicker, Select, Form, Typography, Row, Col, Statistic, Tag, Input, message, Collapse } from "antd"
import {
  SearchOutlined,
  RocketOutlined,
  SafetyOutlined,
  DollarOutlined,
  CustomerServiceOutlined,
  ArrowRightOutlined,
  StarFilled,
  SwapOutlined
} from "@ant-design/icons"
import Header from "../../components/header"
import Footer from "../../components/footer"
import { useSearchFlights } from "../../hooks/useSearchFlights"
import dayjs from "dayjs"
import { useNavigate } from 'react-router-dom'
import { useSearchResults } from '../../context/SearchResultsContext'
import { code } from "../../code"

const { Title, Text } = Typography
const { RangePicker } = DatePicker

interface SearchFormValues {
  from: string;
  to: string;
  dates?: [dayjs.Dayjs, dayjs.Dayjs];
  airline?: string;
  status?: string;
}

const popularDestinations = [
  {
    city: "Paris",
    country: "France",
    price: 499,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
    tag: "Most Popular",
  },
  {
    city: "Tokyo",
    country: "Japan",
    price: 799,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2073&auto=format&fit=crop",
    tag: "Trending",
  },
  {
    city: "New York",
    country: "USA",
    price: 399,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop",
    tag: "Best Deal",
  },
  {
    city: "Dubai",
    country: "UAE",
    price: 599,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
    tag: "Luxury",
  },
]

const features = [
  {
    icon: <RocketOutlined className="text-4xl text-blue-500" />,
    title: "Fast Booking",
    description: "Book your flight in minutes with our streamlined process",
  },
  {
    icon: <SafetyOutlined className="text-4xl text-blue-500" />,
    title: "Secure Payments",
    description: "Your transactions are protected with industry-leading security",
  },
  {
    icon: <DollarOutlined className="text-4xl text-blue-500" />,
    title: "Best Prices",
    description: "We guarantee the best rates and offers on all flights",
  },
  {
    icon: <CustomerServiceOutlined className="text-4xl text-blue-500" />,
    title: "24/7 Support",
    description: "Our customer service team is always here to help you",
  },
]

export default function HomePage() {
  const [form] = Form.useForm()
  const { searchFlights, isLoading, error } = useSearchFlights()
  const navigate = useNavigate()
  const { setSearchResults } = useSearchResults()

  const onSearch = async (values: SearchFormValues) => {
    try {
      const searchParams = {
        departureAirport: values.from?.toUpperCase().slice(0, 3),
        arrivalAirport: values.to?.toUpperCase().slice(0, 3),
        dateRange: values.dates ? [
          values.dates[0].format('YYYY-MM-DD'),
          values.dates[1].format('YYYY-MM-DD')
        ] : null,
        selectedAirline: values.airline || ''
      };

      localStorage.setItem('searchParams', JSON.stringify(searchParams));
      navigate('/search');
      
    } catch (error) {
      message.error('Invalid search parameters');
      console.error("Search failed:", error);
    }
  }

  const handleSwap = () => {
    const from = form.getFieldValue('from');
    const to = form.getFieldValue('to');
    form.setFieldsValue({ from: to, to: from });
  };

  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <div
        className="relative min-h-[600px] flex items-center justify-center py-20 px-4"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 w-full max-w-6xl">
          <div className="text-center mb-8">
            <Title className="!text-white !mb-4">Find Your Perfect Flight</Title>
            {/* <Text className="text-lg text-gray-200">Discover amazing deals to destinations worldwide</Text> */}
          </div>
          {/* Search Form */}
          <Card className="mx-auto">
            <Form
              form={form}
              onFinish={onSearch}
              layout="vertical"
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <Form.Item 
                name="from" 
                label="From"
                rules={[{ required: false, message: "Please enter departure airport!" }]}
              >
                <Select
                  showSearch
                  placeholder="Enter departure airport (e.g., SGN)"
                  size="large"
                  style={{ textTransform: 'uppercase' }}
                  maxLength={3}
                  options={code}
                />
              </Form.Item>
{/* 
              <Button
                icon={<SwapOutlined />}
                onClick={handleSwap}
                style={{ alignSelf: 'center' }}
              /> */}

              <Form.Item 
                name="to" 
                label="To"
                rules={[{ required: false, message: "Please enter arrival airport!" }]}
              >
                <Select
                  showSearch
                  placeholder="Enter arrival airport (e.g., BKK)"
                  size="large"
                  style={{ textTransform: 'uppercase' }}
                  options={code}
                />
              </Form.Item>

              <Form.Item 
                name="dates" 
                label="Departure Dates" 
                className="md:col-span-2"
                rules={[{ required: false, message: "Please select dates!" }]}
              >
                <RangePicker 
                  size="large" 
                  className="w-full" 
                  format="YYYY-MM-DD"
                />
              </Form.Item>

              <Form.Item className="md:col-span-2 lg:col-span-4">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large" 
                  block 
                  icon={<SearchOutlined />}
                  loading={isLoading}
                >
                  Search Flights
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Row gutter={[32, 32]} justify="center">
            <Col xs={12} sm={6}>
              <Statistic title="Happy Customers" value={150000} suffix="+" />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic title="Destinations" value={500} suffix="+" />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic title="Flights Daily" value={1000} suffix="+" />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic title="Years Experience" value={15} suffix="+" />
            </Col>
          </Row>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Title level={2}>Popular Destinations</Title>
            <Title level={4}>Explore our most popular flight destinations</Title>
          </div>

          <Row gutter={[24, 24]}>
            {popularDestinations.map((destination, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  hoverable
                  cover={
                    <div className="relative h-48">
                      <img
                        alt={destination.city}
                        src={destination.image || "/placeholder.svg"}
                        className="w-full h-full object-cover"
                      />
                      {/* <Tag color="blue" className="absolute top-4 right-4">
                        {destination.tag}
                      </Tag> */}
                    </div>
                  }
                  className="h-full"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Title level={4} className="!mb-0">
                        {destination.city}
                      </Title>
                      <Text className="text-gray-500">{destination.country}</Text>
                    </div>
                    <div className="text-right">
                      <Text className="text-gray-500">from</Text>
                      <div className="text-lg font-semibold text-blue-600">${destination.price}</div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Title level={2}>Why Choose Us</Title>
            <Text className="text-gray-500">We make travel planning easy and worry-free</Text>
          </div>

          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="h-full text-center">
                  <div className="flex flex-col items-center gap-4">
                    {feature.icon}
                    <Title level={4} className="!mb-2">
                      {feature.title}
                    </Title>
                    <Text className="text-gray-500">{feature.description}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Title level={2}>Frequently Asked Questions</Title>
            <Text className="text-gray-500">Everything you need to know about booking with us</Text>
          </div>
          <Collapse className="bg-white">
            <Collapse.Panel header="What documents do I need for international flights?" key="1">
              For international flights, you typically need:
              <ul className="list-disc ml-6 mt-2">
                <li>A valid passport (with at least 6 months validity beyond your travel dates)</li>
                <li>Relevant visas for your destination and transit countries</li>
                <li>Travel insurance documents (recommended)</li>
                <li>Booking confirmation and e-tickets</li>
              </ul>
            </Collapse.Panel>

            <Collapse.Panel header="What is your cancellation and refund policy?" key="2">
              Our cancellation policy varies depending on the fare type:
              <ul className="list-disc ml-6 mt-2">
                <li>Flexible tickets can be cancelled up to 24 hours before departure with full refund</li>
                <li>Standard tickets can be cancelled with partial refund up to 72 hours before departure</li>
                <li>Special fare tickets are usually non-refundable</li>
                <li>All cancellations must be made through our website or customer service</li>
              </ul>
            </Collapse.Panel>

            <Collapse.Panel header="How much baggage can I bring?" key="3">
              Baggage allowance varies by airline and ticket class:
              <ul className="list-disc ml-6 mt-2">
                <li>Economy: Usually 1 carry-on (7kg) and 1 checked bag (20-23kg)</li>
                <li>Business: Usually 1 carry-on (10kg) and 2 checked bags (32kg each)</li>
                <li>First Class: Usually 2 carry-on and 3 checked bags</li>
                <li>Additional baggage can be purchased during booking or later</li>
              </ul>
            </Collapse.Panel>

            <Collapse.Panel header="How early should I arrive at the airport?" key="4">
              We recommend arriving at the airport:
              <ul className="list-disc ml-6 mt-2">
                <li>2-3 hours before international flights</li>
                <li>1-2 hours before domestic flights</li>
                <li>Additional time may be needed during peak travel seasons</li>
                <li>Check with your specific airline for their recommendations</li>
              </ul>
            </Collapse.Panel>

            <Collapse.Panel header="Can I choose my seat in advance?" key="5">
              Seat selection options depend on your ticket type:
              <ul className="list-disc ml-6 mt-2">
                <li>Most airlines offer free seat selection at check-in</li>
                <li>Advanced seat selection may require an additional fee</li>
                <li>Premium seats (exit rows, extra legroom) are available for purchase</li>
                <li>Some fare types include complimentary seat selection</li>
              </ul>
            </Collapse.Panel>

            <Collapse.Panel header="What payment methods do you accept?" key="6">
              We accept various payment methods including:
              <ul className="list-disc ml-6 mt-2">
                <li>Major credit and debit cards (Visa, MasterCard, American Express)</li>
                <li>Digital wallets (Apple Pay, Google Pay)</li>
                <li>Bank transfers</li>
                <li>Payment can be made in multiple currencies</li>
              </ul>
            </Collapse.Panel>
          </Collapse>
        </div>
      </div>

      {/* Special Offers */}
      {/* <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Title level={2}>Special Offers</Title>
            <Text className="text-gray-500">Grab these hot deals before they're gone</Text>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card className="h-full bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <StarFilled className="text-yellow-400" />
                    <Text className="text-white">Limited Time Offer</Text>
                  </div>
                  <Title level={3} className="!text-white !mb-2">
                    Summer Special: 20% Off
                  </Title>
                  <Text className="text-gray-100">
                    Book your summer vacation now and get 20% off on all international flights
                  </Text>
                  <Button type="primary" ghost className="self-start mt-4">
                    Book Now <ArrowRightOutlined />
                  </Button>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="h-full bg-gradient-to-r from-purple-500 to-purple-700 text-white">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <StarFilled className="text-yellow-400" />
                    <Text className="text-white">Member Exclusive</Text>
                  </div>
                  <Title level={3} className="!text-white !mb-2">
                    Double Miles Points
                  </Title>
                  <Text className="text-gray-100">Earn double miles points on all bookings made this month</Text>
                  <Button type="primary" ghost className="self-start mt-4">
                    Learn More <ArrowRightOutlined />
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div> */}
      <Footer />
    </div>
  )
}

