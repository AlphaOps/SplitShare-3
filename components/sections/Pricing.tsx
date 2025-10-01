import { NeonButton } from '@/components/ui/NeonButton';
import { GlassCard } from '@/components/ui/GlassCard';

const tiers = [
  { name: 'Starter', price: 3, desc: 'Casual viewing, limited slots' },
  { name: 'Pro', price: 7, desc: 'Frequent viewing, priority slots' },
  { name: 'Elite', price: 12, desc: 'Unlimited swaps, top priority' }
];

export function Pricing() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-bold">Pricing</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <GlassCard key={t.name} className="flex flex-col items-start justify-between">
              <div>
                <h3 className="mb-1 text-xl font-semibold">{t.name}</h3>
                <p className="text-muted">{t.desc}</p>
              </div>
              <div className="mt-6 flex w-full items-center justify-between">
                <span className="text-3xl font-bold">${t.price}/mo</span>
                <NeonButton>Choose</NeonButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}


