import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Spin } from 'antd';
import { useAuth } from '../../hooks/useAuth';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute; 