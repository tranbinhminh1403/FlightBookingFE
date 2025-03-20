import { Result, Button, Spin } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePaypalConfirm } from '../../hooks/usePaypalConfirm';

const ResultPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { confirmPaypal, isLoading, isConfirmed } = usePaypalConfirm();
  const [showHomeButton, setShowHomeButton] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      confirmPaypal(token)
        .then(() => setShowHomeButton(true))
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
        status={isConfirmed ? "success" : "error"}
        title={isConfirmed ? "Payment Successful!" : "Confirming Payment..."}
        subTitle={
          isConfirmed 
            ? "Your flight has been booked successfully. You will receive a confirmation email shortly."
            : "Please wait while we confirm your payment."
        }
        extra={
          showHomeButton && [
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