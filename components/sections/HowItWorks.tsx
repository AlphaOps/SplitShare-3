import { GlassCard } from '@/components/ui/GlassCard';

const steps = [
  { title: 'Tell us your times', desc: 'Add available windows you like to watch.' },
  { title: 'Book smart slots', desc: 'AI allocates optimal, conflict-free slots.' },
  { title: 'Share unused time', desc: 'Inactivity auto-offers your time to others.' },
  { title: 'Earn credits', desc: 'Ad-supported swaps unlock free time.' }
];

export function HowItWorks() {
  return (
    <section id="how" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-bold">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <GlassCard key={s.title} className="h-full">
              <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
              <p className="text-muted">{s.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}


