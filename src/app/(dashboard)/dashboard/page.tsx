import { getSession } from '@/lib/session';

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="max-w-2xl mx-auto pt-16 flex flex-col gap-6">
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}
        >
          Bem-vindo ao Systa
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Logado como <strong>{session?.email}</strong>
        </p>
      </div>

      <div
        className="rounded-2xl border p-8"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--card)',
          boxShadow: '0 2px 8px oklch(0 0 0 / 0.04)',
        }}
      >
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Plataforma de consulta de dados empresariais via CNPJ. Use o menu acima para acessar
          as funcionalidades disponíveis.
        </p>
      </div>
    </div>
  );
}
