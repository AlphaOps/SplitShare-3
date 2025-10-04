'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Loader, ArrowRight } from 'lucide-react';
import { NavBar } from '@/components/layout/NavBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('Invalid payment session');
      setVerifying(false);
      return;
    }

    verifyPayment();
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const response = await fetch('/api/payments/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (data.success && data.paymentStatus === 'paid') {
        setVerifying(false);
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setError('Payment verification failed');
        setVerifying(false);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Failed to verify payment');
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <main className="relative min-h-screen bg-background">
        <NavBar />
        
        <div className="container mx-auto px-6 py-24 flex items-center justify-center min-h-[80vh]">
          <GlassCard className="text-center py-12 max-w-md w-full">
            <Loader className="w-16 h-16 mx-auto animate-spin text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-4">Verifying Payment...</h2>
            <p className="text-muted">Please wait while we confirm your payment</p>
          </GlassCard>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative min-h-screen bg-background">
        <NavBar />
        
        <div className="container mx-auto px-6 py-24 flex items-center justify-center min-h-[80vh]">
          <GlassCard className="text-center py-12 max-w-md w-full">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-4xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Payment Error</h2>
            <p className="text-muted mb-8">{error}</p>
            <NeonButton onClick={() => router.push('/pricing')}>
              Try Again
            </NeonButton>
          </GlassCard>
        </div>
      </main>
    );
  }

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
            
            <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
            <p className="text-muted mb-8">
              Your subscription has been activated. Redirecting to dashboard...
            </p>
            
            <div className="space-y-4">
              <div className="animate-pulse">
                <Loader className="w-6 h-6 mx-auto animate-spin text-primary" />
              </div>
              
              <NeonButton 
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </NeonButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <main className="relative min-h-screen bg-background flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </main>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
