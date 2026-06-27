import axios from 'axios';
import { apiClient } from './api-client';
import type { CnaeOption, MunicipioOption, ConsultaApiBody, ConsultaResponse } from '@/types/consulta';
import type { ConsultaParams } from '@/lib/credits-api';

export interface MinhaConsulta {
  id: string;
  params: ConsultaParams;
  total: number;
  expiresAt: string;
  createdAt: string;
}

export async function buscarCnaes(q: string): Promise<CnaeOption[]> {
  const { data } = await apiClient.get<{ dados: CnaeOption[] }>('/cnaes/buscar', {
    params: { q },
  });
  return data.dados;
}

export async function buscarMunicipios(uf: string): Promise<MunicipioOption[]> {
  const { data } = await apiClient.get<{ uf: string; dados: MunicipioOption[] }>(
    '/municipios',
    { params: { uf } },
  );
  return data.dados;
}

export async function runConsulta(body: ConsultaApiBody): Promise<ConsultaResponse> {
  const { data } = await apiClient.post<ConsultaResponse>('/consulta', body);
  return data;
}

export async function getMinhasConsultas(): Promise<{ consultas: MinhaConsulta[] }> {
  const { data } = await apiClient.get<{ consultas: MinhaConsulta[] }>('/consultas/minhas');
  return data;
}

export async function exportarConsulta(body: ConsultaApiBody): Promise<Blob> {
  // Fetch auth token via the same route the apiClient interceptor uses.
  // Sem token a exportação não deve prosseguir — falha cedo no cliente.
  let token: string | null = null;
  try {
    const res = await fetch('/api/auth/token');
    if (res.ok) {
      const json = (await res.json()) as { accessToken: string };
      token = json.accessToken;
    }
  } catch {
    // tratado abaixo
  }

  if (!token) {
    throw new Error('Sessão expirada. Faça login novamente para exportar.');
  }

  const { data } = await axios.post<Blob>(
    `${process.env.NEXT_PUBLIC_API_URL}/consulta/exportar`,
    body,
    {
      responseType: 'blob',
      timeout: 120_000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
}
