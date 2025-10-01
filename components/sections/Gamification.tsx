import { GlassCard } from '@/components/ui/GlassCard';

export function Gamification() {
  return (
    <section id="gamification" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-3xl font-bold">Gamification</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <GlassCard>
            <h3 className="mb-2 text-xl font-semibold">Credits</h3>
            <p className="text-muted">Earn by sharing and swapping ad-supported slots.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="mb-2 text-xl font-semibold">Badges</h3>
            <p className="text-muted">Unlock streaks and category mastery achievements.</p>
          </GlassCard>
          <GlassCard>
            <h3 className="mb-2 text-xl font-semibold">Leaderboard</h3>
            <p className="text-muted">Top savers and sharers this week.</p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}


