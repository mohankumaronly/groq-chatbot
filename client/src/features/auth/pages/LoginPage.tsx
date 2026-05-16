import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { AuthLayout } from '../../../shared/components/layout/AuthLayout';
import { ROUTES } from '../../../constants/app.constants';

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <AuthLayout>
      <LoginForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
};

export default LoginPage;