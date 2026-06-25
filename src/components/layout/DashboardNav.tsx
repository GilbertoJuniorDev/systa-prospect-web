'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/features/auth/logout-button';

const navItems = [
  { href: '/certificados', label: 'Certificados' },
  { href: '/repis', label: 'Repis' },
];

interface DashboardNavProps {
  userEmail: string;
}

export function DashboardNav({ userEmail }: DashboardNavProps) {
  const pathname = usePathname();
  const initials = userEmail.charAt(0).toUpperCase();

  return (
    <header
      className="sticky top-0 z-40 flex items-center gap-6 px-8 h-14"
      style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid oklch(0 0 0 / 0.12)',
      }}
    >
      {/* Brand */}
      <Link href="/certificados" className="flex items-center gap-2.5 shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{
            background:
              'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
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

      {/* Nav tabs */}
      <nav className="flex items-stretch gap-1 h-full ml-2">
        {navItems.map(({ href, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex items-center px-4 text-sm font-medium transition-colors"
              style={{
                color: active ? 'var(--nav-fg)' : 'var(--nav-muted)',
              }}
            >
              {label}
              {active && (
                <span
                  className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                  style={{ background: 'var(--nav-active-line)' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right side — user info */}
      <div className="ml-auto flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p
            className="text-xs font-semibold leading-none"
            style={{ color: 'var(--nav-fg)' }}
          >
            Joilson Pereira Advogados
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--nav-muted)' }}>
            Administrador
          </p>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: 'oklch(0.68 0.25 320)', color: '#fff' }}
        >
          {initials}
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
