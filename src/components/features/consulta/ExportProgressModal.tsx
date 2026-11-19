'use client';

import * as React from 'react';
import { useState } from 'react';

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import { buttonVariants } from '@/components/ui/button';
import { Progress, ProgressIndicator, ProgressTrack } from '@/components/ui/progress';
import { useExportProgress } from '@/hooks/use-export-progress';
import { cn } from '@/lib/utils';

interface ExportProgressModalProps {
  isExporting: boolean;
  total: number;
  exportButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export function ExportProgressModal({ isExporting, total, exportButtonRef }: ExportProgressModalProps) {
  const [dismissed, setDismissed] = useState(false);
  const { progress, message } = useExportProgress(isExporting, total);

  // Reset the "hidden by user" state whenever a new export starts. Adjusting state
  // during render (rather than in an effect) is React's documented pattern for
  // reacting to a prop change — it avoids an extra flash of the previous dialog
  // state before an effect would get a chance to run.
  const [prevIsExporting, setPrevIsExporting] = useState(isExporting);
  if (isExporting !== prevIsExporting) {
    setPrevIsExporting(isExporting);
    if (isExporting) {
      setDismissed(false);
    }
  }

  const open = isExporting && !dismissed;

  return (
    <Dialog
      open={open}
      disablePointerDismissal
      onOpenChange={(_open, eventDetails) => {
        // The export already debited credits and is running synchronously on the
        // backend — only the explicit "hide" button should dismiss this dialog.
        // Escape / outside-press / focus-out are intentionally ignored so users
        // don't get the false impression that closing the dialog cancels anything.
        if (eventDetails.reason === 'close-press') {
          setDismissed(true);
        }
      }}
    >
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup initialFocus={false} finalFocus={exportButtonRef}>
          <DialogTitle>Exportando planilha…</DialogTitle>
          <p aria-live="polite" aria-atomic="true" className="mt-2 text-sm text-muted-foreground">
            {message}
          </p>
          <Progress value={Math.round(progress)} className="mt-4">
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
          <DialogClose className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mt-4')}>
            Ocultar e continuar em segundo plano
          </DialogClose>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
