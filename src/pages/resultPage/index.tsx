import { Result, Button, Spin } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { usePaypalConfirm } from '../../hooks/usePaypalConfirm';

const ResultPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { confirmPaypal, isLoading } = usePaypalConfirm();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      confirmPaypal(token)
        .catch(console.error);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <Result
        status="success"
        title="Payment Successful!"
        subTitle="Your flight has been booked successfully. You will receive a confirmation email shortly."
        extra={
          [
            <Button 
              type="primary" 
              onClick={() => navigate('/')}
              key="home"
            >
              Return to Home
            </Button>
          ]
        }
      />
    </div>
  );
};

export default ResultPage; 