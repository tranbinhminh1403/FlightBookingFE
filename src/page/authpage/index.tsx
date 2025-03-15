// import { useState } from "react"
import { Tabs, Form, Input, Button, Card, Typography, message } from "antd"
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons"
import type { TabsProps } from "antd"
import { useLogin } from "../../hooks/useLogin"
import { useRegister } from "../../hooks/useRegister"
import { useNavigate } from 'react-router-dom'
import { useState } from "react"

const { Title, Text } = Typography

export default function AuthPage() {
  const [loginForm] = Form.useForm()
  const [registerForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState<string>("login")
  
  const { login, isLoading: isLoginLoading, error: loginError } = useLogin()
  const { register, isLoading: isRegisterLoading, error: registerError } = useRegister()
  const navigate = useNavigate()

  const onLogin = async (values: any) => {
    try {
      const response = await login({
        username: values.username,
        password: values.password,
      })
      
      // Store token in localStorage
      if (response?.token) {
        localStorage.setItem('flightToken', response.token)
        localStorage.setItem('userPoints', response.points.toString())
        message.success("Login successful!")
        navigate('/') // Redirect to home page
      }
    } catch (error) {
      message.error(loginError || "Login failed")
    }
  }

  const onRegister = async (values: any) => {
    try {
      await register({
        username: values.username,
        passwordHash: values.password,
        email: values.email,
        phoneNumber: values.phone,
        role: "USER"
      })
      message.success("Registration successful!")
      setActiveTab("login") // Switch to login tab after successful registration
      registerForm.resetFields() // Clear the registration form
    } catch (error) {
      message.error(registerError || "Registration failed")
    }
  }

  const items: TabsProps["items"] = [
    {
      key: "login",
      label: "Login",
      children: (
        <Form form={loginForm} layout="vertical" onFinish={onLogin} requiredMark={false} className="w-full">
          <Form.Item name="username" rules={[{ required: true, message: "Please input your username!" }]}>
            <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Username" size="large" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Please input your password!" }]}>
            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoginLoading} block size="large">
              Login
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "register",
      label: "Register",
      children: (
        <Form form={registerForm} layout="vertical" onFinish={onRegister} requiredMark={false} className="w-full">
          <Form.Item name="username" rules={[{ required: true, message: "Please input your username!" }]}>
            <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Choose a username" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Enter your email" size="large" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
              { pattern: /^\+?\d{10,}$/, message: "Please enter a valid phone number!" },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="Enter your phone number"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Choose a password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isRegisterLoading} block size="large">
              Register
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-blue-900/40" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome to SkyBooker</h2>
          <p className="text-lg">Your journey begins here</p>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <Card className="w-full max-w-[400px] shadow-lg">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {/* <PlaneIcon className="text-4xl text-blue-600" /> */}
            </div>
            <Title level={3} className="!mb-2">
              Welcome to SkyBooker
            </Title>
            <Text className="text-gray-500">Your gateway to seamless flight bookings</Text>
          </div>

          <Tabs 
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items} 
            centered 
            className="auth-tabs" 
          />
        </Card>
      </div>
    </div>
  )
}

