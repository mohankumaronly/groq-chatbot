import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Alert } from '../../../shared/components/ui/Alert';
import { validateRegistration } from '../utils/authValidation';
import { ROUTES, SUCCESS_MESSAGES } from '../../../constants/app.constants';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);
    
    console.log('=== Registration Form Submitted ===');
    console.log('Form Data:', formData);
    
    // Validate form
    const validationErrors = validateRegistration(formData);
    const errorMap: typeof errors = {};
    
    validationErrors.forEach((err) => {
      if (err.field === 'firstName') errorMap.firstName = err.message;
      if (err.field === 'lastName') errorMap.lastName = err.message;
      if (err.field === 'email') errorMap.email = err.message;
      if (err.field === 'password') errorMap.password = err.message;
      if (err.field === 'confirmPassword') errorMap.confirmPassword = err.message;
    });
    
    if (Object.keys(errorMap).length > 0) {
      console.log('Validation Errors:', errorMap);
      setErrors(errorMap);
      return;
    }
    
    console.log('Validation passed, calling register API...');
    setErrors({});
    
    // Attempt registration
    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      
      console.log('Registration Result:', result);
      
      if (result.success) {
        console.log('Registration successful!');
        setSuccessMessage(SUCCESS_MESSAGES.REGISTRATION);
        // Redirect to verify email page after 3 seconds
        setTimeout(() => {
          console.log('Redirecting to verify email page...');
          navigate(ROUTES.VERIFY_EMAIL, { state: { email: formData.email } });
        }, 3000);
      } else {
        console.log('Registration failed:', result.message);
        setGeneralError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Registration error caught:', error);
      setGeneralError(error.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-card">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-chatgpt-text">Create Account</h1>
        <p className="text-gray-400 mt-2">Join Qroq AI Chatbot today</p>
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
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={(value) => handleChange('firstName', value)}
            error={errors.firstName}
            required
            disabled={isLoading}
          />
          
          <Input
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(value) => handleChange('lastName', value)}
            error={errors.lastName}
            required
            disabled={isLoading}
          />
        </div>

        <Input
          type="email"
          label="Email Address"
          placeholder="user@example.com"
          value={formData.email}
          onChange={(value) => handleChange('email', value)}
          error={errors.email}
          required
          disabled={isLoading}
        />

        <Input
          type="password"
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(value) => handleChange('password', value)}
          error={errors.password}
          required
          disabled={isLoading}
        />

        <Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(value) => handleChange('confirmPassword', value)}
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
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="text-chatgpt-green hover:text-[#0e8f6f] transition-colors font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;