import { useState, useEffect } from 'react';
import { Card, Typography, Table, Tag, Button, Tabs, message, Modal, Form, Input, Select, Space, DatePicker } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/header';
import FooterComponent from '../../components/footer';
// import axios from 'axios';
import dayjs from 'dayjs';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { useManageUsers } from '../../hooks/useManageUsers';
import DeleteUserModal from '../../components/deleteUserModal';
import { useManageFlights } from '../../hooks/useManageFlights';
import EditFlightModal from '../../components/editFlightModal';
import { useAdminFlights } from '../../hooks/useAdminFlights';
import DashboardCard from '../../components/dashboardCard';
import { code } from '../../code';
import { useGuestOrders } from '../../hooks/useGuestOrders';
import { DashboardCharts } from '../../components/DashboardCharts';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface User {
  userId: number;
  username: string;
  email: string;
  role: string;
  phoneNumber: string;
  initialAirport: string | null;
  bookings: Booking[];
  status: string;
}

interface Flight {
  flightId: number;
  airline: Airline;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  economyPrice: number;
  businessPrice: number;
  firstClassPrice: number;
  availableSeats: number;
}

interface Airline {
  airlineId: number;
  name: string;
  code: string;
  country: string;
}

interface Booking {
  bookingId: number;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  bookingDate: string;
  status: string;
  totalPrice: number;
  paymentStatus: string;
  seatClass?: string;
}

interface GuestOrder {
  orderId: number;
  guestName: string;
  email: string;
  phoneNumber: string;
  flight: {
    flightId: number;
    airline: {
      airlineId: number;
      name: string;
      code: string;
      country: string;
    };
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    status: string;
    economyPrice: number;
    businessPrice: number;
    firstClassPrice: number;
    availableSeats: number;
  };
  price: number;
  orderDate: string;
  seatClass: string;
  paymentStatus: string | null;
}

const calculateTotalIncome = (users: User[], guestOrders: GuestOrder[]) => {
  const userIncome = users.reduce((total, user) => {
    const paidBookings = user.bookings.filter(booking => booking.paymentStatus.toLowerCase() === 'paid');
    return total + paidBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  }, 0);

  const guestIncome = guestOrders?.reduce((total, order) => {
    return order.paymentStatus === 'PAID' ? total + order.price : total;
  }, 0) || 0;

  return userIncome + guestIncome;
};

const calculateIncomeByClass = (users: User[], guestOrders: GuestOrder[]) => {
  const income = {
    economy: 0,
    business: 0,
    first: 0
  };

  // Process user bookings
  users?.forEach(user => {
    user.bookings.forEach(booking => {
      if (booking.paymentStatus.toLowerCase() === 'paid') {
        const price = booking.totalPrice;
        if (price >= 250 && price <= 410) {
          income.economy += price;
        } else if (price >= 750 && price <= 900) {
          income.business += price;
        } else if (price >= 1000 && price <= 1500) {
          income.first += price;
        }
      }
    });
  });

  // Process guest orders
  guestOrders?.forEach(order => {
    if (order.paymentStatus === 'PAID') {
      const price = order.price;
      if (price >= 250 && price <= 410) {
        income.economy += price;
      } else if (price >= 750 && price <= 900) {
        income.business += price;
      } else if (price >= 1000 && price <= 1500) {
        income.first += price;
      }
    }
  });

  return income;
};

const guestOrderColumns = [
  {
    title: 'Order ID',
    dataIndex: 'orderId',
    key: 'orderId',
  },
  {
    title: 'Guest Name',
    dataIndex: 'guestName',
    key: 'guestName',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Phone',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
  {
    title: 'Flight Details',
    key: 'flight',
    render: (record: GuestOrder) => (
      <div>
        <div>{record.flight.flightNumber}</div>
        <div>{record.flight.departureAirport} → {record.flight.arrivalAirport}</div>
        <div>{dayjs(record.flight.departureTime).format('MMM D, YYYY HH:mm')}</div>
      </div>
    ),
  },
  {
    title: 'Price',
    key: 'price',
    render: (record: GuestOrder) => (
      <div>
        <div>${record.price.toFixed(2)}</div>
        <Tag color="blue">{record.seatClass}</Tag>
      </div>
    ),
  },
  {
    title: 'Payment Status',
    key: 'paymentStatus',
    render: (record: GuestOrder) => (
      <Tag color={record.paymentStatus === 'PAID' ? 'green' : 'red'}>
        {record.paymentStatus || 'UNPAID'}
      </Tag>
    ),
  },
  {
    title: 'Order Date',
    dataIndex: 'orderDate',
    key: 'orderDate',
    render: (date: string) => dayjs(date).format('MMM D, YYYY HH:mm'),
  },
];

const AdminPage = () => {
  const { users, isLoading: isLoadingUsers, fetchUsers } = useAdminUsers();
  const { flights, isLoading: isLoadingFlights, fetchFlights } = useAdminFlights();
  const { updateUser, deleteUser, isLoading: isManaging } = useManageUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isEditFlightModalVisible, setIsEditFlightModalVisible] = useState(false);
  const { updateFlight, isLoading: isUpdatingFlight } = useManageFlights();
  const [userSearchText, setUserSearchText] = useState('');
  const [flightSearchText, setFlightSearchText] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<string[]>([]);
  const [flightStatusFilter, setFlightStatusFilter] = useState<string[]>([]);
  const [departureAirport, setDepartureAirport] = useState<string>('');
  const [arrivalAirport, setArrivalAirport] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const { guestOrders, isLoading: isLoadingGuestOrders, fetchGuestOrders } = useGuestOrders();
  const [selectedGuestOrder, setSelectedGuestOrder] = useState<GuestOrder | null>(null);
  const [isGuestOrderModalVisible, setIsGuestOrderModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchUsers();
    fetchFlights();
    fetchGuestOrders();
  }, []);

  const handleEdit = async (values: any) => {
    try {
      await updateUser(selectedUser!.userId, {
        ...values,
        status: 'ACTIVE'
      });
      await fetchUsers();
      setIsEditModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId);
      await fetchUsers();
      message.success('User deactivated successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      message.error('Failed to deactivate user');
    }
  };

  const handleEditFlight = async (flightId: number, values: any) => {
    try {
      await updateFlight(flightId, {
        ...selectedFlight,
        ...values,
        flightId,
        departureTime: values.departureTime,
        arrivalTime: values.arrivalTime,
        economyPrice: Number(values.economyPrice),
        businessPrice: Number(values.businessPrice),
        firstClassPrice: Number(values.firstClassPrice),
        availableSeats: Number(values.availableSeats),
      });
      await fetchFlights();
      setIsEditFlightModalVisible(false);
    } catch (error) {
      console.error('Failed to update flight:', error);
    }
  };

  const userColumns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role.toUpperCase() === 'ADMIN' ? 'red' : 'blue'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Initial Airport',
      dataIndex: 'initialAirport',
      key: 'initialAirport',
      render: (airport: string | null) => airport || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Bookings',
      key: 'bookings',
      render: (record: User) => (
        <Button 
          type="link" 
          onClick={() => {
            setSelectedUser(record);
            setIsModalVisible(true);
          }}
        >
          View ({record.bookings.length})
        </Button>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: User) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedUser(record);
              form.setFieldsValue({
                username: record.username,
                email: record.email,
                phoneNumber: record.phoneNumber,
                role: record.role,
                initialAirport: record.initialAirport,
                status: record.status,
              });
              setIsEditModalVisible(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            disabled={record.status === 'INACTIVE'}
            onClick={() => setUserToDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const bookingColumns = [
    {
      title: 'Flight',
      dataIndex: 'flightNumber',
      key: 'flightNumber',
    },
    {
      title: 'Route',
      key: 'route',
      render: (record: Booking) => (
        <span>{record.departureAirport} → {record.arrivalAirport}</span>
      ),
    },
    {
      title: 'Booking Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (date: string) => dayjs(date).format('MMM D, YYYY HH:mm'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'CONFIRMED' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (record: Booking) => (
        <div>
          <div>${record.totalPrice.toFixed(2)}</div>
          <Tag color={record.paymentStatus === 'PAID' ? 'green' : 'red'}>
            {record.paymentStatus}
          </Tag>
        </div>
      ),
    },
  ];

  const flightColumns = [
    {
      title: 'Flight Number',
      dataIndex: 'flightNumber',
      key: 'flightNumber',
    },
    {
      title: 'Airline',
      key: 'airline',
      render: (record: Flight) => (
        <span>{record.airline.name} ({record.airline.code})</span>
      ),
    },
    {
      title: 'Route',
      key: 'route',
      render: (record: Flight) => (
        <span>{record.departureAirport} → {record.arrivalAirport}</span>
      ),
    },
    {
      title: 'Time',
      key: 'time',
      render: (record: Flight) => (
        <div>
          <div>Dep: {dayjs(record.departureTime).format('MMM D, YYYY HH:mm')}</div>
          <div>Arr: {dayjs(record.arrivalTime).format('MMM D, YYYY HH:mm')}</div>
        </div>
      ),
    },
    {
      title: 'Prices',
      key: 'prices',
      render: (record: Flight) => (
        <div>
          <div>Economy: ${record.economyPrice.toFixed(2)}</div>
          <div>Business: ${record.businessPrice.toFixed(2)}</div>
          <div>First: ${record.firstClassPrice.toFixed(2)}</div>
        </div>
      ),
    },
    {
      title: 'Available Seats',
      dataIndex: 'availableSeats',
      key: 'availableSeats',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'on-time' ? 'green' :
          status === 'delayed' ? 'orange' : 'red'
        }>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Flight) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            setSelectedFlight(record);
            setIsEditFlightModalVisible(true);
          }}
        />
      ),
    },
  ];

  const totalUsers = users?.length || 0;
  const totalFlights = flights?.length || 0;
  const totalIncome = calculateTotalIncome(users || [], guestOrders || []);
  const incomeByClass = calculateIncomeByClass(users || [], guestOrders || []);

  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(userSearchText.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchText.toLowerCase()) ||
      user.phoneNumber.includes(userSearchText);
    
    const matchesStatus = userStatusFilter.length === 0 || userStatusFilter.includes(user.status);
    
    return matchesSearch && matchesStatus;
  });

  const filteredFlights = flights?.filter(flight => {
    const matchesSearch = 
      flight.flightNumber.toLowerCase().includes(flightSearchText.toLowerCase()) ||
      flight.airline.name.toLowerCase().includes(flightSearchText.toLowerCase());
    
    const matchesStatus = flightStatusFilter.length === 0 || flightStatusFilter.includes(flight.status);
    
    const matchesDeparture = !departureAirport || flight.departureAirport === departureAirport;
    const matchesArrival = !arrivalAirport || flight.arrivalAirport === arrivalAirport;
    
    const flightDepartureDate = dayjs(flight.departureTime);
    const matchesDateRange = !dateRange || !dateRange[0] || !dateRange[1] || (
      flightDepartureDate.isAfter(dateRange[0].startOf('day')) && 
      flightDepartureDate.isBefore(dateRange[1].endOf('day'))
    );
    
    return matchesSearch && matchesStatus && matchesDeparture && matchesArrival && matchesDateRange;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderComponent />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Title level={2} className="mb-6">Dashboard</Title>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <DashboardCard
            title="Total Users"
            value={totalUsers}
            loading={isLoadingUsers}
            prefix={<UserOutlined />}
          />
          <DashboardCard
            title="Total Flights"
            value={totalFlights}
            loading={isLoadingFlights}
            prefix={<span>✈️</span>}
          />
          <DashboardCard
            title="Total Income"
            value={totalIncome}
            loading={isLoadingUsers}
            prefix="$"
            precision={2}
          />
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Economy Class Income"
            value={incomeByClass.economy}
            loading={isLoadingUsers}
            prefix="$"
            precision={2}
          />
          <DashboardCard
            title="Business Class Income"
            value={incomeByClass.business}
            loading={isLoadingUsers}
            prefix="$"
            precision={2}
          />
          <DashboardCard
            title="First Class Income"
            value={incomeByClass.first}
            loading={isLoadingUsers}
            prefix="$"
            precision={2}
          />
        </div> */}

        <DashboardCharts
          users={users}
          guestOrders={guestOrders}
          activeTab={activeTab}
          incomeByClass={incomeByClass}
        />

        <Tabs 
          defaultActiveKey="users" 
          onChange={(key) => setActiveTab(key)}
        >
          <TabPane tab="Users" key="users">
            <Space className="mb-4" direction="horizontal">
              <Input.Search
                placeholder="Search users..."
                allowClear
                onChange={(e) => setUserSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              <Select
                mode="multiple"
                placeholder="Filter by status"
                onChange={setUserStatusFilter}
                style={{ width: 200 }}
                allowClear
              >
                <Select.Option value="ACTIVE">Active</Select.Option>
                <Select.Option value="INACTIVE">Inactive</Select.Option>
              </Select>
            </Space>
            <Table columns={userColumns} dataSource={filteredUsers} />
          </TabPane>
          <TabPane tab="Flights" key="flights">
            <Space className="mb-4" wrap>
              <Input.Search
                placeholder="Search flights..."
                allowClear
                onChange={(e) => setFlightSearchText(e.target.value)}
                style={{ width: 200 }}
              />
              <Select
                showSearch
                allowClear
                placeholder="From"
                style={{ width: 120 }}
                onChange={setDepartureAirport}
                options={code}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().slice(0, 3).includes(input.toLowerCase())
                }
              />
              <Select
                showSearch
                allowClear
                placeholder="To"
                style={{ width: 120 }}
                onChange={setArrivalAirport}
                options={code}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().slice(0, 3).includes(input.toLowerCase())
                }
              />
              <DatePicker.RangePicker
                style={{ width: 280 }}
                onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
              />
              <Select
                mode="multiple"
                placeholder="Filter by status"
                onChange={setFlightStatusFilter}
                style={{ width: 200 }}
                allowClear
              >
                <Select.Option value="on-time">On Time</Select.Option>
                <Select.Option value="delayed">Delayed</Select.Option>
                <Select.Option value="cancelled">Cancelled</Select.Option>
              </Select>
            </Space>
            <Table columns={flightColumns} dataSource={filteredFlights} />
          </TabPane>
          <TabPane tab="Guest Orders" key="guestOrders">
            <Card>
              <Table
                columns={guestOrderColumns}
                dataSource={guestOrders}
                loading={isLoadingGuestOrders}
                rowKey="orderId"
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedGuestOrder(record);
                    setIsGuestOrderModalVisible(true);
                  },
                  style: { cursor: 'pointer' }
                })}
              />
            </Card>
          </TabPane>
        </Tabs>

        <Modal
          title={`Bookings - ${selectedUser?.username}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedUser(null);
          }}
          width={1000}
          footer={null}
        >
          {selectedUser && (
            <Table
              columns={bookingColumns}
              dataSource={selectedUser.bookings}
              rowKey="bookingId"
              pagination={false}
            />
          )}
        </Modal>

        <Modal
          title={`Edit User - ${selectedUser?.username}`}
          open={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            setSelectedUser(null);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleEdit}
            layout="vertical"
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="USER">User</Select.Option>
                <Select.Option value="ADMIN">Admin</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="initialAirport"
              label="Initial Airport"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="ACTIVE">Active</Select.Option>
                <Select.Option value="INACTIVE">Inactive</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isManaging}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <DeleteUserModal
          user={userToDelete}
          isLoading={isManaging}
          onConfirm={handleDelete}
          onCancel={() => setUserToDelete(null)}
        />

        <EditFlightModal
          flight={selectedFlight}
          isVisible={isEditFlightModalVisible}
          isLoading={isUpdatingFlight}
          onCancel={() => {
            setIsEditFlightModalVisible(false);
            setSelectedFlight(null);
          }}
          onSubmit={handleEditFlight}
        />

        <Modal
          title="Guest Order Details"
          open={isGuestOrderModalVisible}
          onCancel={() => {
            setIsGuestOrderModalVisible(false);
            setSelectedGuestOrder(null);
          }}
          footer={null}
          width={600}
        >
          {selectedGuestOrder && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <Title level={5}>Guest Information</Title>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text type="secondary">Name</Text>
                    <div className="font-semibold">{selectedGuestOrder.guestName}</div>
                  </div>
                  <div>
                    <Text type="secondary">Email</Text>
                    <div className="font-semibold">{selectedGuestOrder.email}</div>
                  </div>
                  <div>
                    <Text type="secondary">Phone</Text>
                    <div className="font-semibold">{selectedGuestOrder.phoneNumber}</div>
                  </div>
                  <div>
                    <Text type="secondary">Order Date</Text>
                    <div className="font-semibold">
                      {dayjs(selectedGuestOrder.orderDate).format('MMM D, YYYY HH:mm')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <Title level={5}>Flight Details</Title>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text type="secondary">Flight Number</Text>
                    <div className="font-semibold">{selectedGuestOrder.flight.flightNumber}</div>
                  </div>
                  <div>
                    <Text type="secondary">Airline</Text>
                    <div className="font-semibold">{selectedGuestOrder.flight.airline.name}</div>
                  </div>
                  <div>
                    <Text type="secondary">From</Text>
                    <div className="font-semibold">{selectedGuestOrder.flight.departureAirport}</div>
                  </div>
                  <div>
                    <Text type="secondary">To</Text>
                    <div className="font-semibold">{selectedGuestOrder.flight.arrivalAirport}</div>
                  </div>
                  <div>
                    <Text type="secondary">Departure</Text>
                    <div className="font-semibold">
                      {dayjs(selectedGuestOrder.flight.departureTime).format('MMM D, YYYY HH:mm')}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Arrival</Text>
                    <div className="font-semibold">
                      {dayjs(selectedGuestOrder.flight.arrivalTime).format('MMM D, YYYY HH:mm')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <Title level={5}>Payment Details</Title>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text type="secondary">Seat Class</Text>
                    <div>
                      <Tag color="blue">{selectedGuestOrder.seatClass}</Tag>
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Payment Status</Text>
                    <div>
                      <Tag color={selectedGuestOrder.paymentStatus === 'PAID' ? 'green' : 'red'}>
                        {selectedGuestOrder.paymentStatus || 'UNPAID'}
                      </Tag>
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Price</Text>
                    <div className="font-semibold text-lg text-blue-600">
                      ${selectedGuestOrder.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
      <FooterComponent />
    </div>
  );
};

export default AdminPage; 