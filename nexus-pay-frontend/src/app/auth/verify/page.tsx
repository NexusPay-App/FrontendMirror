'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phone') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const otpToVerify = otpCode || otp.join('');
    
    if (otpToVerify.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    if (!phoneNumber) {
      setError('Phone number is missing. Please go back and try again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.verifyOTP({
        phoneNumber,
        otp: otpToVerify,
      });

      if (response.success && response.data) {
        // Token is automatically stored in localStorage by the API
        router.push('/dashboard');
      } else {
        setError('Invalid verification code. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !phoneNumber) return;

    setIsResending(true);
    setError('');

    try {
      // Resend by attempting login again
      // This will trigger a new OTP to be sent
      await api.login({ phoneNumber, password: 'resend' });
      
      setTimeLeft(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error('Resend error:', err);
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maskedPhone = phoneNumber.replace(/(\+254)(\d{3})(\d{6})/, '$1***$3');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-5 flex items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-[#F8F9FA] transition-colors"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-[#1E2329]"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </header>

      <main className="flex-1 flex flex-col px-6 py-4">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-[#1E2329] mb-2">Verify Your Phone</h1>
          <p className="text-[#707A8A] text-base">
            Enter the 6-digit code sent to{' '}
            <span className="font-medium text-[#1E2329]">{maskedPhone}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-[#F6465D]/10 text-[#F6465D] text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* OTP Input */}
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-semibold border-2 border-[#EAECEF] rounded-lg focus:border-[#F0B90B] focus:outline-none transition-colors"
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Timer and Resend */}
          <div className="text-center">
            {!canResend ? (
              <p className="text-[#707A8A] text-sm">
                Resend code in{' '}
                <span className="font-medium text-[#1E2329]">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-[#F0B90B] hover:underline font-medium text-sm disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend code'}
              </button>
            )}
          </div>

          {/* Verify Button */}
          <Button
            onClick={() => handleVerify()}
            fullWidth
            size="xl"
            isLoading={isLoading}
            disabled={otp.some(digit => digit === '')}
            className="font-semibold text-base"
          >
            Verify
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-[#F0B90B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#707A8A]">Loading...</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
} 