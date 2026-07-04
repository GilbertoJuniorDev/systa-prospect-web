export interface CnaeOption {
  codigo: string;
  descricao: string;
}

export interface MunicipioOption {
  codigo: string;
  descricao: string;
}

export type SituacaoFilter = 'todas' | 'ativa' | 'inativa';
export type MeiFilter = 'todos' | 'sim' | 'nao';

export interface ConsultaFormValues {
  cnaes: CnaeOption[];
  uf: string;
  municipios: MunicipioOption[];
  situacao: SituacaoFilter;
  mei: MeiFilter;
  dataAberturaDeMes?: number;
  dataAberturaDeAno?: number;
  dataAberturaAteMes?: number;
  dataAberturaAteAno?: number;
}

export interface ConsultaApiBody {
  cnaes: string[];
  uf: string;
  municipios: string[];
  situacao: SituacaoFilter;
  mei: MeiFilter;
  dataAberturaDeMes?: number;
  dataAberturaDeAno?: number;
  dataAberturaAteMes?: number;
  dataAberturaAteAno?: number;
}

export interface ConsultaResponse {
  total: number;
}
