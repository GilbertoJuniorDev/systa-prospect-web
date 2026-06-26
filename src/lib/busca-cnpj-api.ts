import { apiClient } from './api-client';
import type { CnpjResponse } from '@/types/busca-cnpj';

export async function buscarCnpj(cnpj: string): Promise<CnpjResponse> {
  const digits = cnpj.replace(/\D/g, '');
  const { data } = await apiClient.get<CnpjResponse>(`/cnpj/${digits}`);
  return data;
}
