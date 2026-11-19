'use client';

import { useState } from 'react';
import {
  Download,
  Loader2,
  CalendarClock,
  Calendar,
  MapPin,
  Building2,
} from 'lucide-react';

import { exportarConsulta, type MinhaConsulta } from '@/lib/consulta-api';
import {
  getExpiryInfo,
  formatDateBR,
  formatAberturaRange,
  SITUACAO_LABEL,
  MEI_LABEL,
} from '@/lib/consulta-format';
import { FilterChip } from '@/components/ui/FilterChip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── skeleton ─────────────────────────────────────────────────────────────────

export function ConsultaCardSkeleton() {
  return (
    <div
      className="rounded-2xl border p-5 animate-pulse flex flex-col gap-4"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <div className="w-20 h-5 rounded-full" style={{ background: 'var(--muted)' }} />
        <div className="w-24 h-4 rounded" style={{ background: 'var(--muted)' }} />
      </div>
      <div className="flex flex-wrap gap-2">
        {[60, 80, 100, 80].map((w, i) => (
          <div key={i} className="h-5 rounded-md" style={{ width: w, background: 'var(--muted)' }} />
        ))}
      </div>
      <div className="h-1.5 rounded-full" style={{ background: 'var(--muted)' }} />
      <div className="flex items-center justify-between pt-1">
        <div className="w-32 h-4 rounded" style={{ background: 'var(--muted)' }} />
        <div className="w-28 h-8 rounded-xl" style={{ background: 'var(--muted)' }} />
      </div>
    </div>
  );
}

// ─── consulta card ─────────────────────────────────────────────────────────────

interface ConsultaCardProps {
  consulta: MinhaConsulta;
}

export function ConsultaCard({ consulta }: ConsultaCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { isActive, progressPct, daysRemaining } = getExpiryInfo(consulta.createdAt, consulta.expiresAt);
  const { params } = consulta;

  async function handleRedownload() {
    setIsDownloading(true);
    try {
      const { blob } = await exportarConsulta({
        cnaes: params.cnaes,
        uf: params.uf,
        municipios: params.municipios ?? [],
        situacao: params.situacao,
        mei: params.mei,
        dataAberturaDeMes: params.dataAberturaDeMes,
        dataAberturaDeAno: params.dataAberturaDeAno,
        dataAberturaAteMes: params.dataAberturaAteMes,
        dataAberturaAteAno: params.dataAberturaAteAno,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consulta_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div
      className="rounded-2xl border flex flex-col gap-0 overflow-hidden transition-shadow hover:shadow-md"
      style={{
        background: 'var(--card)',
        borderColor: 'var(--border)',
        boxShadow: '0 2px 8px oklch(0 0 0 / 0.04)',
      }}
    >
      {/* progress bar strip (top) */}
      {isActive && (
        <div className="h-1 w-full" style={{ background: 'var(--muted)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, oklch(0.52 0.22 290), oklch(0.68 0.25 320))',
            }}
          />
        </div>
      )}

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* header row */}
        <div className="flex items-center justify-between gap-3">
          {/* status badge */}
          {isActive ? (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{
                background: 'oklch(0.92 0.08 142)',
                color: 'oklch(0.25 0.12 142)',
                border: '1px solid oklch(0.78 0.14 142)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              Ativa · {daysRemaining}d restantes
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{
                background: 'var(--muted)',
                color: 'var(--muted-foreground)',
                border: '1px solid var(--border)',
              }}
            >
              Expirada
            </span>
          )}

          {/* date */}
          <span className="text-xs tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
            {formatDateBR(consulta.createdAt)}
          </span>
        </div>

        {/* filter chips */}
        <div className="flex flex-wrap gap-1.5">
          {/* UF */}
          <FilterChip icon={MapPin}>{params.uf}</FilterChip>

          {/* Situação */}
          <FilterChip>{SITUACAO_LABEL[params.situacao] ?? params.situacao}</FilterChip>

          {/* MEI */}
          <FilterChip>MEI: {MEI_LABEL[params.mei] ?? params.mei}</FilterChip>

          {/* CNAEs */}
          {params.cnaes.map((cnae) => (
            <FilterChip key={cnae} variant="cnae">{cnae}</FilterChip>
          ))}

          {/* Municípios */}
          {params.municipios && params.municipios.length > 0 && (
            <FilterChip icon={Building2}>
              {params.municipios.length === 1
                ? '1 município'
                : `${params.municipios.length} municípios`}
            </FilterChip>
          )}

          {/* Data de abertura */}
          {formatAberturaRange(params) && (
            <FilterChip icon={Calendar}>{formatAberturaRange(params)}</FilterChip>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-1">
          {/* meta */}
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--foreground)' }}>
              {consulta.total.toLocaleString('pt-BR')} registros
            </span>
            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
              <CalendarClock className="size-3 shrink-0" style={{ color: 'oklch(0.52 0.22 290)' }} />
              {isActive
                ? `Válido até ${formatDateBR(consulta.expiresAt)}`
                : `Expirou em ${formatDateBR(consulta.expiresAt)}`}
            </span>
          </div>

          {/* re-download button */}
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'rounded-xl h-9 px-4 text-sm font-medium gap-1.5 shrink-0 transition-all',
              isActive && 'hover:border-[oklch(0.52_0.22_290)] hover:text-[oklch(0.52_0.22_290)]',
            )}
            disabled={!isActive || isDownloading}
            onClick={handleRedownload}
            aria-label={isActive ? 'Re-download consulta' : 'Consulta expirada'}
          >
            {isDownloading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Exportando...
              </>
            ) : isActive ? (
              <>
                <Download className="size-3.5" />
                Re-download
              </>
            ) : (
              'Expirado'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
