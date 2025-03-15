import React from 'react'
import { Layout, Button, Space, Dropdown } from 'antd'
import { UserOutlined, LogoutOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom' // Assuming you're using React Router for navigation
import { useAuth } from '../../hooks/useAuth'

const { Header } = Layout

const HeaderComponent: React.FC = () => {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const isAuthenticated = !!localStorage.getItem('flightToken')

  const handleLogout = () => {
    localStorage.removeItem('flightToken')
    localStorage.removeItem('userPoints')
    navigate('/auth')
  }

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    ...(isAdmin ? [{
      key: 'admin',
      label: 'Admin Dashboard',
      icon: <SettingOutlined />,
      onClick: () => navigate('/admin'),
    }] : []),
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  return (
    <Header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 mr-8">
            SkyBooking
          </Link>
          <Link 
            to="/search" 
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <SearchOutlined className="mr-1" />
            <span>Search Flights</span>
          </Link>
        </div>

        <Space>
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button icon={<UserOutlined />}>My Account</Button>
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate('/auth')}>
              Login
            </Button>
          )}
        </Space>
      </div>
    </Header>
  )
}

export default HeaderComponent
