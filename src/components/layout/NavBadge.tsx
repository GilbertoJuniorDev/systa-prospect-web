import { cn } from '@/lib/utils';

interface NavBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function NavBadge({ children, className }: NavBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide ml-1.5',
        className,
      )}
      style={{
        background: 'oklch(1 0 0 / 0.14)',
        color: 'var(--nav-fg)',
        border: '1px solid oklch(1 0 0 / 0.20)',
      }}
    >
      {children}
    </span>
  );
}
