import { useEffect, useState } from "react";
import { Card, Typography, Tabs, Table, Tag, Spin, Empty, message, Button, Form, Input, Modal, Divider } from "antd";
import { UserOutlined, EnvironmentOutlined, HistoryOutlined, EditOutlined, SaveOutlined, DollarOutlined } from "@ant-design/icons";
import FooterComponent from "../../components/footer"
import HeaderComponent from "../../components/header"
import { useProfile } from "../../hooks/useProfile";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { useChangePassword } from "../../hooks/useChangePassword";
import { useConfirmPayment } from "../../hooks/useConfirmPayment";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const { profile, isLoading: isLoadingProfile, error, fetchProfile } = useProfile();
    const { updateProfile, isLoading: isUpdating } = useUpdateProfile();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordForm] = Form.useForm();
    const { changePassword, isLoading: isChangingPasswordLoading } = useChangePassword();
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const { confirmPayment, isLoading: isConfirming } = useConfirmPayment();

    useEffect(() => {
        fetchProfile().catch((err) => {
            message.error("Failed to load profile");
        });
    }, []);

    const handleEdit = () => {
        form.setFieldsValue({
            email: profile?.email,
            phoneNumber: profile?.phoneNumber,
            initialAirport: profile?.initialAirport,
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            await updateProfile(values);
            await fetchProfile(); // Refresh profile data
            setIsEditing(false);
            message.success('Profile updated successfully');
        } catch (error) {
            message.error('Failed to update profile');
        }
    };

    const handleChangePassword = async () => {
        try {
            const values = await passwordForm.validateFields();
            if (values.newPassword !== values.confirmPassword) {
                message.error('New passwords do not match');
                return;
            }

            await changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });

            setIsChangingPassword(false);
            passwordForm.resetFields();
        } catch (error) {
            // Error message is already handled in the hook
            console.error('Password change failed:', error);
        }
    };

    const handlePayment = async (bookingId: number) => {
        try {
            await confirmPayment(bookingId);
            await fetchProfile(); // Refresh profile data
            setIsDetailModalOpen(false);
        } catch (error) {
            console.error('Payment failed:', error);
        }
    };

    const bookingsColumns = [
        {
            title: "Flight",
            dataIndex: "flightNumber",
            key: "flightNumber",
        },
        {
            title: "Route",
            key: "route",
            render: (record: any) => (
                <span>
                    {record.departureAirport} → {record.arrivalAirport}
                </span>
            ),
        },
        {
            title: "Booking Date",
            dataIndex: "bookingDate",
            key: "bookingDate",
            render: (date: string) => dayjs(date).format("MMM D, YYYY HH:mm"),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "confirmed" ? "green" : "orange"}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Payment",
            key: "payment",
            render: (record: any) => (
                <div>
                    <div>${record.totalPrice.toFixed(2)}</div>
                    <Tag color={record.paymentStatus === "paid" ? "green" : "red"}>
                        {record.paymentStatus.toUpperCase()}
                    </Tag>
                </div>
            ),
        },
    ];

    if (isLoadingProfile) {
        return (
            <div>
                <HeaderComponent />
                <div className="min-h-screen flex items-center justify-center">
                    <Spin size="large" />
                </div>
                <FooterComponent />
            </div>
        );
    }

    const renderProfileContent = () => {
        if (isEditing) {
            return (
                <Form form={form} layout="vertical">
                    <Form.Item name="email" label="Email">
                        <Input />
                    </Form.Item>
                    <Form.Item name="phoneNumber" label="Phone Number">
                        <Input />
                    </Form.Item>
                    <Form.Item name="initialAirport" label="Home Airport">
                        <Input />
                    </Form.Item>
                    <Button 
                        type="primary" 
                        icon={<SaveOutlined />} 
                        onClick={handleSave}
                        loading={isUpdating}
                    >
                        Save
                    </Button>
                </Form>
            );
        }

        return (
            <>
                <div className="space-y-4">
                    <div>
                        <Text type="secondary">Email</Text>
                        <div className="text-lg">{profile?.email}</div>
                    </div>
                    <div>
                        <Text type="secondary">Phone Number</Text>
                        <div className="text-lg">{profile?.phoneNumber}</div>
                    </div>
                    <div>
                        <Text type="secondary">Home Airport</Text>
                        <div className="text-lg flex items-center">
                            <EnvironmentOutlined className="mr-2 text-blue-500" />
                            {profile?.initialAirport || "Not set"}
                        </div>
                    </div>
                </div>
                <Button 
                    icon={<EditOutlined />} 
                    onClick={handleEdit}
                    className="mt-4 mr-2"
                >
                    Edit Profile
                </Button>
                <Button 
                    onClick={() => setIsChangingPassword(true)}
                    className="mt-4"
                >
                    Change Password
                </Button>

                <Modal
                    title="Change Password"
                    open={isChangingPassword}
                    onCancel={() => {
                        setIsChangingPassword(false);
                        passwordForm.resetFields();
                    }}
                    footer={null}
                >
                    <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
                        <Form.Item
                            name="currentPassword"
                            label="Current Password"
                            rules={[{ required: true, message: 'Please input your current password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label="New Password"
                            rules={[{ required: true, message: 'Please input your new password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Confirm New Password"
                            rules={[{ required: true, message: 'Please confirm your new password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={isChangingPasswordLoading}>
                                Change Password
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <HeaderComponent />
            <div className="max-w-7xl mx-auto px-4 py-8">
                {profile ? (
                    <>
                        <Card className="mb-8">
                            <div className="flex items-start gap-8">
                                <div className="flex-1">
                                    <Title level={2} className="!mb-6">
                                        <UserOutlined className="mr-2" />
                                        {profile.username}
                                    </Title>
                                    {renderProfileContent()}
                                </div>
                                <div className="text-right">
                                    <Text type="secondary">Total Bookings</Text>
                                    <div className="text-3xl font-bold text-blue-600">
                                        {profile.bookings.length}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <Title level={3} className="!mb-6">
                                <HistoryOutlined className="mr-2" />
                                Booking History
                            </Title>
                            {profile.bookings.length > 0 ? (
                                <Table
                                    columns={bookingsColumns}
                                    dataSource={profile.bookings}
                                    rowKey="bookingId"
                                    pagination={{ pageSize: 5 }}
                                    onRow={(record) => ({
                                        onClick: () => {
                                            setSelectedBooking(record);
                                            setIsDetailModalOpen(true);
                                        },
                                        style: { cursor: 'pointer' }
                                    })}
                                />
                            ) : (
                                <Empty
                                    description="No bookings found"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )}
                        </Card>
                    </>
                ) : (
                    <Card>
                        <Empty
                            description={
                                error ? "Failed to load profile" : "No profile information found"
                            }
                        />
                    </Card>
                )}
            </div>
            <FooterComponent />

            <Modal
                open={isDetailModalOpen}
                onCancel={() => {
                    setIsDetailModalOpen(false);
                    setSelectedBooking(null);
                }}
                footer={null}
                width={600}
            >
                {selectedBooking && (
                    <div className="space-y-4">
                        <Title level={4}>Flight Details</Title>
                        
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Text type="secondary">Flight Number</Text>
                                    <div className="font-semibold">{selectedBooking.flightNumber}</div>
                                </div>
                                <div>
                                    <Text type="secondary">Booking Date</Text>
                                    <div className="font-semibold">
                                        {dayjs(selectedBooking.bookingDate).format("MMM D, YYYY HH:mm")}
                                    </div>
                                </div>
                            </div>

                            <Divider className="my-2" />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Text type="secondary">From</Text>
                                    <div className="font-semibold">{selectedBooking.departureAirport}</div>
                                </div>
                                <div>
                                    <Text type="secondary">To</Text>
                                    <div className="font-semibold">{selectedBooking.arrivalAirport}</div>
                                </div>
                            </div>

                            <Divider className="my-2" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Text type="secondary">Status</Text>
                                    <div>
                                        <Tag color={selectedBooking.status === "confirmed" ? "green" : "orange"}>
                                            {selectedBooking.status.toUpperCase()}
                                        </Tag>
                                    </div>
                                </div>
                                <div>
                                    <Text type="secondary">Payment Status</Text>
                                    <div>
                                        <Tag color={selectedBooking.paymentStatus === "paid" ? "green" : "red"}>
                                            {selectedBooking.paymentStatus.toUpperCase()}
                                        </Tag>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Text type="secondary">Total Price</Text>
                                <div className="text-lg font-bold text-blue-600">
                                    ${selectedBooking.totalPrice.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        {selectedBooking.paymentStatus.toLowerCase() !== "paid" && (
                            <div className="mt-4">
                                <Button
                                    type="primary"
                                    onClick={() => handlePayment(selectedBooking.bookingId)}
                                    loading={isConfirming}
                                    icon={<DollarOutlined />}
                                    block
                                    size="large"
                                >
                                    Confirm Payment
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}