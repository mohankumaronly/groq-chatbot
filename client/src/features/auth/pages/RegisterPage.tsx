import { RegisterForm } from '../components/RegisterForm';
import { AuthLayout } from '../../../shared/components/layout/AuthLayout';

export const RegisterPage = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;