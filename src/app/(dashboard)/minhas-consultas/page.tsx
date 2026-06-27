'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  History,
  Download,
  Loader2,
  CalendarClock,
  MapPin,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

import { getMinhasConsultas, exportarConsulta, type MinhaConsulta } from '@/lib/consulta-api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── helpers ──────────────────────────────────────────────────────────────────

const SITUACAO_LABEL: Record<string, string> = {
  ativa: 'Ativa',
  inativa: 'Inativa',
  todas: 'Todas',
};

const MEI_LABEL: Record<string, string> = {
  sim: 'Sim',
  nao: 'Não',
  todos: 'Todos',
};

function formatDateBR(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getExpiryInfo(createdAt: string, expiresAt: string) {
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

// ─── skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
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

function ConsultaCard({ consulta }: { consulta: MinhaConsulta }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { isActive, progressPct, daysRemaining } = getExpiryInfo(consulta.createdAt, consulta.expiresAt);
  const { params } = consulta;

  async function handleRedownload() {
    setIsDownloading(true);
    try {
      const blob = await exportarConsulta({
        cnaes: params.cnaes,
        uf: params.uf,
        municipios: params.municipios ?? [],
        situacao: params.situacao,
        mei: params.mei,
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
          <span
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
            style={{
              background: 'oklch(0.94 0.025 290)',
              color: 'oklch(0.35 0.15 290)',
              border: '1px solid oklch(0.85 0.06 290)',
            }}
          >
            <MapPin className="size-3 shrink-0" />
            {params.uf}
          </span>

          {/* Situação */}
          <span
            className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold"
            style={{
              background: 'oklch(0.94 0.025 290)',
              color: 'oklch(0.35 0.15 290)',
              border: '1px solid oklch(0.85 0.06 290)',
            }}
          >
            {SITUACAO_LABEL[params.situacao] ?? params.situacao}
          </span>

          {/* MEI */}
          <span
            className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold"
            style={{
              background: 'oklch(0.94 0.025 290)',
              color: 'oklch(0.35 0.15 290)',
              border: '1px solid oklch(0.85 0.06 290)',
            }}
          >
            MEI: {MEI_LABEL[params.mei] ?? params.mei}
          </span>

          {/* CNAEs */}
          {params.cnaes.map((cnae) => (
            <span
              key={cnae}
              className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-mono font-medium"
              style={{
                background: 'oklch(0.90 0.04 290)',
                color: 'oklch(0.30 0.18 290)',
                border: '1px solid oklch(0.80 0.08 290)',
              }}
            >
              {cnae}
            </span>
          ))}

          {/* Municípios */}
          {params.municipios && params.municipios.length > 0 && (
            <span
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
              style={{
                background: 'oklch(0.94 0.025 290)',
                color: 'oklch(0.35 0.15 290)',
                border: '1px solid oklch(0.85 0.06 290)',
              }}
            >
              <Building2 className="size-3 shrink-0" />
              {params.municipios.length === 1
                ? '1 município'
                : `${params.municipios.length} municípios`}
            </span>
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

// ─── page ─────────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function MinhasConsultasPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['minhas-consultas'],
    queryFn: getMinhasConsultas,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const consultas = data?.consultas ?? [];

  return (
    <div className="max-w-5xl mx-auto pt-8 pb-16 flex flex-col gap-8">

      {/* page title */}
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}
        >
          Minhas Consultas
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Exportações realizadas. Re-download gratuito dentro do prazo de 30 dias.
        </p>
      </div>

      {/* content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : isError ? (
        <div
          className="rounded-2xl border p-8 text-sm"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          Não foi possível carregar as consultas. Tente recarregar a página.
        </div>
      ) : consultas.length === 0 ? (
        <div
          className="rounded-2xl border p-16 flex flex-col items-center gap-4 text-center"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <History
            className="size-14 opacity-15"
            style={{ color: 'var(--foreground)' }}
            aria-hidden="true"
          />
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
              Nenhuma consulta exportada ainda
            </p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Suas exportações aparecerão aqui e ficarão disponíveis por 30 dias.
            </p>
          </div>
          <Link
            href="/consulta"
            className="mt-2 inline-flex items-center justify-center rounded-xl h-9 px-5 text-sm font-medium transition-colors"
            style={{
              background: 'oklch(0.52 0.22 290)',
              color: '#fff',
            }}
          >
            Fazer primeira consulta
          </Link>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {consultas.map((consulta) => (
            <motion.div key={consulta.id} variants={itemVariants}>
              <ConsultaCard consulta={consulta} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
