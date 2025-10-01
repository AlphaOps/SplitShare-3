import clsx from 'clsx';
import Link from 'next/link';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'accent';
  href?: string;
};

export function NeonButton({ className, children, variant = 'primary', href, ...rest }: Props) {
  const color = variant === 'primary' ? 'primary' : variant === 'secondary' ? 'secondary' : 'accent';
  const glow = variant === 'primary' ? 'shadow-glow' : variant === 'secondary' ? 'shadow-glowGreen' : 'shadow-glowGold';

  const buttonClasses = clsx(
    'relative rounded-full px-6 py-3 font-medium text-text transition-transform hover:scale-105 active:scale-95 inline-block text-center',
    `bg-${color}`,
    glow,
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/60 focus:ring-offset-background',
    className
  );

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} {...rest}>
      {children}
    </button>
  );
}


