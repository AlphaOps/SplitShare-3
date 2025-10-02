'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Loader,
  RefreshCw,
  Clock
} from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Auto-focus first input
  useEffect(() => {
    const firstInput = document.getElementById('otp-0');
    if (firstInput) firstInput.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    const lastInput = document.getElementById(`otp-${lastIndex}`);
    if (lastInput) lastInput.focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          otp: otpCode
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        
        // Store token if provided
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      }
    } catch (error) {
      console.error('Verification error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection or try again later.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setResending(true);
    setError('');

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTimeLeft(120);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        
        // Show success message briefly
        const successMsg = 'OTP resent successfully!';
        setError('');
        setTimeout(() => {
          const firstInput = document.getElementById('otp-0');
          if (firstInput) firstInput.focus();
        }, 100);
      } else {
        setError(data.error || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection or try again later.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (success) {
    return (
      <main className="relative min-h-screen bg-background">
        <NavBar />
        
        <div className="container mx-auto px-6 py-24 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <GlassCard className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <CheckCircle className="w-20 h-20 mx-auto text-secondary mb-6" />
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-4">Email Verified!</h2>
              <p className="text-muted mb-8">
                Your account has been activated. Redirecting to dashboard...
              </p>
              
              <div className="animate-pulse">
                <Loader className="w-6 h-6 mx-auto animate-spin text-primary" />
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              Verify Your <span className="text-primary">Email</span>
            </h1>
            <p className="text-muted">
              We've sent a 6-digit code to
            </p>
            <p className="text-primary font-semibold mt-2">
              {email || 'your email'}
            </p>
          </motion.div>

          {/* OTP Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard>
              <div className="space-y-6">
                {/* OTP Boxes */}
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-12 h-14 text-center text-2xl font-bold rounded-lg bg-white/5 border-2 border-white/10 focus:border-primary focus:outline-none transition-colors"
                    />
                  ))}
                </div>

                {/* Timer */}
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted" />
                  <span className={timeLeft < 30 ? 'text-accent' : 'text-muted'}>
                    Code expires in {formatTime(timeLeft)}
                  </span>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-500">{error}</span>
                  </motion.div>
                )}

                {/* Verify Button */}
                <NeonButton
                  onClick={handleVerify}
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin inline" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
                  )}
                </NeonButton>

                {/* Resend OTP */}
                <div className="text-center">
                  <button
                    onClick={handleResendOtp}
                    disabled={!canResend || resending}
                    className={`text-sm flex items-center justify-center gap-2 mx-auto ${
                      canResend
                        ? 'text-primary hover:underline'
                        : 'text-muted cursor-not-allowed'
                    }`}
                  >
                    <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                    {resending ? 'Resending...' : canResend ? 'Resend OTP' : 'Resend available after timer expires'}
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <GlassCard className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
              <h3 className="font-bold mb-3">Didn't receive the code?</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• Wait for the timer to expire and click "Resend OTP"</li>
                <li>• Contact support if the issue persists</li>
              </ul>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
