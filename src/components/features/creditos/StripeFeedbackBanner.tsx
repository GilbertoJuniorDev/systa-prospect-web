import { CheckCircle2, XCircle } from 'lucide-react';

interface StripeFeedbackBannerProps {
  success: boolean;
  canceled: boolean;
}

export function StripeFeedbackBanner({ success, canceled }: StripeFeedbackBannerProps) {
  if (!success && !canceled) return null;

  return (
    <>
      {success && (
        <div
          className="flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-medium"
          style={{ background: 'oklch(0.92 0.08 142)', color: 'oklch(0.25 0.12 142)', border: '1px solid oklch(0.78 0.14 142)' }}
          role="alert"
        >
          <CheckCircle2 className="shrink-0 size-5" />
          Compra realizada com sucesso! Seus registros foram adicionados.
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
    </>
  );
}
