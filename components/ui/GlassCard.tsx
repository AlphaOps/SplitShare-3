import clsx from 'clsx';

type Props = React.HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className, ...rest }: Props) {
  return (
    <div
      className={clsx(
        'glass rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/40',
        className
      )}
      {...rest}
    />
  );
}


