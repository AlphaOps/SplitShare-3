'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { NeonButton } from '@/components/ui/NeonButton';
import { Loader } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  subscriptionId: string;
  subscriptionName: string;
  price: number;
  email?: string;
}

export function StripeCheckout({ subscriptionId, subscriptionName, price, email }: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      // Create checkout session
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          subscriptionName,
          price,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Redirect to checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <NeonButton
        onClick={handleCheckout}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin inline" />
            Processing...
          </>
        ) : (
          <>
            Pay ${price.toFixed(2)} with Stripe
          </>
        )}
      </NeonButton>
      
      <p className="text-xs text-muted text-center">
        Secure payment powered by Stripe
      </p>
    </div>
  );
}
