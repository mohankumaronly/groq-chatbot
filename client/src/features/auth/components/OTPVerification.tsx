import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../../../shared/components/ui/Button';
import { Alert } from '../../../shared/components/ui/Alert';
import { OTPCountdownTimer } from '../../../shared/components/ui/OTPCountdownTimer';
import { validateOtp } from '../utils/authValidation';

interface OTPVerificationProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

export const OTPVerification = ({ onSuccess, onBack }: OTPVerificationProps) => {
  const { verifyOtp, maskedEmail, otpExpiresIn, clearOtpState } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    setError(null);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all digits are filled
    if (index === 5 && value && newOtp.every((digit) => digit !== '')) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (otpCode: string) => {
    setIsLoading(true);
    setError(null);
    
    const validationError = validateOtp(otpCode);
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }
    
    const result = await verifyOtp(otpCode);
    
    if (result.success) {
      onSuccess?.();
    } else {
      setError('Invalid OTP. Please try again.');
      // Clear OTP input on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
    
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError(null);
    
    // Clear OTP state and let user login again
    clearOtpState();
    setError('Please login again to receive a new OTP code.');
    
    setIsResending(false);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split('');
      const newOtp = [...otp];
      for (let i = 0; i < digits.length && i < 6; i++) {
        newOtp[i] = digits[i];
      }
      setOtp(newOtp);
      
      if (digits.length === 6) {
        handleSubmit(pastedData);
      } else {
        inputRefs.current[digits.length]?.focus();
      }
    }
  };

  return (
    <div className="auth-card">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-chatgpt-text">Verify Your Identity</h2>
        <p className="text-gray-400 mt-2">
          We sent a verification code to <span className="text-chatgpt-green">{maskedEmail}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(otp.join('')); }}>
        <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold
                       bg-[#3a3b42] border border-gray-600 rounded-lg
                       text-white focus:outline-none focus:ring-2 focus:ring-chatgpt-green
                       transition-all"
              disabled={isLoading}
            />
          ))}
        </div>

        {otpExpiresIn && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-400">
              Code expires in: <OTPCountdownTimer seconds={otpExpiresIn} onExpire={() => setError('OTP expired. Please login again.')} />
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Verify & Login
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={handleResendOtp}
          disabled={isResending}
          className="text-sm text-chatgpt-green hover:text-[#0e8f6f] transition-colors disabled:opacity-50"
        >
          {isResending ? 'Resending...' : "Didn't receive code? Resend OTP"}
        </button>
      </div>

      {onBack && (
        <div className="mt-4 text-center">
          <button
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default OTPVerification;