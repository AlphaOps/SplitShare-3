import { GlassCard } from '@/components/ui/GlassCard';

export function Comparison() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-bold">Why SplitShare</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <GlassCard>
            <h3 className="mb-2 text-xl font-semibold">Traditional</h3>
            <ul className="list-inside list-disc text-muted">
              <li>Pay full price per platform</li>
              <li>No dynamic sharing</li>
              <li>Unused time is wasted</li>
            </ul>
          </GlassCard>
          <GlassCard>
            <h3 className="mb-2 text-xl font-semibold">SplitShare</h3>
            <ul className="list-inside list-disc text-muted">
              <li>Pay only for time you use</li>
              <li>AI-optimized slot sharing</li>
              <li>Ad-supported free swaps</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}


