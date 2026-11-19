import { apiClient } from './api-client';

export interface ConsultaParams {
  cnaes: string[];
  uf: string;
  municipios?: string[];
  situacao: 'ativa' | 'inativa' | 'todas';
  mei: 'sim' | 'nao' | 'todos';
  dataAberturaDeMes?: number;
  dataAberturaDeAno?: number;
  dataAberturaAteMes?: number;
  dataAberturaAteAno?: number;
}

export interface ConsultaCacheData {
  params: ConsultaParams;
  total: number;
  expiresAt: string;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  createdAt: string;
  consultaCache: ConsultaCacheData | null;
}

export interface CreditsResponse {
  balance: number;
  transactions: CreditTransaction[];
}

export async function getUserCredits(): Promise<CreditsResponse> {
  const { data } = await apiClient.get<CreditsResponse>('/user/credits');
  return data;
}

export type PackageId = 'starter' | 'pro' | 'max';

export async function createStripeCheckout(packageId: PackageId): Promise<{ url: string }> {
  const { data } = await apiClient.post<{ url: string }>('/stripe/create-checkout', { packageId });
  return data;
}
