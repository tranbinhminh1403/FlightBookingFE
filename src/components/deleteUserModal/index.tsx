import { Modal } from 'antd';

interface DeleteUserModalProps {
  user: {
    userId: number;
    username: string;
    email: string;
    role: string;
  } | null;
  isLoading: boolean;
  onConfirm: (userId: number) => Promise<void>;
  onCancel: () => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  user,
  isLoading,
  onConfirm,
  onCancel,
}) => {
  if (!user) return null;

  return (
    <Modal
      title="Deactivate User"
      open={!!user}
      onCancel={onCancel}
      okText="Yes, Deactivate"
      okType="danger"
      cancelText="Cancel"
      onOk={() => onConfirm(user.userId)}
      okButtonProps={{
        loading: isLoading,
      }}
      centered
      maskClosable={false}
    >
      <div>
        <p>Are you sure you want to deactivate this user?</p>
        <p>Username: <strong>{user.username}</strong></p>
        <p>Email: <strong>{user.email}</strong></p>
        <p>Role: <strong>{user.role}</strong></p>
        <p>This action will set the user status to INACTIVE.</p>
      </div>
    </Modal>
  );
};

export default DeleteUserModal; 