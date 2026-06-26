import type { CnpjResponse } from '@/types/busca-cnpj';

const SITUACAO_COLORS: Record<string, string> = {
  Ativa: 'bg-emerald-100 text-emerald-800',
  Baixada: 'bg-red-100 text-red-800',
  Inapta: 'bg-red-100 text-red-800',
  Suspensa: 'bg-amber-100 text-amber-800',
  Nula: 'bg-gray-100 text-gray-600',
};

const PORTE_MAP: Record<string, string> = {
  '00': 'Não informado',
  '01': 'Micro Empresa',
  '03': 'Empresa de Pequeno Porte',
  '05': 'Demais',
};

const FAIXA_ETARIA_MAP: Record<string, string> = {
  '1': '0–12 anos',
  '2': '13–20 anos',
  '3': '21–30 anos',
  '4': '31–40 anos',
  '5': '41–50 anos',
  '6': '51–60 anos',
  '7': '61–70 anos',
  '8': '71–80 anos',
  '9': 'Acima de 80 anos',
};

const TIPO_SOCIO_MAP: Record<string, string> = {
  '1': 'PJ',
  '2': 'PF',
  '3': 'Estrangeiro',
};

function formatDate(raw: string | null): string | null {
  if (!raw || raw.length !== 8 || raw === '00000000' || raw.trim() === '') return null;
  return `${raw.slice(6, 8)}/${raw.slice(4, 6)}/${raw.slice(0, 4)}`;
}

function formatBRL(value: number | null): string | null {
  if (value === null) return null;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[140px_1fr] gap-x-3 py-1.5 border-b border-border/40 last:border-0">
      <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
        {label}
      </span>
      <span className="text-xs" style={{ color: 'var(--foreground)' }}>
        {value}
      </span>
    </div>
  );
}

function SectionCard({
  title,
  children,
  fullWidth,
}: {
  title: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border bg-card p-4 shadow-sm ${fullWidth ? 'md:col-span-2' : ''}`}
    >
      <h3
        className="text-sm font-semibold mb-3 pb-2 border-b"
        style={{ color: 'var(--foreground)' }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

export function CnpjResultSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`rounded-lg border bg-card p-4 shadow-sm ${i === 0 || i === 3 || i === 4 ? 'md:col-span-2' : ''}`}
        >
          <div className="h-4 w-32 bg-muted rounded animate-pulse mb-3 pb-2" />
          <div className="space-y-2">
            {[...Array(3)].map((_, j) => (
              <div
                key={j}
                className="h-3 bg-muted rounded animate-pulse"
                style={{ width: `${50 + j * 20}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CnpjResultCard({ data }: { data: CnpjResponse }) {
  const { identificacao, situacao_cadastral, empresa, atividade, cnae, endereco, contato, simples, socios } = data;

  if (!situacao_cadastral || !empresa || !cnae || !endereco || !contato || !simples) {
    return (
      <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <p className="text-sm font-medium text-destructive">
          Dados do CNPJ incompletos ou inválidos. Tente novamente.
        </p>
      </div>
    );
  }

  const situacaoBadgeClass =
    SITUACAO_COLORS[situacao_cadastral.descricao ?? ''] ?? 'bg-gray-100 text-gray-600';

  const enderecoLinha1 = [
    endereco.tipo_logradouro,
    endereco.logradouro,
    endereco.numero,
    endereco.complemento,
  ]
    .filter(Boolean)
    .join(', ');

  const enderecoLinha2 = [endereco.bairro, endereco.municipio, endereco.uf]
    .filter(Boolean)
    .join(' — ');

  const temAtividade =
    atividade.data_inicio_atividade ||
    atividade.situacao_especial ||
    atividade.pais_descricao;

  const temSimples =
    simples.opcao_simples ||
    simples.opcao_mei ||
    simples.data_opcao_simples ||
    simples.data_opcao_mei;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Identificação — full width */}
      <SectionCard title="Identificação" fullWidth>
        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className="inline-flex items-center rounded px-2 py-0.5 text-xs font-mono font-semibold border"
            style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
          >
            {data.cnpj}
          </span>
          <span
            className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-secondary/40"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {identificacao.tipo}
          </span>
        </div>
        <Field label="Razão Social" value={identificacao.razao_social} />
        {identificacao.nome_fantasia && (
          <Field label="Nome Fantasia" value={identificacao.nome_fantasia} />
        )}
        <Field label="CNPJ Base" value={data.cnpj_base} />
      </SectionCard>

      {/* Situação Cadastral */}
      <SectionCard title="Situação Cadastral">
        <div className="mb-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${situacaoBadgeClass}`}
          >
            {situacao_cadastral.descricao ?? '—'}
          </span>
        </div>
        <Field label="Data" value={formatDate(situacao_cadastral.data)} />
        <Field label="Motivo" value={situacao_cadastral.motivo_descricao} />
        <Field label="Código motivo" value={situacao_cadastral.motivo_codigo} />
      </SectionCard>

      {/* Dados da Empresa */}
      <SectionCard title="Dados da Empresa">
        <Field label="Natureza Jurídica" value={empresa.natureza_descricao ?? empresa.natureza_juridica} />
        <Field label="Porte" value={empresa.porte ? PORTE_MAP[empresa.porte] ?? empresa.porte : null} />
        <Field label="Capital Social" value={formatBRL(empresa.capital_social)} />
        <Field label="Qualif. Responsável" value={empresa.qualificacao_resp_descricao ?? empresa.qualificacao_resp} />
        <Field label="Ente Federativo" value={empresa.ente_federativo} />
      </SectionCard>

      {/* CNAE — full width */}
      <SectionCard title="CNAE" fullWidth>
        {cnae.principal ? (
          <div className="mb-3">
            <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
              Principal
            </span>
            <p className="text-sm mt-0.5" style={{ color: 'var(--foreground)' }}>
              <span className="font-mono font-semibold">{cnae.principal.codigo}</span>
              {cnae.principal.descricao && (
                <span className="ml-2">{cnae.principal.descricao}</span>
              )}
            </p>
          </div>
        ) : (
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Sem CNAE principal cadastrado.
          </p>
        )}
        {cnae.secundarios.length > 0 && (
          <div>
            <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
              Secundários
            </span>
            <ul className="mt-1 space-y-1">
              {cnae.secundarios.map((c) => (
                <li key={c.codigo} className="text-xs" style={{ color: 'var(--foreground)' }}>
                  <span className="font-mono font-semibold">{c.codigo}</span>
                  {c.descricao && <span className="ml-2">{c.descricao}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </SectionCard>

      {/* Endereço */}
      <SectionCard title="Endereço">
        {enderecoLinha1 && (
          <Field label="Logradouro" value={enderecoLinha1} />
        )}
        {enderecoLinha2 && (
          <Field label="Localidade" value={enderecoLinha2} />
        )}
        <Field label="CEP" value={endereco.cep} />
        <Field label="UF" value={endereco.uf} />
      </SectionCard>

      {/* Contato */}
      <SectionCard title="Contato">
        <Field label="Telefone 1" value={contato.telefone1} />
        <Field label="Telefone 2" value={contato.telefone2} />
        <Field label="Fax" value={contato.fax} />
        {contato.emails.length > 0 && (
          <div className="grid grid-cols-[140px_1fr] gap-x-3 py-1.5">
            <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
              E-mail(s)
            </span>
            <div className="flex flex-col gap-0.5">
              {contato.emails.map((email, i) => (
                <a
                  key={i}
                  href={`mailto:${email}`}
                  className="text-xs hover:underline"
                  style={{ color: 'oklch(0.52 0.22 290)' }}
                >
                  {email}
                </a>
              ))}
            </div>
          </div>
        )}
        {contato.emails.length === 0 &&
          !contato.telefone1 &&
          !contato.telefone2 &&
          !contato.fax && (
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Sem informações de contato.
            </p>
          )}
      </SectionCard>

      {/* Simples / MEI — full width, somente se houver dados */}
      {temSimples && (
        <SectionCard title="Simples Nacional / MEI" fullWidth>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                Simples Nacional
              </p>
              <Field
                label="Opção"
                value={simples.opcao_simples === 'S' ? 'Optante' : simples.opcao_simples === 'N' ? 'Não optante' : simples.opcao_simples}
              />
              <Field label="Data opção" value={formatDate(simples.data_opcao_simples)} />
              <Field label="Data exclusão" value={formatDate(simples.data_exclusao_simples)} />
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                MEI
              </p>
              <Field
                label="Opção"
                value={simples.opcao_mei === 'S' ? 'Optante' : simples.opcao_mei === 'N' ? 'Não optante' : simples.opcao_mei}
              />
              <Field label="Data opção" value={formatDate(simples.data_opcao_mei)} />
              <Field label="Data exclusão" value={formatDate(simples.data_exclusao_mei)} />
            </div>
          </div>
        </SectionCard>
      )}

      {/* QSA — full width */}
      <SectionCard title="Quadro de Sócios e Administradores (QSA)" fullWidth>
        {socios.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Sem sócios cadastrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b" style={{ color: 'var(--muted-foreground)' }}>
                  <th className="text-left py-2 pr-3 font-medium">Tipo</th>
                  <th className="text-left py-2 pr-3 font-medium">Nome / Razão Social</th>
                  <th className="text-left py-2 pr-3 font-medium">CPF / CNPJ</th>
                  <th className="text-left py-2 pr-3 font-medium">Qualificação</th>
                  <th className="text-left py-2 pr-3 font-medium">Entrada</th>
                  <th className="text-left py-2 font-medium">Faixa Etária</th>
                </tr>
              </thead>
              <tbody>
                {socios.map((socio, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                    style={{ color: 'var(--foreground)' }}
                  >
                    <td className="py-2 pr-3">
                      {TIPO_SOCIO_MAP[socio.identificador_socio] ?? socio.identificador_socio}
                    </td>
                    <td className="py-2 pr-3 font-medium">{socio.nome_socio ?? '—'}</td>
                    <td className="py-2 pr-3 font-mono">{socio.cnpj_cpf_socio ?? '—'}</td>
                    <td className="py-2 pr-3">{socio.qualificacao_socio ?? '—'}</td>
                    <td className="py-2 pr-3">{formatDate(socio.data_entrada_sociedade) ?? '—'}</td>
                    <td className="py-2">
                      {socio.faixa_etaria
                        ? FAIXA_ETARIA_MAP[socio.faixa_etaria] ?? socio.faixa_etaria
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Atividade — full width, condicional */}
      {temAtividade && (
        <SectionCard title="Atividade" fullWidth>
          <Field label="Início de atividade" value={formatDate(atividade.data_inicio_atividade)} />
          <Field label="Situação especial" value={atividade.situacao_especial} />
          <Field
            label="Data sit. especial"
            value={formatDate(atividade.data_situacao_especial)}
          />
          <Field label="País" value={atividade.pais_descricao} />
          <Field label="Cidade exterior" value={atividade.nome_cidade_exterior} />
        </SectionCard>
      )}
    </div>
  );
}
