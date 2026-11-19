import { Coins } from 'lucide-react';

export function BalanceCardSkeleton() {
  return (
    <div className="rounded-2xl border p-8 animate-pulse" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl" style={{ background: 'var(--muted)' }} />
        <div className="w-32 h-5 rounded-md" style={{ background: 'var(--muted)' }} />
      </div>
      <div className="w-40 h-16 rounded-xl mb-2" style={{ background: 'var(--muted)' }} />
      <div className="w-48 h-4 rounded-md" style={{ background: 'var(--muted)' }} />
    </div>
  );
}

interface BalanceCardProps {
  balance: number;
  isLoading: boolean;
  isError: boolean;
}

export function BalanceCard({ balance, isLoading, isError }: BalanceCardProps) {
  if (isLoading) {
    return <BalanceCardSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl border p-8 text-sm" style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
        Não foi possível carregar o saldo. Tente recarregar a página.
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border p-5 sm:p-8 relative overflow-hidden"
      style={{ background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 2px 12px oklch(0 0 0 / 0.06)' }}
    >
      {/* decorative gradient blob */}
      <div
        className="absolute -right-12 -top-12 w-56 h-56 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, oklch(0.68 0.25 320), oklch(0.52 0.24 290))' }}
        aria-hidden="true"
      />

      <div className="relative">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))' }}
          >
            <Coins className="size-5 text-white" />
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
            Seu saldo de registros
          </span>
          {/* status badge */}
          <span
            className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: 'oklch(0.94 0.025 290)',
              color: 'oklch(0.35 0.15 290)',
              border: '1px solid oklch(0.85 0.06 290)',
            }}
          >
            Conta Gratuita
          </span>
        </div>

        <div
          className="text-4xl sm:text-6xl font-extrabold tabular-nums mb-1 leading-none"
          style={{ color: 'var(--foreground)', letterSpacing: '-0.04em' }}
        >
          {balance.toLocaleString('pt-BR')}
        </div>
        <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
          registros disponíveis
        </p>
      </div>
    </div>
  );
}
