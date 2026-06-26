export interface CnaeItem {
  codigo: string;
  descricao: string | null;
}

export interface CnpjSocio {
  identificador_socio: string;
  nome_socio: string | null;
  cnpj_cpf_socio: string | null;
  qualificacao_socio: string | null;
  data_entrada_sociedade: string | null;
  pais: string | null;
  nome_representante: string | null;
  qualificacao_representante: string | null;
  faixa_etaria: string | null;
}

export interface CnpjResponse {
  cnpj: string;
  cnpj_base: string;
  identificacao: {
    razao_social: string;
    nome_fantasia: string | null;
    tipo: 'Matriz' | 'Filial';
  };
  situacao_cadastral: {
    codigo: string | null;
    descricao: string | null;
    data: string | null;
    motivo_codigo: string | null;
    motivo_descricao: string | null;
  };
  empresa: {
    natureza_juridica: string | null;
    natureza_descricao: string | null;
    porte: string | null;
    capital_social: number | null;
    qualificacao_resp: string | null;
    qualificacao_resp_descricao: string | null;
    ente_federativo: string | null;
  };
  atividade: {
    data_inicio_atividade: string | null;
    situacao_especial: string | null;
    data_situacao_especial: string | null;
    pais_codigo: string | null;
    pais_descricao: string | null;
    nome_cidade_exterior: string | null;
  };
  cnae: {
    principal: CnaeItem | null;
    secundarios: CnaeItem[];
  };
  endereco: {
    tipo_logradouro: string | null;
    logradouro: string | null;
    numero: string | null;
    complemento: string | null;
    bairro: string | null;
    cep: string | null;
    municipio_codigo: string | null;
    municipio: string | null;
    uf: string | null;
  };
  contato: {
    telefone1: string | null;
    telefone2: string | null;
    fax: string | null;
    emails: string[];
  };
  simples: {
    opcao_simples: string | null;
    data_opcao_simples: string | null;
    data_exclusao_simples: string | null;
    opcao_mei: string | null;
    data_opcao_mei: string | null;
    data_exclusao_mei: string | null;
  };
  socios: CnpjSocio[];
}
