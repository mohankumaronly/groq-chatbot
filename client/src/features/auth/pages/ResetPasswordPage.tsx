import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { AuthLayout } from '../../../shared/components/layout/AuthLayout';

export const ResetPasswordPage = () => {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPasswordPage;