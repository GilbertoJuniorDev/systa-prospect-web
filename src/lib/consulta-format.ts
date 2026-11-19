// Labels e formatadores compartilhados das consultas/transações de crédito.
// Centraliza o que antes estava duplicado em creditos/page.tsx e minhas-consultas/page.tsx.

export const SITUACAO_LABEL: Record<string, string> = {
  ativa: 'Ativa',
  inativa: 'Inativa',
  todas: 'Todas',
};

export const MEI_LABEL: Record<string, string> = {
  sim: 'Sim',
  nao: 'Não',
  todos: 'Todos',
};

export const TYPE_LABEL: Record<string, string> = {
  REGISTER_BONUS: 'Bônus de Cadastro',
  CNPJ_QUERY: 'Consulta CNPJ',
  EXPORT: 'Exportação',
  STRIPE_PURCHASE: 'Compra de Registros',
};

export function formatDateBR(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface AberturaRangeParams {
  dataAberturaDeMes?: number;
  dataAberturaDeAno?: number;
  dataAberturaAteMes?: number;
  dataAberturaAteAno?: number;
}

export function formatAberturaRange(params: AberturaRangeParams): string | null {
  const de =
    params.dataAberturaDeMes && params.dataAberturaDeAno
      ? `${String(params.dataAberturaDeMes).padStart(2, '0')}/${params.dataAberturaDeAno}`
      : null;
  const ate =
    params.dataAberturaAteMes && params.dataAberturaAteAno
      ? `${String(params.dataAberturaAteMes).padStart(2, '0')}/${params.dataAberturaAteAno}`
      : null;

  if (de && ate) return `Abertura: ${de} – ${ate}`;
  if (de) return `Abertura: a partir de ${de}`;
  if (ate) return `Abertura: até ${ate}`;
  return null;
}

export interface ExpiryInfo {
  isActive: boolean;
  progressPct: number;
  daysRemaining: number;
}

export function getExpiryInfo(createdAt: string, expiresAt: string): ExpiryInfo {
  const created = new Date(createdAt).getTime();
  const expires = new Date(expiresAt).getTime();
  const now = Date.now();
  const isActive = expires > now;
  const totalMs = expires - created;
  const remainingMs = Math.max(0, expires - now);
  const progressPct = Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));
  const daysRemaining = Math.ceil(remainingMs / 86_400_000);
  return { isActive, progressPct, daysRemaining };
}
