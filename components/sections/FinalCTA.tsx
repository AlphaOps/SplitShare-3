import { NeonButton } from '@/components/ui/NeonButton';

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-6 py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/20 via-transparent to-secondary/20 blur-3xl" />
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-extrabold">Ready to Split and Save?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Join SplitShare and book your first smart slot in seconds. Futuristic streaming without the price tag.
        </p>
        <div className="mt-8">
          <NeonButton className="animate-glow">Get Started</NeonButton>
        </div>
      </div>
    </section>
  );
}


