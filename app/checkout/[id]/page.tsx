import { CheckoutFlow } from '@/components/checkout/CheckoutFlow';
import { BottomNavBar } from '@/components/layout/BottomNavBar';

type CheckoutPageProps = { params: { id: string } };

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = params;

  // Mock data - replace with actual API call
  const subscription = {
    id: id,
    name: 'Spotify-6 Members-Marcos',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    planType: 'Standard',
    members: 6,
    price: 38.17,
    platformFee: 10
  };

  const walletBalance = 0.0;

  return (
    <>
      <CheckoutFlow
        subscription={subscription}
        walletBalance={walletBalance}
      />
      <BottomNavBar />
    </>
  );
}
