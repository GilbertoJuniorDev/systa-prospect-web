'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, Coins, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExportProgressModal } from '@/components/features/consulta/ExportProgressModal';
import { ExportConfirmDialog } from '@/components/features/consulta/ExportConfirmDialog';

interface ConsultaResultCardProps {
  total: number;
  balance: number | undefined;
  isExporting: boolean;
  canExport: boolean;
  onRequestExport: () => void;
  exportError: string | null;
  exportInsufficientCredits: { required: number; balance: number } | null;
  showExportConfirm: boolean;
  exportSummary: { label: string; value: string }[];
  onCancelExport: () => void;
  onConfirmExport: () => void;
}

export function ConsultaResultCard({
  total,
  balance,
  isExporting,
  canExport,
  onRequestExport,
  exportError,
  exportInsufficientCredits,
  showExportConfirm,
  exportSummary,
  onCancelExport,
  onConfirmExport,
}: ConsultaResultCardProps) {
  const exportButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Resultado da consulta</CardTitle>
        </CardHeader>

        <CardContent>
          {total === 0 ? (
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Nenhum estabelecimento encontrado para os filtros selecionados.
            </p>
          ) : (
            <div className="space-y-4">
              {/* Result count */}
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }} aria-live="polite">
                <span
                  className="text-4xl font-bold tabular-nums"
                  style={{ color: 'oklch(0.52 0.22 290)' }}
                >
                  {total.toLocaleString('pt-BR')}
                </span>{' '}
                estabelecimento{total !== 1 ? 's' : ''} encontrado
                {total !== 1 ? 's' : ''}.
                <span className="ml-2 text-muted-foreground">
                  Clique em &ldquo;Exportar XLSX&rdquo; para baixar.
                </span>
              </p>

              {/* Estimated export cost */}
              <span
                className="inline-flex items-center gap-1.5 text-xs"
                style={{ color: 'var(--muted-foreground)' }}
                aria-label={`Exportar ${total.toLocaleString('pt-BR')} registros consumirá ${total.toLocaleString('pt-BR')} do seu saldo`}
              >
                <Coins className="size-3 shrink-0" aria-hidden="true" />
                Exportar ~{total.toLocaleString('pt-BR')} registros consumirá{' '}
                <strong>{total.toLocaleString('pt-BR')}</strong>{' '}
                registro{total !== 1 ? 's' : ''} do seu saldo
              </span>

              {/* Balance badge */}
              {balance !== undefined && (
                <div>
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: 'oklch(0.94 0.025 290)',
                      color: 'oklch(0.40 0.12 290)',
                      border: '1px solid oklch(0.85 0.06 290)',
                    }}
                    aria-label={`Saldo atual: ${balance} registros`}
                  >
                    <Coins className="size-3" aria-hidden="true" />
                    Saldo: {balance.toLocaleString('pt-BR')} registros
                  </span>
                </div>
              )}

              {/* Export button */}
              <div>
                <Button
                  ref={exportButtonRef}
                  type="button"
                  variant="default"
                  size="lg"
                  disabled={!canExport}
                  onClick={onRequestExport}
                  className="gap-2"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Exportando…
                    </>
                  ) : (
                    <>
                      <Download className="size-4" />
                      Exportar XLSX
                    </>
                  )}
                </Button>
              </div>

              <ExportProgressModal
                isExporting={isExporting}
                total={total}
                exportButtonRef={exportButtonRef}
              />

              <ExportConfirmDialog
                open={showExportConfirm}
                total={total}
                balance={balance}
                filterSummary={exportSummary}
                onCancel={onCancelExport}
                onConfirm={onConfirmExport}
              />

              {/* Export error — generic */}
              {exportError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {exportError}
                </motion.p>
              )}

              {/* Export error — 402 insufficient credits */}
              {exportInsufficientCredits && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border p-4"
                  style={{
                    background: 'oklch(0.97 0.025 60)',
                    borderColor: 'oklch(0.80 0.10 60)',
                  }}
                  role="alert"
                  aria-live="polite"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className="size-5 shrink-0 mt-0.5"
                      style={{ color: 'oklch(0.55 0.18 60)' }}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'oklch(0.35 0.14 60)' }}>
                        Registros insuficientes para exportar
                      </p>
                      <p className="mt-0.5 text-sm" style={{ color: 'oklch(0.45 0.10 60)' }}>
                        {exportInsufficientCredits.required > 0
                          ? `Você precisaria de ${exportInsufficientCredits.required.toLocaleString('pt-BR')} registros, mas possui apenas ${exportInsufficientCredits.balance.toLocaleString('pt-BR')}.`
                          : 'Você não tem registros suficientes para exportar esta consulta.'}
                      </p>
                      <Link
                        href="/creditos"
                        className="mt-2 inline-flex items-center gap-1 text-sm font-medium underline-offset-2 hover:underline transition-colors"
                        style={{ color: 'oklch(0.45 0.18 290)' }}
                      >
                        Comprar registros
                        <ExternalLink className="size-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
