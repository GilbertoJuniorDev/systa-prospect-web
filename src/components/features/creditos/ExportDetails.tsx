import { CalendarClock, Filter } from 'lucide-react';

import type { CreditTransaction } from '@/lib/credits-api';
import { SITUACAO_LABEL, MEI_LABEL } from '@/lib/consulta-format';
import { FilterChip } from '@/components/ui/FilterChip';

interface ExportDetailsProps {
  cache: NonNullable<CreditTransaction['consultaCache']>;
}

export function ExportDetails({ cache }: ExportDetailsProps) {
  const { params, total, expiresAt } = cache;

  return (
    <div
      className="px-6 py-4 flex flex-col gap-3"
      style={{
        background: 'var(--muted)',
        borderLeft: '3px solid oklch(0.52 0.22 290)',
      }}
    >
      {/* Filtros header */}
      <div className="flex items-center gap-2">
        <Filter className="size-3.5 shrink-0" style={{ color: 'oklch(0.52 0.22 290)' }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
          Filtros da consulta
        </span>
      </div>

      {/* Chips de filtro */}
      <div className="flex flex-wrap gap-2">
        {/* UF */}
        <FilterChip>UF: {params.uf}</FilterChip>

        {/* Situação */}
        <FilterChip>Situação: {SITUACAO_LABEL[params.situacao] ?? params.situacao}</FilterChip>

        {/* MEI */}
        <FilterChip>MEI: {MEI_LABEL[params.mei] ?? params.mei}</FilterChip>

        {/* CNAEs */}
        {params.cnaes.map((cnae) => (
          <FilterChip key={cnae} variant="cnae">CNAE {cnae}</FilterChip>
        ))}
      </div>

      {/* Metadados */}
      <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
        <span>
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
            {total.toLocaleString('pt-BR')}
          </span>{' '}
          registros exportados
        </span>

        <span className="flex items-center gap-1">
          <CalendarClock className="size-3.5" style={{ color: 'oklch(0.52 0.22 290)' }} />
          Cache válido até{' '}
          <span className="font-medium" style={{ color: 'var(--foreground)' }}>
            {new Date(expiresAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </span>
        </span>
      </div>
    </div>
  );
}
