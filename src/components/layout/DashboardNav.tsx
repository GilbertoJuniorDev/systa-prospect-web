import Link from 'next/link';
import { LogoutButton } from '@/components/features/auth/logout-button';

interface DashboardNavProps {
  userEmail: string;
}

export function DashboardNav({ userEmail }: DashboardNavProps) {
  const initials = userEmail.charAt(0).toUpperCase();

  return (
    <header
      className="sticky top-0 z-40 flex items-center px-8 h-14"
      style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid oklch(0 0 0 / 0.12)',
      }}
    >
      <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{
            background: 'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
          }}
        >
          S
        </div>
        <span
          className="font-bold text-base"
          style={{ color: 'var(--nav-fg)', letterSpacing: '-0.015em' }}
        >
          Systa
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: 'oklch(0.68 0.25 320)', color: '#fff' }}
        >
          {initials}
        </div>
        <span className="text-sm hidden sm:block" style={{ color: 'var(--nav-muted)' }}>
          {userEmail}
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}
