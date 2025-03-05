import React from 'react'
import { Layout, Button, Space, Dropdown } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom' // Assuming you're using React Router for navigation

const { Header } = Layout

const HeaderComponent: React.FC = () => {
  const navigate = useNavigate()
  const isAuthenticated = !!localStorage.getItem('flightToken')

  const handleLogout = () => {
    localStorage.removeItem('flightToken')
    navigate('/auth')
  }

  const userMenuItems = [
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
  ]

  return (
    <Header className="bg-white shadow-md flex items-center justify-between px-4 h-16">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <UserOutlined className="text-2xl text-blue-500 mr-2" />
          <span className="text-xl font-bold text-blue-800">SkyBooker</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="md:flex items-center">
        <Space className="ml-4">
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button icon={<UserOutlined />}>My Account</Button>
            </Dropdown>
          ) : (
            <Button type="primary" icon={<UserOutlined />} onClick={() => navigate('/auth')}>
              Login
            </Button>
          )}
        </Space>
      </div>

      {/* Mobile Menu Button */}
      {/* <div className="md:hidden">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuVisible(true)}
        />
      </div> */}

      {/* Mobile Menu Drawer */}

    </Header>
  )
}

export default HeaderComponent
