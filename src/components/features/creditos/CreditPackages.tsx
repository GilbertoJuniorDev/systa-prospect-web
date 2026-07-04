import { Loader2, Gift } from 'lucide-react';

import type { PackageId } from '@/lib/credits-api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PACKAGES } from '@/components/features/creditos/PackagesData';

export function CreditPackagesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border p-6 h-52 animate-pulse" style={{ background: 'var(--card)', borderColor: 'var(--border)' }} />
      ))}
    </div>
  );
}

interface CreditPackagesProps {
  isLoading: boolean;
  loadingPkg: PackageId | null;
  onBuy: (id: PackageId) => void;
}

export function CreditPackages({ isLoading, loadingPkg, onBuy }: CreditPackagesProps) {
  if (isLoading) {
    return <CreditPackagesSkeleton />;
  }

  return (
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

              {/* records */}
              <div className="mb-1">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span
                    className="text-4xl font-extrabold tabular-nums leading-none"
                    style={{
                      color: isPro ? 'oklch(0.95 0.04 290)' : 'var(--foreground)',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {pkg.records.toLocaleString('pt-BR')}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: isPro ? 'oklch(0.70 0.06 290)' : 'var(--muted-foreground)' }}
                  >
                    registros
                  </span>
                </div>

                {/* bonus callout — the "Max" plan's commercial hook */}
                {pkg.bonus > 0 && (
                  <div className="mt-2.5 flex flex-col gap-1">
                    <span
                      className="inline-flex items-center gap-1 self-start text-[11px] font-bold px-2.5 py-1 rounded-full text-white whitespace-nowrap"
                      style={{
                        background: `linear-gradient(90deg, ${pkg.accentFrom}, ${pkg.accentTo})`,
                        boxShadow: '0 2px 8px oklch(0 0 0 / 0.18)',
                      }}
                    >
                      <Gift className="size-3" aria-hidden="true" />
                      + {pkg.bonus.toLocaleString('pt-BR')} de bônus
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: isPro ? 'oklch(0.65 0.06 290)' : 'var(--muted-foreground)' }}
                    >
                      Total creditado: {pkg.credits.toLocaleString('pt-BR')} registros
                    </span>
                  </div>
                )}
              </div>

              {/* price */}
              <div className="mt-3 mb-1">
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
              <p
                className="text-xs mb-6"
                style={{ color: isPro ? 'oklch(0.65 0.06 290)' : 'var(--muted-foreground)' }}
              >
                {pkg.perRecord}
              </p>

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
                onClick={() => onBuy(pkg.id)}
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
  );
}
