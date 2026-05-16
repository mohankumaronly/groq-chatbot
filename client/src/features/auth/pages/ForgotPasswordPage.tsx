import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { AuthLayout } from '../../../shared/components/layout/AuthLayout';

export const ForgotPasswordPage = () => {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;