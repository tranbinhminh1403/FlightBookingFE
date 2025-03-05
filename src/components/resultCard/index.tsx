"use client"

import type React from "react"
import { useState } from "react"
import { Card, Typography, Tag, Button, Tabs, Divider } from "antd"
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  RightOutlined,
  CalendarOutlined,
  UserOutlined,
  SendOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"

dayjs.extend(duration)

const { Text, Title } = Typography
const { TabPane } = Tabs

interface Flight {
  flightId: number
  flightNumber: string
  airlineName: string
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
  onSelect?: (flight: Flight, fareType: string) => void
}

export const ResultCard: React.FC<ResultCardProps> = ({ flight, onSelect = () => {} }) => {
  const [selectedFare, setSelectedFare] = useState<string>("economy")

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

  // Get price based on selected fare
//   const getPriceByFare = () => {
//     switch (selectedFare) {
//       case "economy":
//         return flight.economyPrice
//       case "business":
//         return flight.businessPrice
//       case "first":
//         return flight.firstClassPrice
//       default:
//         return flight.economyPrice
//     }
//   }

  // Status color
  const statusColor = flight.status.toLowerCase() === "on-time" ? "success" : "error"

  return (
    <Card className="w-full mb-4 hover:shadow-lg transition-all duration-300" bodyStyle={{ padding: 0 }}>
      {/* Airline header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <SendOutlined className="text-blue-500" />
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
                <Title level={3} className="!m-0 text-center">
                  ${flight.economyPrice.toFixed(2)}
                </Title>
              </TabPane>
              <TabPane tab="Business" key="business">
                <Title level={3} className="!m-0 text-center">
                  ${flight.businessPrice.toFixed(2)}
                </Title>
              </TabPane>
              <TabPane tab="First" key="first">
                <Title level={3} className="!m-0 text-center">
                  ${flight.firstClassPrice.toFixed(2)}
                </Title>
              </TabPane>
            </Tabs>
            <Button type="primary" className="mt-4 w-full" onClick={() => onSelect(flight, selectedFare)}>
              Select
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

