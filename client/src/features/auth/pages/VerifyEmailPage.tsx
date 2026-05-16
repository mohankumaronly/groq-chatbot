import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from '../../../shared/components/ui/Button';
import { Alert } from '../../../shared/components/ui/Alert';
import { AuthLayout } from '../../../shared/components/layout/AuthLayout';
import { ROUTES } from '../../../constants/app.constants';

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setIsVerifying(true);
    try {
      const response = await authService.verifyEmail(verificationToken);
      setVerificationStatus('success');
      setMessage('Email verified successfully! You can now login.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
    } catch (error: any) {
      setVerificationStatus('error');
      setMessage(error.response?.data?.message || 'Email verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-chatgpt-text">Verify Your Email</h1>
          <p className="text-gray-400 mt-2">
            Please check your email for the verification link
          </p>
        </div>

        {isVerifying && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-chatgpt-green"></div>
            <p className="mt-4 text-gray-400">Verifying your email...</p>
          </div>
        )}

        {verificationStatus === 'success' && !isVerifying && (
          <>
            <Alert type="success" message={message} />
            <div className="mt-6 text-center">
              <Button onClick={() => navigate(ROUTES.LOGIN)}>
                Go to Login
              </Button>
            </div>
          </>
        )}

        {verificationStatus === 'error' && !isVerifying && (
          <>
            <Alert type="error" message={message} />
            <div className="mt-6 text-center space-y-4">
              <p className="text-gray-400">
                Didn't receive the email? Check your spam folder or try registering again.
              </p>
              <Link
                to={ROUTES.REGISTER}
                className="text-chatgpt-green hover:text-[#0e8f6f] transition-colors"
              >
                Back to Registration
              </Link>
            </div>
          </>
        )}

        {!token && !isVerifying && verificationStatus === 'idle' && (
          <div className="text-center">
            <Alert 
              type="info" 
              message="A verification link has been sent to your email address. Please check your inbox and click the link to verify your account." 
            />
            <div className="mt-6">
              <Link
                to={ROUTES.LOGIN}
                className="text-chatgpt-green hover:text-[#0e8f6f] transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;