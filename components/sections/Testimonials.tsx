import { GlassCard } from '@/components/ui/GlassCard';

const testimonials = [
  { name: 'Ari', quote: 'Saved 60% monthly and never fight over screens again.' },
  { name: 'Jae', quote: 'The AI suggestions nailed my anime + drama bundle.' },
  { name: 'Mina', quote: 'Swapped slots for ads and watched free this month!' }
];

export function Testimonials() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-bold">What users say</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <GlassCard key={t.name}>
              <p className="text-lg">“{t.quote}”</p>
              <p className="mt-4 text-sm text-muted">— {t.name}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}


