import { History } from 'lucide-react';
import Link from 'next/link';

export function EmptyConsultasState() {
  return (
    <div
      className="rounded-2xl border p-16 flex flex-col items-center gap-4 text-center"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <History
        className="size-14 opacity-15"
        style={{ color: 'var(--foreground)' }}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
          Nenhuma consulta exportada ainda
        </p>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Suas exportações aparecerão aqui e ficarão disponíveis por 30 dias.
        </p>
      </div>
      <Link
        href="/consulta"
        className="mt-2 inline-flex items-center justify-center rounded-xl h-9 px-5 text-sm font-medium transition-colors"
        style={{
          background: 'oklch(0.52 0.22 290)',
          color: '#fff',
        }}
      >
        Fazer primeira consulta
      </Link>
    </div>
  );
}
