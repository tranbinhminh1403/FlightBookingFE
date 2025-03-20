import type React from "react"
import { useState } from "react"
import { Card, Typography, Tag, Button, Tabs, Divider, Modal, Select, Form, Input } from "antd"
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  RightOutlined,
  CalendarOutlined,
  UserOutlined,
  // SendOutlined,
  DollarOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { useBookFlight } from '../../hooks/useBookFlight'
import { useConfirmPayment } from '../../hooks/useConfirmPayment'
import { useNavigate } from 'react-router-dom'
import VietnamAirlines from '../../assets/VN.png';
import VietjetAir from '../../assets/VJ.png';
import BambooAirways from '../../assets/QH.png';
import VietravelAirlines from '../../assets/VU.png';
import { useGuestBooking } from '../../hooks/useGuestBooking';
import { message } from 'antd';

dayjs.extend(duration)

const { Text, Title } = Typography
const { TabPane } = Tabs
const { Option } = Select

interface Flight {
  flightId: number
  flightNumber: string
  airline: {
    name: string;
    code: string;
  }
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

interface ResultCardProps {
  flight: Flight
}

export const ResultCard: React.FC<ResultCardProps> = ({ flight }) => {
  const [selectedFare, setSelectedFare] = useState<string>("economy")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [seatClass, setSeatClass] = useState('ECONOMY')
  const [bookingData, setBookingData] = useState(null)
  const { bookFlight, isLoading: isBooking } = useBookFlight()
  const { confirmPayment, isLoading: isConfirming } = useConfirmPayment()
  const navigate = useNavigate()
  // const [isGuestBooking, setIsGuestBooking] = useState(false)
  const { bookAsGuest, isLoading: isGuestBookingLoading } = useGuestBooking()
  const [guestForm] = Form.useForm()

  // Format times and dates
  const departureDate = dayjs(flight.departureTime)
  const arrivalDate = dayjs(flight.arrivalTime)
  const departureTime = departureDate.format("HH:mm")
  const arrivalTime = arrivalDate.format("HH:mm")
  const departureDay = departureDate.format("ddd, MMM D")
  const arrivalDay = arrivalDate.format("ddd, MMM D")

  // Calculate flight duration
  const durationMinutes = arrivalDate.diff(departureDate, "minute")
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  const durationText = `${hours}h ${minutes}m`

  // Status color
  const statusColor = flight.status.toLowerCase() === "on-time" ? "success" : "error"

  const calculateDiscount = () => {
    const points = Number(localStorage.getItem('userPoints'));
    if (points >= 30000) return 0.30;
    if (points >= 20000) return 0.20;
    if (points >= 10000) return 0.15;
    if (points > 0) return 0.10;
    return 0;
  };

  const getDiscountedPrice = (originalPrice: number) => {
    const discount = calculateDiscount();
    return originalPrice * (1 - discount);
  };

  const renderSelectPrice = (price: number) => {
    const discount = calculateDiscount();
    if (discount > 0) {
      const discountedPrice = getDiscountedPrice(price);
      return (
        <span>
          <Text delete className="text-gray-400 mr-2">${price.toFixed(2)}</Text>
          <Text className="text-green-600">${discountedPrice.toFixed(2)}</Text>
          <Text type="success" className="text-xs ml-2">(-{(discount * 100)}%)</Text>
        </span>
      );
    }
    return <span>${price.toFixed(2)}</span>;
  };

  const renderPrice = (price: number) => {
    const discount = calculateDiscount();
    if (discount > 0) {
      const discountedPrice = getDiscountedPrice(price);
      return (
        <div className="text-center">
          <Text delete className="text-gray-400">${price.toFixed(2)}</Text>
          <Title level={3} className="!m-0 text-green-600">
            ${discountedPrice.toFixed(2)}
          </Title>
          <Text type="success" className="text-xs">
            {(discount * 100)}% off with points
          </Text>
        </div>
      );
    }
    return (
      <Title level={3} className="!m-0 text-center">
        ${price.toFixed(2)}
      </Title>
    );
  };

  const handleBook = async () => {
    try {
      const response = await bookFlight({
        flightId: flight.flightId,
        seatClass: seatClass,
        discountedPrice: getDiscountedPrice(
          seatClass === 'ECONOMY' ? flight.economyPrice :
          seatClass === 'BUSINESS' ? flight.businessPrice :
          flight.firstClassPrice
        )
      });
      
      // Store updated points
      if (response.updatedPoints) {
        localStorage.setItem('userPoints', response.updatedPoints.toString());
      }
      
      // Navigate to PayPal if URL is provided
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        setBookingData(response);
      }
    } catch (error) {
      if (error.message.includes('login')) {
        navigate('/auth');
      }
    }
  };

  const handlePayment = async () => {
    try {
      await confirmPayment(bookingData.bookingId)
      setIsModalOpen(false)
      navigate('/profile')
    } catch (error) {
      console.error('Payment failed:', error)
    }
  }

  const handleGuestBook = async () => {
    try {
      const values = await guestForm.validateFields()
      const response = await bookAsGuest({
        ...values,
        flightId: flight.flightId,
        seatClass: seatClass,
        discountedPrice: getDiscountedPrice(
          seatClass === 'ECONOMY' ? flight.economyPrice :
          seatClass === 'BUSINESS' ? flight.businessPrice :
          flight.firstClassPrice
        )
      })
      setBookingData(response as any)
      message.success('Guest booking successful!')
      setIsModalOpen(false)
    } catch (error) {
      console.error('Guest booking failed:', error)
    }
  }

  const renderModalContent = () => {
    const token = localStorage.getItem('flightToken')
    
    if (!token) {
      return (
        <>
          <Form form={guestForm} layout="vertical">
            <Form.Item
              name="guestName"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="seatClass"
              label="Select Seat Class"
            >
              <Select
                value={seatClass}
                onChange={setSeatClass}
                className="w-full"
              >
                <Option value="ECONOMY">
                  Economy - {renderSelectPrice(flight.economyPrice)}
                </Option>
                <Option value="BUSINESS">
                  Business - {renderSelectPrice(flight.businessPrice)}
                </Option>
                <Option value="FIRST_CLASS">
                  First Class - {renderSelectPrice(flight.firstClassPrice)}
                </Option>
              </Select>
            </Form.Item>
          </Form>
          <Button 
            type="primary" 
            onClick={handleGuestBook} 
            loading={isGuestBookingLoading}
            block
            size="large"
          >
            Book as Guest
          </Button>
        </>
      )
    }

    if (!bookingData) {
      return (
        <>
          <Title level={4}>Book Flight {flight.flightNumber}</Title>
          <div className="my-4 space-y-4">
            {/* Flight Details Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text type="secondary">Departure</Text>
                  <div className="font-semibold">{departureTime}</div>
                  <div className="text-sm">{departureDay}</div>
                  <div className="text-sm text-gray-500">{flight.departureAirport}</div>
                </div>
                <div>
                  <Text type="secondary">Arrival</Text>
                  <div className="font-semibold">{arrivalTime}</div>
                  <div className="text-sm">{arrivalDay}</div>
                  <div className="text-sm text-gray-500">{flight.arrivalAirport}</div>
                </div>
              </div>
              <Divider className="my-3" />
              <div className="flex justify-between items-center">
                <div>
                  <Text type="secondary">Duration</Text>
                  <div>{durationText}</div>
                </div>
                <div>
                  <Text type="secondary">Airline</Text>
                  <div>{flight.airlineName}</div>
                </div>
              </div>
            </div>

            {/* Seat Class Selection */}
            <div>
              <Text strong>Select Seat Class:</Text>
              <Select
                value={seatClass}
                onChange={setSeatClass}
                className="w-full"
              >
                <Option value="ECONOMY">
                  Economy - {renderSelectPrice(flight.economyPrice)}
                </Option>
                <Option value="BUSINESS">
                  Business - {renderSelectPrice(flight.businessPrice)}
                </Option>
                <Option value="FIRST_CLASS">
                  First Class - {renderSelectPrice(flight.firstClassPrice)}
                </Option>
              </Select>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <Text strong className="text-blue-700">Important Notes:</Text>
              <ul className="mt-2 space-y-2 text-sm text-blue-600">
                <li>• Free cancellation within 24 hours of booking</li>
                <li>• Baggage allowance varies by seat class</li>
                <li>• Check-in closes 45 minutes before departure</li>
                <li>• Please ensure your travel documents are valid</li>
              </ul>
            </div>
          </div>
          <Button 
            type="primary" 
            onClick={handleBook} 
            loading={isBooking}
            block
            size="large"
          >
            Confirm Booking
          </Button>
        </>
      );
    }

    return (
      <>
        <Title level={4}>Confirm Payment</Title>
        <div className="my-4 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div>
              <Text type="secondary">Booking ID:</Text>
              <div className="font-semibold">{bookingData.bookingId}</div>
            </div>
            <div>
              <Text type="secondary">Flight:</Text>
              <div className="font-semibold">{bookingData.flightNumber}</div>
            </div>
            <div>
              <Text type="secondary">Route:</Text>
              <div className="font-semibold">
                {bookingData.departureAirport} → {bookingData.arrivalAirport}
              </div>
            </div>
            <div>
              <Text type="secondary">Total Price:</Text>
              <div className="text-lg font-bold text-blue-600">
                ${bookingData.totalPrice.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Payment Notes */}
          <div className="bg-green-50 p-4 rounded-lg">
            <Text strong className="text-green-700">Payment Information:</Text>
            <ul className="mt-2 space-y-2 text-sm text-green-600">
              <li>• Secure payment processing</li>
              <li>• Immediate booking confirmation</li>
              <li>• Receipt will be sent to your email</li>
            </ul>
          </div>
        </div>
        <Button 
          type="primary" 
          onClick={handlePayment} 
          loading={isConfirming}
          icon={<DollarOutlined />}
          block
          size="large"
        >
          Confirm Payment
        </Button>
      </>
    );
  }

  return (
    <>
      <Card className="w-full mb-4 hover:shadow-lg transition-all duration-300" bodyStyle={{ padding: 0 }}>
        {/* Airline header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center overflow-hidden">
              <img
                src={
                  flight.airline.name === 'Vietnam Airlines' ? VietnamAirlines :
                  flight.airline.name === 'Vietjet Air' ? VietjetAir :
                  flight.airline.name === 'Bamboo Airways' ? BambooAirways :
                  flight.airline.name === 'Vietravel Airlines' ? VietravelAirlines :
                  VietnamAirlines // default fallback
                }
                alt={flight.airline.name}
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <Title level={5} className="!m-0">
                {flight.airlineName}
              </Title>
              <Text type="secondary" className="text-xs">
                {flight.flightNumber}
              </Text>
            </div>
          </div>
          <Tag color={statusColor} className="capitalize">
            {flight.status}
          </Tag>
        </div>

        {/* Flight details */}
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            {/* Time and location */}
            <div className="flex flex-1 items-center gap-4">
              {/* Departure */}
              <div className="text-center md:text-left">
                <Title level={3} className="!m-0">
                  {departureTime}
                </Title>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <EnvironmentOutlined className="text-xs" />
                  <Text type="secondary">{flight.departureAirport}</Text>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <CalendarOutlined className="text-xs" />
                  <Text type="secondary">{departureDay}</Text>
                </div>
              </div>

              {/* Flight path */}
              <div className="flex-1 flex flex-col items-center px-2">
                <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                  <ClockCircleOutlined className="text-xs" />
                  <Text type="secondary">{durationText}</Text>
                </div>
                <div className="relative w-full flex items-center">
                  <div className="h-[2px] bg-gray-200 w-full"></div>
                  <RightOutlined className="absolute right-0 text-xs text-gray-400" />
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <UserOutlined className="text-xs" />
                  <Text type="secondary">{flight.availableSeats} seats available</Text>
                </div>
              </div>

              {/* Arrival */}
              <div className="text-center md:text-right">
                <Title level={3} className="!m-0">
                  {arrivalTime}
                </Title>
                <div className="flex items-center justify-end gap-1 text-sm text-gray-500">
                  <EnvironmentOutlined className="text-xs" />
                  <Text type="secondary">{flight.arrivalAirport}</Text>
                </div>
                <div className="flex items-center justify-end gap-1 text-xs text-gray-500 mt-1">
                  <CalendarOutlined className="text-xs" />
                  <Text type="secondary">{arrivalDay}</Text>
                </div>
              </div>
            </div>

            {/* Divider for mobile */}
            <div className="md:hidden">
              <Divider className="my-3" />
            </div>

            {/* Pricing */}
            <div className="hidden md:block">
              <Divider type="vertical" className="h-full" />
            </div>

            <div className="md:pl-4 flex flex-col">
              <Tabs defaultActiveKey="economy" onChange={setSelectedFare} className="w-full" size="small">
                <TabPane tab="Economy" key="economy">
                  {renderPrice(flight.economyPrice)}
                </TabPane>
                <TabPane tab="Business" key="business">
                  {renderPrice(flight.businessPrice)}
                </TabPane>
                <TabPane tab="First" key="first">
                  {renderPrice(flight.firstClassPrice)}
                </TabPane>
              </Tabs>
              <Button 
                type="primary"
                onClick={() => setIsModalOpen(true)}
              >
                Select Flight
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setBookingData(null)
        }}
        footer={null}
      >
        {renderModalContent()}
      </Modal>
    </>
  )
}

