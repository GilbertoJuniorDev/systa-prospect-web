'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Coins, ChevronDown } from 'lucide-react';

import type { CreditTransaction } from '@/lib/credits-api';
import { TYPE_LABEL, formatDateBR } from '@/lib/consulta-format';
import { cn } from '@/lib/utils';
import { ExportDetails } from '@/components/features/creditos/ExportDetails';

export function TransactionHistorySkeleton() {
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

interface TransactionHistoryProps {
  transactions: CreditTransaction[];
  isLoading: boolean;
  isError: boolean;
}

export function TransactionHistory({ transactions, isLoading, isError }: TransactionHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return <TransactionHistorySkeleton />;
  }

  if (isError) {
    return (
      <div
        className="rounded-2xl border p-8 text-sm"
        style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
      >
        Não foi possível carregar o histórico.
      </div>
    );
  }

  if (!transactions?.length) {
    return (
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
    );
  }

  return (
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
        {transactions.map((tx) => {
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
                    {formatDateBR(tx.createdAt)}{tx.description ? ` · ${tx.description}` : ''}
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
                  {formatDateBR(tx.createdAt)}
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
  );
}
