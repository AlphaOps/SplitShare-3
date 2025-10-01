'use client';

import { useRouter } from 'next/navigation';
import { SubscriptionDetails } from '@/components/subscriptions/SubscriptionDetails';
import { BottomNavBar } from '@/components/layout/BottomNavBar';

export default function SubscriptionDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Mock data - replace with actual API call
  const subscription = {
    id: params.id,
    serviceName: 'Netflix-Premium Plan- A',
    serviceLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    planName: 'Premium Plan',
    planType: 'standard' as const,
    status: 'active' as const,
    daysLeft: 30,
    totalEarnings: 0.0,
    billingImage: undefined,
    credentials: undefined,
    selectedDate: '2025-10-01'
  };

  const handleRaiseComplaint = () => {
    // Navigate to complaints page or open modal
    router.push(`/complaints/new?subscriptionId=${params.id}`);
  };

  const handleSendToVerification = async () => {
    // API call to send for verification
    try {
      const response = await fetch(`/api/subscriptions/${params.id}/verify`, {
        method: 'POST'
      });
      
      if (response.ok) {
        alert('Sent to verification successfully!');
      }
    } catch (error) {
      console.error('Error sending to verification:', error);
      alert('Failed to send to verification');
    }
  };

  return (
    <>
      <SubscriptionDetails
        subscription={subscription}
        onBack={() => router.back()}
        onRaiseComplaint={handleRaiseComplaint}
        onSendToVerification={handleSendToVerification}
      />
      <BottomNavBar />
    </>
  );
}
