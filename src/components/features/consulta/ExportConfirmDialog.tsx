'use client';

import { Coins, Download, X } from 'lucide-react';

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExportConfirmDialogProps {
  open: boolean;
  total: number;
  balance: number | undefined;
  filterSummary: { label: string; value: string }[];
  onCancel: () => void;
  onConfirm: () => void;
}

export function ExportConfirmDialog({
  open,
  total,
  balance,
  filterSummary,
  onCancel,
  onConfirm,
}: ExportConfirmDialogProps) {
  const remaining = balance !== undefined ? balance - total : undefined;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel();
      }}
    >
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="max-w-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle>Confirmar exportação</DialogTitle>
              <DialogDescription>
                Revise os filtros abaixo — esta ação consome registros do seu saldo e não pode ser desfeita.
              </DialogDescription>
            </div>
            <DialogClose
              className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Fechar"
            >
              <X className="size-4" />
            </DialogClose>
          </div>

          <dl className="mt-4 space-y-2 rounded-lg border border-border bg-muted/40 p-3 text-sm">
            {filterSummary.map((row) => (
              <div key={row.label} className="flex justify-between gap-3">
                <dt className="shrink-0 font-medium text-muted-foreground">{row.label}</dt>
                <dd className="text-right text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div
            className="mt-4 rounded-lg border p-3"
            style={{
              background: 'oklch(0.94 0.025 290)',
              borderColor: 'oklch(0.85 0.06 290)',
            }}
          >
            <div className="flex items-center gap-2 text-sm" style={{ color: 'oklch(0.40 0.12 290)' }}>
              <Coins className="size-4 shrink-0" aria-hidden="true" />
              <span>
                Esta exportação consumirá{' '}
                <strong className="tabular-nums">{total.toLocaleString('pt-BR')}</strong>{' '}
                registro{total !== 1 ? 's' : ''} do seu saldo
                {balance !== undefined && (
                  <>
                    {' '}de <strong className="tabular-nums">{balance.toLocaleString('pt-BR')}</strong>
                    {remaining !== undefined && (
                      <>, restando <strong className="tabular-nums">{remaining.toLocaleString('pt-BR')}</strong></>
                    )}
                  </>
                )}
                .
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <DialogClose className={cn(buttonVariants({ variant: 'ghost' }))}>
              Cancelar
            </DialogClose>
            <Button type="button" variant="default" className="gap-2" onClick={onConfirm}>
              <Download className="size-4" />
              Confirmar e exportar
            </Button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
