import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Alert } from '../../../shared/components/ui/Alert';
import { validatePassword, validateConfirmPassword } from '../utils/authValidation';
import { ROUTES } from '../../../constants/app.constants';
import { SUCCESS_MESSAGES } from '../../../constants/app.constants';

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if token exists
  if (!token) {
    return (
      <div className="auth-card">
        <Alert 
          type="error" 
          message="Invalid or missing reset token. Please request a new password reset link." 
        />
        <div className="mt-4 text-center">
          <Button onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}>
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);
    
    // Validate passwords
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(password, confirmPassword);
    
    const newErrors: typeof errors = {};
    if (passwordError) newErrors.password = passwordError;
    if (confirmError) newErrors.confirmPassword = confirmError;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsLoading(true);
    
    try {
      const message = await authService.resetPassword(token, password);
      setSuccessMessage(SUCCESS_MESSAGES.PASSWORD_RESET);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
    } catch (err: any) {
      setGeneralError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-chatgpt-text">Reset Password</h1>
        <p className="text-gray-400 mt-2">Enter your new password below</p>
      </div>

      {successMessage && (
        <div className="mb-4">
          <Alert type="success" message={successMessage} />
        </div>
      )}

      {generalError && (
        <div className="mb-4">
          <Alert type="error" message={generalError} onClose={() => setGeneralError(null)} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          label="New Password"
          placeholder="Enter new password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          required
          disabled={isLoading}
        />

        <Input
          type="password"
          label="Confirm New Password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirmPassword}
          required
          disabled={isLoading}
        />

        <p className="text-xs text-gray-400">
          Password must be at least 8 characters long
        </p>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;