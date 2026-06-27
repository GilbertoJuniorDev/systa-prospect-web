'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Coins, Loader2, CheckCircle2, XCircle, Zap, Star, Crown, ChevronDown, CalendarClock, Filter } from 'lucide-react';

import { getUserCredits, createStripeCheckout, type PackageId } from '@/lib/credits-api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── helpers ─────────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<string, string> = {
  REGISTER_BONUS: 'Bônus de Cadastro',
  CNPJ_QUERY: 'Consulta CNPJ',
  EXPORT: 'Exportação',
  STRIPE_PURCHASE: 'Compra de Créditos',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// ─── packages ────────────────────────────────────────────────────────────────

interface Package {
  id: PackageId;
  name: string;
  credits: number;
  price: string;
  priceNote: string;
  popular: boolean;
  Icon: React.ElementType;
  accentFrom: string;
  accentTo: string;
}

const PACKAGES: Package[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 50,
    price: 'R$ 29',
    priceNote: ',00',
    popular: false,
    Icon: Zap,
    accentFrom: 'oklch(0.65 0.15 220)',
    accentTo: 'oklch(0.52 0.18 250)',
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 150,
    price: 'R$ 59',
    priceNote: ',00',
    popular: true,
    Icon: Star,
    accentFrom: 'oklch(0.68 0.25 320)',
    accentTo: 'oklch(0.52 0.24 290)',
  },
  {
    id: 'max',
    name: 'Max',
    credits: 500,
    price: 'R$ 149',
    priceNote: ',00',
    popular: false,
    Icon: Crown,
    accentFrom: 'oklch(0.72 0.20 60)',
    accentTo: 'oklch(0.58 0.22 40)',
  },
];

// ─── sub-components ───────────────────────────────────────────────────────────

function BalanceSkeleton() {
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

function PackagesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border p-6 h-52 animate-pulse" style={{ background: 'var(--card)', borderColor: 'var(--border)' }} />
      ))}
    </div>
  );
}

function TransactionsSkeleton() {
  return (
    <div className="rounded-2xl border overflow-hidden animate-pulse" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
          <div className="w-24 h-4 rounded" style={{ background: 'var(--muted)' }} />
          <div className="w-36 h-4 rounded" style={{ background: 'var(--muted)' }} />
          <div className="flex-1 h-4 rounded" style={{ background: 'var(--muted)' }} />
          <div className="w-16 h-4 rounded" style={{ background: 'var(--muted)' }} />
          <div className="w-4 h-4 rounded" style={{ background: 'var(--muted)' }} />
        </div>
      ))}
    </div>
  );
}

// ─── export details accordion panel ──────────────────────────────────────────

function ExportDetails({ cache }: { cache: NonNullable<import('@/lib/credits-api').CreditTransaction['consultaCache']> }) {
  const { params, total, expiresAt } = cache;

  const SITUACAO_LABEL: Record<string, string> = {
    ativa: 'Ativa',
    inativa: 'Inativa',
    todas: 'Todas',
  };
  const MEI_LABEL: Record<string, string> = {
    sim: 'Sim',
    nao: 'Não',
    todos: 'Todos',
  };

  return (
    <div
      className="px-6 py-4 flex flex-col gap-3"
      style={{
        background: 'var(--muted)',
        borderLeft: '3px solid oklch(0.52 0.22 290)',
      }}
    >
      {/* Filtros header */}
      <div className="flex items-center gap-2">
        <Filter className="size-3.5 shrink-0" style={{ color: 'oklch(0.52 0.22 290)' }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
          Filtros da consulta
        </span>
      </div>

      {/* Chips de filtro */}
      <div className="flex flex-wrap gap-2">
        {/* UF */}
        <span
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
          style={{ background: 'oklch(0.94 0.025 290)', color: 'oklch(0.35 0.15 290)', border: '1px solid oklch(0.85 0.06 290)' }}
        >
          UF: {params.uf}
        </span>

        {/* Situação */}
        <span
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
          style={{ background: 'oklch(0.94 0.025 290)', color: 'oklch(0.35 0.15 290)', border: '1px solid oklch(0.85 0.06 290)' }}
        >
          Situação: {SITUACAO_LABEL[params.situacao] ?? params.situacao}
        </span>

        {/* MEI */}
        <span
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
          style={{ background: 'oklch(0.94 0.025 290)', color: 'oklch(0.35 0.15 290)', border: '1px solid oklch(0.85 0.06 290)' }}
        >
          MEI: {MEI_LABEL[params.mei] ?? params.mei}
        </span>

        {/* CNAEs */}
        {params.cnaes.map((cnae) => (
          <span
            key={cnae}
            className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-mono font-medium"
            style={{ background: 'oklch(0.90 0.04 290)', color: 'oklch(0.30 0.18 290)', border: '1px solid oklch(0.80 0.08 290)' }}
          >
            CNAE {cnae}
          </span>
        ))}
      </div>

      {/* Metadados */}
      <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
        <span>
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
            {total.toLocaleString('pt-BR')}
          </span>{' '}
          registros exportados
        </span>

        <span className="flex items-center gap-1">
          <CalendarClock className="size-3.5" style={{ color: 'oklch(0.52 0.22 290)' }} />
          Cache válido até{' '}
          <span className="font-medium" style={{ color: 'var(--foreground)' }}>
            {new Date(expiresAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </span>
        </span>
      </div>
    </div>
  );
}

// ─── main page content (uses useSearchParams, wrapped in Suspense below) ─────

function CreditsPageContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const canceled = searchParams.get('canceled') === 'true';

  const [loadingPkg, setLoadingPkg] = useState<PackageId | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
          Créditos
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Gerencie e compre créditos para usar as funcionalidades da plataforma.
        </p>
      </div>

      {/* ── stripe feedback banners ── */}
      {success && (
        <div
          className="flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-medium"
          style={{ background: 'oklch(0.92 0.08 142)', color: 'oklch(0.25 0.12 142)', border: '1px solid oklch(0.78 0.14 142)' }}
          role="alert"
        >
          <CheckCircle2 className="shrink-0 size-5" />
          Compra realizada com sucesso! Seus créditos foram adicionados.
        </div>
      )}
      {canceled && (
        <div
          className="flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-medium"
          style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
          role="status"
        >
          <XCircle className="shrink-0 size-5" />
          Compra cancelada. Nenhum valor foi cobrado.
        </div>
      )}

      {/* ─────────────────── BALANCE SECTION ─────────────────── */}
      <section aria-labelledby="balance-heading">
        <h2 id="balance-heading" className="text-base font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
          Saldo Atual
        </h2>

        {isLoading ? (
          <BalanceSkeleton />
        ) : isError ? (
          <div className="rounded-2xl border p-8 text-sm" style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            Não foi possível carregar o saldo. Tente recarregar a página.
          </div>
        ) : (
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
                  Seu saldo de créditos
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
                {(data?.balance ?? 0).toLocaleString('pt-BR')}
              </div>
              <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
                créditos disponíveis
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ─────────────────── PACKAGES SECTION ─────────────────── */}
      <section aria-labelledby="packages-heading">
        <h2 id="packages-heading" className="text-base font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
          Comprar Créditos
        </h2>

        {isLoading ? (
          <PackagesSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PACKAGES.map((pkg) => {
              const isPro = pkg.popular;
              const isLoading = loadingPkg === pkg.id;
              return (
                <div
                  key={pkg.id}
                  className={cn(
                    'relative rounded-2xl flex flex-col transition-transform duration-200 hover:-translate-y-0.5',
                    isPro
                      ? 'ring-2 shadow-lg'
                      : 'border shadow-sm',
                  )}
                  style={{
                    background: isPro
                      ? 'linear-gradient(160deg, oklch(0.26 0.06 290), oklch(0.20 0.05 290))'
                      : 'var(--card)',
                    borderColor: isPro ? undefined : 'var(--border)',
                    ringColor: isPro ? 'oklch(0.68 0.25 320)' : undefined,
                    boxShadow: isPro
                      ? '0 4px 24px oklch(0.52 0.24 290 / 0.30), 0 0 0 2px oklch(0.68 0.25 320)'
                      : '0 1px 4px oklch(0 0 0 / 0.06)',
                  } as React.CSSProperties}
                >
                  {/* most popular badge */}
                  {isPro && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
                        style={{
                          background: 'linear-gradient(90deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
                          color: '#fff',
                          boxShadow: '0 2px 8px oklch(0.52 0.24 290 / 0.4)',
                        }}
                      >
                        Mais Popular
                      </span>
                    </div>
                  )}

                  <div className="p-6 pt-8 flex flex-col flex-1">
                    {/* icon + name */}
                    <div className="flex items-center gap-2.5 mb-5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `linear-gradient(135deg, ${pkg.accentFrom}, ${pkg.accentTo})` }}
                      >
                        <pkg.Icon className="size-4.5 text-white" />
                      </div>
                      <span
                        className="text-base font-bold"
                        style={{ color: isPro ? 'oklch(0.97 0.02 290)' : 'var(--foreground)' }}
                      >
                        {pkg.name}
                      </span>
                    </div>

                    {/* credits */}
                    <div className="mb-1">
                      <span
                        className="text-4xl font-extrabold tabular-nums leading-none"
                        style={{
                          color: isPro ? 'oklch(0.95 0.04 290)' : 'var(--foreground)',
                          letterSpacing: '-0.03em',
                        }}
                      >
                        {pkg.credits.toLocaleString('pt-BR')}
                      </span>
                      <span
                        className="text-sm ml-1.5"
                        style={{ color: isPro ? 'oklch(0.70 0.06 290)' : 'var(--muted-foreground)' }}
                      >
                        créditos
                      </span>
                    </div>

                    {/* price */}
                    <div className="mt-3 mb-6">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: isPro ? 'oklch(0.88 0.08 290)' : 'var(--foreground)' }}
                      >
                        {pkg.price}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: isPro ? 'oklch(0.65 0.06 290)' : 'var(--muted-foreground)' }}
                      >
                        {pkg.priceNote}
                      </span>
                    </div>

                    {/* buy button */}
                    <Button
                      className={cn(
                        'w-full mt-auto h-10 text-sm font-semibold rounded-xl transition-all duration-150',
                        isPro && 'border-0',
                      )}
                      style={
                        isPro
                          ? {
                              background: 'linear-gradient(90deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
                              color: '#fff',
                              boxShadow: '0 2px 8px oklch(0.52 0.24 290 / 0.4)',
                            }
                          : undefined
                      }
                      variant={isPro ? 'default' : 'outline'}
                      disabled={loadingPkg !== null}
                      onClick={() => handleBuy(pkg.id)}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin mr-2" />
                          Aguarde...
                        </>
                      ) : (
                        'Comprar'
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ─────────────────── TRANSACTIONS SECTION ─────────────────── */}
      <section aria-labelledby="transactions-heading" className="pb-12">
        <h2 id="transactions-heading" className="text-base font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
          Histórico de Transações
        </h2>

        {isLoading ? (
          <TransactionsSkeleton />
        ) : isError ? (
          <div
            className="rounded-2xl border p-8 text-sm"
            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            Não foi possível carregar o histórico.
          </div>
        ) : !data?.transactions?.length ? (
          <div
            className="rounded-2xl border p-12 flex flex-col items-center gap-3 text-center"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <Coins className="size-10 opacity-20" style={{ color: 'var(--foreground)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
              Nenhuma transação ainda.
            </p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>
              Suas movimentações de créditos aparecerão aqui.
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 2px 8px oklch(0 0 0 / 0.04)' }}
          >
            {/* table header */}
            <div
              className="hidden md:grid gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b"
              style={{
                gridTemplateColumns: '140px 1fr 1fr 100px 28px',
                color: 'var(--muted-foreground)',
                borderColor: 'var(--border)',
                background: 'var(--muted)',
              }}
            >
              <span>Data</span>
              <span>Tipo</span>
              <span>Descrição</span>
              <span className="text-right">Créditos</span>
              <span />
            </div>

            {/* rows */}
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {data.transactions.map((tx) => {
                const positive = tx.amount > 0;
                const hasDetails = tx.consultaCache !== null;
                const isExpanded = expandedId === tx.id;

                return (
                  <div key={tx.id}>
                    {/* Mobile card layout */}
                    <div
                      className={cn(
                        'md:hidden flex items-center gap-3 px-4 py-3 transition-colors',
                        hasDetails ? 'cursor-pointer hover:bg-muted/40' : 'hover:bg-muted/30',
                        isExpanded && 'bg-muted/20',
                      )}
                      onClick={() => hasDetails && setExpandedId(isExpanded ? null : tx.id)}
                      role={hasDetails ? 'button' : undefined}
                      aria-expanded={hasDetails ? isExpanded : undefined}
                      tabIndex={hasDetails ? 0 : undefined}
                      onKeyDown={hasDetails ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(isExpanded ? null : tx.id); } } : undefined}
                    >
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="font-medium text-sm truncate" style={{ color: 'var(--foreground)' }}>
                          {TYPE_LABEL[tx.type] ?? tx.type}
                        </span>
                        <span className="text-xs tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
                          {formatDate(tx.createdAt)}{tx.description ? ` · ${tx.description}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="font-bold tabular-nums text-sm"
                          style={{ color: positive ? 'oklch(0.52 0.18 142)' : 'oklch(0.58 0.22 27)' }}
                        >
                          {positive ? '+' : ''}{tx.amount.toLocaleString('pt-BR')}
                        </span>
                        {hasDetails && (
                          <ChevronDown
                            className="size-4 transition-transform duration-200"
                            style={{ color: 'var(--muted-foreground)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Desktop grid layout */}
                    <div
                      className={cn(
                        'hidden md:grid gap-4 px-6 py-4 items-center text-sm transition-colors',
                        hasDetails ? 'cursor-pointer hover:bg-muted/40' : 'hover:bg-muted/30',
                        isExpanded && 'bg-muted/20',
                      )}
                      style={{ gridTemplateColumns: '140px 1fr 1fr 100px 28px' }}
                      onClick={() => hasDetails && setExpandedId(isExpanded ? null : tx.id)}
                      role={hasDetails ? 'button' : undefined}
                      aria-expanded={hasDetails ? isExpanded : undefined}
                      tabIndex={hasDetails ? 0 : undefined}
                      onKeyDown={hasDetails ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(isExpanded ? null : tx.id); } } : undefined}
                    >
                      {/* date */}
                      <span className="tabular-nums font-medium text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {formatDate(tx.createdAt)}
                      </span>

                      {/* type */}
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                        {TYPE_LABEL[tx.type] ?? tx.type}
                      </span>

                      {/* description */}
                      <span style={{ color: 'var(--muted-foreground)' }}>
                        {tx.description ?? '—'}
                      </span>

                      {/* amount */}
                      <div className="flex items-center justify-end gap-1.5">
                        <span
                          className="font-bold tabular-nums text-sm"
                          style={{ color: positive ? 'oklch(0.52 0.18 142)' : 'oklch(0.58 0.22 27)' }}
                        >
                          {positive ? '+' : ''}{tx.amount.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      {/* chevron */}
                      <div className="flex items-center justify-center">
                        {hasDetails && (
                          <ChevronDown
                            className="size-4 transition-transform duration-200"
                            style={{
                              color: 'var(--muted-foreground)',
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* painel expansível */}
                    <AnimatePresence initial={false}>
                      {isExpanded && tx.consultaCache && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <ExportDetails cache={tx.consultaCache} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
          <BalanceSkeleton />
          <PackagesSkeleton />
        </div>
      }
    >
      <CreditsPageContent />
    </Suspense>
  );
}
