import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Alert } from '../../../shared/components/ui/Alert';
import { validateLogin } from '../utils/authValidation';
import { ROUTES } from '../../../constants/app.constants';
import OTPVerification from './OTPVerification';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { login, requiresOtp, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Show OTP component if required
  if (requiresOtp) {
    return <OTPVerification onSuccess={onSuccess} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    
    // Validate form
    const validationErrors = validateLogin({ email, password });
    const errorMap: { email?: string; password?: string } = {};
    
    validationErrors.forEach((err) => {
      if (err.field === 'email') errorMap.email = err.message;
      if (err.field === 'password') errorMap.password = err.message;
    });
    
    if (Object.keys(errorMap).length > 0) {
      setErrors(errorMap);
      return;
    }
    
    setErrors({});
    
    // Attempt login
    const result = await login(email, password);
    
    if (result.success && !result.requiresOtp) {
      onSuccess?.();
    } else if (result.success && result.requiresOtp) {
      // OTP form will show automatically via requiresOtp state
    } else if (result.message) {
      setGeneralError(result.message);
    }
  };

  return (
    <div className="auth-card">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-chatgpt-text">Welcome Back</h1>
        <p className="text-gray-400 mt-2">Sign in to continue to Qroq AI Chatbot</p>
      </div>

      {generalError && (
        <div className="mb-4">
          <Alert type="error" message={generalError} onClose={() => setGeneralError(null)} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email Address"
          placeholder="user@example.com"
          value={email}
          onChange={setEmail}
          error={errors.email}
          required
          disabled={isLoading}
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          required
          disabled={isLoading}
        />

        <div className="text-right">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-chatgpt-green hover:text-[#0e8f6f] transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Don't have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-chatgpt-green hover:text-[#0e8f6f] transition-colors font-medium"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;