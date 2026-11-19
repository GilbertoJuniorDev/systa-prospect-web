'use client';

import { useQuery } from '@tanstack/react-query';
import { Coins } from 'lucide-react';
import { getUserCredits } from '@/lib/credits-api';

export function CreditsBadge() {
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
        aria-label="Carregando saldo de registros"
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
      title="Saldo de registros"
    >
      <Coins className="size-3.5 shrink-0" aria-hidden="true" />
      <span>{(data?.balance ?? 0).toLocaleString('pt-BR')}</span>
    </div>
  );
}
