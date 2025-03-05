import React from 'react'
import { Layout, Row, Col, Typography, Space } from 'antd'
import { Link } from 'react-router-dom'
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  LinkedinOutlined,
  UserOutlined
} from '@ant-design/icons'

const { Footer } = Layout
const { Title, Text } = Typography

const FooterComponent: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Footer className="bg-gray-100 pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <div className="flex items-center mb-4">
              <UserOutlined className="text-2xl text-blue-500 mr-2" />
              <Title level={4} className="!mb-0">SkyBooker</Title>
            </div>
            <Text className="text-gray-600">
              Your trusted partner for hassle-free flight bookings and amazing travel deals.
            </Text>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5}>Quick Links</Title>
            <ul className="list-none p-0">
              <li><Link to="/about" className="text-gray-600 hover:text-blue-500">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-500">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-blue-500">FAQ</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-blue-500">Terms of Service</Link></li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5}>Support</Title>
            <ul className="list-none p-0">
              <li><Link to="/help" className="text-gray-600 hover:text-blue-500">Help Center</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-blue-500">Privacy Policy</Link></li>
              <li><Link to="/booking" className="text-gray-600 hover:text-blue-500">Booking Guide</Link></li>
              <li><Link to="/feedback" className="text-gray-600 hover:text-blue-500">Feedback</Link></li>
            </ul>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5}>Connect With Us</Title>
            <Space size="large" className="mb-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">
                <FacebookOutlined className="text-2xl" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">
                <TwitterOutlined className="text-2xl" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">
                <InstagramOutlined className="text-2xl" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">
                <LinkedinOutlined className="text-2xl" />
              </a>
            </Space>
            <Text className="text-gray-600 block">
              Email: support@skybooker.com
            </Text>
            <Text className="text-gray-600">
              Phone: +1 (555) 123-4567
            </Text>
          </Col>
        </Row>
        <div className="mt-8 pt-8 border-t border-gray-300 text-center">
          <Text className="text-gray-600">
            © {currentYear} SkyBooker. All rights reserved.
          </Text>
        </div>
      </div>
    </Footer>
  )
}

export default FooterComponent
