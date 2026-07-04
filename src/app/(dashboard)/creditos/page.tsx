'use client';

import { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { getUserCredits, createStripeCheckout, type PackageId } from '@/lib/credits-api';
import { StripeFeedbackBanner } from '@/components/features/creditos/StripeFeedbackBanner';
import { BalanceCard, BalanceCardSkeleton } from '@/components/features/creditos/BalanceCard';
import { CreditPackages, CreditPackagesSkeleton } from '@/components/features/creditos/CreditPackages';
import { TransactionHistory } from '@/components/features/creditos/TransactionHistory';

// ─── main page content (uses useSearchParams, wrapped in Suspense below) ─────

function CreditsPageContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const canceled = searchParams.get('canceled') === 'true';

  const [loadingPkg, setLoadingPkg] = useState<PackageId | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['user-credits'],
    queryFn: getUserCredits,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  async function handleBuy(pkgId: PackageId) {
    setLoadingPkg(pkgId);
    try {
      const { url } = await createStripeCheckout(pkgId);
      if (url && url.startsWith('http')) {
        window.location.href = url;
      }
    } catch {
      // silent — in production you'd show a toast
    } finally {
      setLoadingPkg(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto pt-8 flex flex-col gap-10">

      {/* ── page title ── */}
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}
        >
          Registros
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Gerencie e compre registros para usar as funcionalidades da plataforma.
        </p>
      </div>

      {/* ── stripe feedback banners ── */}
      <StripeFeedbackBanner success={success} canceled={canceled} />

      {/* ─────────────────── BALANCE SECTION ─────────────────── */}
      <section aria-labelledby="balance-heading">
        <h2 id="balance-heading" className="text-base font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
          Saldo Atual
        </h2>
        <BalanceCard balance={data?.balance ?? 0} isLoading={isLoading} isError={isError} />
      </section>

      {/* ─────────────────── PACKAGES SECTION ─────────────────── */}
      <section aria-labelledby="packages-heading">
        <h2 id="packages-heading" className="text-base font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
          Comprar Registros
        </h2>
        <CreditPackages isLoading={isLoading} loadingPkg={loadingPkg} onBuy={handleBuy} />
      </section>

      {/* ─────────────────── TRANSACTIONS SECTION ─────────────────── */}
      <section aria-labelledby="transactions-heading" className="pb-12">
        <h2 id="transactions-heading" className="text-base font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
          Histórico de Transações
        </h2>
        <TransactionHistory transactions={data?.transactions ?? []} isLoading={isLoading} isError={isError} />
      </section>
    </div>
  );
}

// ─── exported page (Suspense boundary for useSearchParams) ───────────────────

export default function CreditosPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto pt-8 flex flex-col gap-10">
          <div>
            <div className="w-32 h-8 rounded-lg animate-pulse" style={{ background: 'var(--muted)' }} />
            <div className="w-72 h-4 rounded mt-2 animate-pulse" style={{ background: 'var(--muted)' }} />
          </div>
          <BalanceCardSkeleton />
          <CreditPackagesSkeleton />
        </div>
      }
    >
      <CreditsPageContent />
    </Suspense>
  );
}
