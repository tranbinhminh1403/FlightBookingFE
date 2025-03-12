import { Modal, Form, Input, Select, InputNumber, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';

interface EditFlightModalProps {
  flight: Flight | null;
  isVisible: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (flightId: number, values: any) => Promise<void>;
}

const EditFlightModal: React.FC<EditFlightModalProps> = ({
  flight,
  isVisible,
  isLoading,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (flight) {
      form.setFieldsValue({
        ...flight,
        departureTime: flight.departureTime ? dayjs(flight.departureTime) : null,
        arrivalTime: flight.arrivalTime ? dayjs(flight.arrivalTime) : null,
      });
    }
  }, [flight, form]);

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      departureTime: values.departureTime?.format('YYYY-MM-DDTHH:mm:ss'),
      arrivalTime: values.arrivalTime?.format('YYYY-MM-DDTHH:mm:ss'),
      economyPrice: Number(values.economyPrice),
      businessPrice: Number(values.businessPrice),
      firstClassPrice: Number(values.firstClassPrice),
      availableSeats: Number(values.availableSeats),
    };
    onSubmit(flight!.flightId, formattedValues);
  };

  return (
    <Modal
      title="Edit Flight"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={isLoading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="flightNumber"
          label="Flight Number"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="departureAirport"
          label="Departure Airport"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="arrivalAirport"
          label="Arrival Airport"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="departureTime"
          label="Departure Time"
          rules={[{ required: true }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          name="arrivalTime"
          label="Arrival Time"
          rules={[{ required: true }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          name="economyPrice"
          label="Economy Price"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} precision={2} prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="businessPrice"
          label="Business Price"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} precision={2} prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="firstClassPrice"
          label="First Class Price"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} precision={2} prefix="$" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="availableSeats"
          label="Available Seats"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="on-time">On Time</Select.Option>
            <Select.Option value="delayed">Delayed</Select.Option>
            <Select.Option value="cancelled">Cancelled</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditFlightModal; 