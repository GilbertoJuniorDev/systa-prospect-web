import axios from 'axios';
import { apiClient } from './api-client';
import type { CnaeOption, MunicipioOption, ConsultaApiBody, ConsultaResponse } from '@/types/consulta';

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

export async function exportarConsulta(body: ConsultaApiBody): Promise<Blob> {
  const { data } = await axios.post<Blob>(
    `${process.env.NEXT_PUBLIC_API_URL}/consulta/exportar`,
    body,
    {
      responseType: 'blob',
      timeout: 120_000,
      headers: { 'Content-Type': 'application/json' },
    },
  );
  return data;
}
