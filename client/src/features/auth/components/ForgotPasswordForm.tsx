import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Alert } from '../../../shared/components/ui/Alert';
import { validateEmail } from '../utils/authValidation';
import { ROUTES } from '../../../constants/app.constants';
import { SUCCESS_MESSAGES } from '../../../constants/app.constants';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const message = await authService.forgotPassword(email);
      setSuccessMessage(SUCCESS_MESSAGES.PASSWORD_RESET_SENT);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-chatgpt-text">Forgot Password?</h1>
        <p className="text-gray-400 mt-2">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      {successMessage && (
        <div className="mb-4">
          <Alert type="success" message={successMessage} />
        </div>
      )}

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          label="Email Address"
          placeholder="user@example.com"
          value={email}
          onChange={setEmail}
          error={error && !successMessage ? error : undefined}
          required
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Send Reset Instructions
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to={ROUTES.LOGIN}
          className="text-sm text-chatgpt-green hover:text-[#0e8f6f] transition-colors"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;