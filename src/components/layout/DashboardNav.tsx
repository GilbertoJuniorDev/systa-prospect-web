'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Coins } from 'lucide-react';
import { LogoutButton } from '@/components/features/auth/logout-button';
import { NavLinks } from './NavLinks';
import { getUserCredits } from '@/lib/credits-api';

interface DashboardNavProps {
  userEmail: string;
}

function CreditsBadge() {
  const { data, isLoading } = useQuery({
    queryKey: ['user-credits'],
    queryFn: getUserCredits,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full animate-pulse"
        style={{ background: 'oklch(1 0 0 / 0.10)', minWidth: '56px', height: '26px' }}
        aria-label="Carregando saldo de créditos"
      />
    );
  }

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tabular-nums shrink-0"
      style={{
        background: 'oklch(1 0 0 / 0.12)',
        color: 'var(--nav-fg)',
        border: '1px solid oklch(1 0 0 / 0.18)',
      }}
      title="Saldo de créditos"
    >
      <Coins className="size-3.5 shrink-0" aria-hidden="true" />
      <span>{(data?.balance ?? 0).toLocaleString('pt-BR')}</span>
    </div>
  );
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

      <NavLinks />

      <div className="ml-auto flex items-center gap-3">
        <CreditsBadge />

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
