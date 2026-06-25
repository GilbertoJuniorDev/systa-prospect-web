'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

/* ─── Mock data ───────────────────────────────────────────────── */
const MOCK_CERTS = [
  {
    id: 1,
    sindicato: 'SINDICATO DOS EMPREGADOS NO COMÉRCIO E SERVIÇOS DE GUANAMBI, CAETITÉ E REGIÃO',
    data: '18/06/2026',
    empresa: 'Comercial e Calçados Beija Flor Ltda',
    cnpj: '23.060.685/0001-67',
    cidade: 'Guanambi - BA',
    programa: 'CERTIFICADO DE ADESÃO ÀS CONDIÇÕES ESPECIAIS',
    status: 'EM ABERTO',
  },
  {
    id: 2,
    sindicato: 'SINDICATO DOS EMPREGADOS NO COMÉRCIO E SERVIÇOS DE BRUMADO E REGIÃO',
    data: '17/06/2026',
    empresa: 'G J Lima do Nascimento',
    cnpj: '12.456.789/0001-00',
    cidade: 'Brumado - BA',
    programa: 'CERTIFICADO DE ADESÃO ÀS CONDIÇÕES',
    status: 'APROVADO',
  },
  {
    id: 3,
    sindicato: 'SINDICATO DOS TRABALHADORES NO COMÉRCIO DE VITÓRIA DA CONQUISTA',
    data: '16/06/2026',
    empresa: 'Drogaria Vida & Saúde Ltda',
    cnpj: '45.678.901/0001-23',
    cidade: 'Vitória da Conquista - BA',
    programa: 'CERTIFICADO DE ADESÃO ÀS CONDIÇÕES ESPECIAIS',
    status: 'APROVADO',
  },
  {
    id: 4,
    sindicato: 'SINDICATO DOS EMPREGADOS NO COMÉRCIO DE FEIRA DE SANTANA',
    data: '15/06/2026',
    empresa: 'Supermercado Bom Preço Ltda',
    cnpj: '78.901.234/0001-56',
    cidade: 'Feira de Santana - BA',
    programa: 'CERTIFICADO DE ADESÃO ÀS CONDIÇÕES',
    status: 'REPROVADO',
  },
  {
    id: 5,
    sindicato: 'SINDICATO DOS EMPREGADOS NO COMÉRCIO E SERVIÇOS DE JEQUIÉ',
    data: '14/06/2026',
    empresa: 'Auto Peças Nordeste Ltda',
    cnpj: '11.223.344/0001-78',
    cidade: 'Jequié - BA',
    programa: 'CERTIFICADO DE ADESÃO ÀS CONDIÇÕES ESPECIAIS',
    status: 'APROVADO',
  },
  {
    id: 6,
    sindicato: 'SINDICATO DOS EMPREGADOS NO COMÉRCIO DE ILHÉUS',
    data: '13/06/2026',
    empresa: 'Cacau Show Franquias Ltda',
    cnpj: '99.887.766/0001-11',
    cidade: 'Ilhéus - BA',
    programa: 'CERTIFICADO DE ADESÃO ÀS CONDIÇÕES',
    status: 'EM ABERTO',
  },
  {
    id: 7,
    sindicato: 'SINDICATO DOS COMERCIÁRIOS DE PORTO SEGURO E REGIÃO',
    data: '12/06/2026',
    empresa: 'Pousada Mar Azul Ltda',
    cnpj: '55.443.322/0001-99',
    cidade: 'Porto Seguro - BA',
    programa: 'CERTIFICADO DE ADESÃO ÀS CONDIÇÕES ESPECIAIS',
    status: 'APROVADO',
  },
  {
    id: 8,
    sindicato: 'SINDICATO DOS EMPREGADOS NO COMÉRCIO DE BARREIRAS',
    data: '11/06/2026',
    empresa: 'Agro-Comercial Cerrado Ltda',
    cnpj: '33.221.100/0001-44',
    cidade: 'Barreiras - BA',
    programa: 'CERTIFICADO DE ADESÃO ÀS CONDIÇÕES',
    status: 'REPROVADO',
  },
];

/* ─── Animated counter hook ──────────────────────────────────── */
function useCounter(target: number, duration = 800) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const pct = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setCount(Math.round(eased * target));
      if (pct < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return count;
}

/* ─── Status badge ───────────────────────────────────────────── */
const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'APROVADO':  { bg: 'oklch(0.95 0.05 142)', text: 'oklch(0.38 0.15 142)', dot: 'oklch(0.55 0.18 142)' },
  'REPROVADO': { bg: 'oklch(0.96 0.04  27)', text: 'oklch(0.45 0.18  27)', dot: 'oklch(0.55 0.22  27)' },
  'EM ABERTO': { bg: 'oklch(0.97 0.06  85)', text: 'oklch(0.50 0.14  85)', dot: 'oklch(0.70 0.17  85)' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES['EM ABERTO'];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

/* ─── Stats card ─────────────────────────────────────────────── */
interface StatsCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: number;
  sub?: React.ReactNode;
  delay?: number;
}

function StatsCard({ icon, iconBg, label, value, sub, delay = 0 }: StatsCardProps) {
  const count = useCounter(value, 900);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, boxShadow: '0 12px 32px oklch(0.52 0.22 290 / 0.12)' }}
      className="flex-1 bg-card rounded-2xl border p-6 flex flex-col gap-4 cursor-default"
      style={{ borderColor: 'var(--border)', boxShadow: '0 2px 8px oklch(0 0 0 / 0.04)' }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}
        >
          {label}
        </span>
      </div>
      <div>
        <p
          className="text-4xl font-bold tabular-nums"
          style={{
            color: 'var(--foreground)',
            fontFamily: 'var(--font-geist-mono, monospace)',
            letterSpacing: '-0.03em',
          }}
        >
          {count}
        </p>
        {sub && <div className="mt-1.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
const total   = MOCK_CERTS.length;
const success = MOCK_CERTS.filter(c => c.status === 'APROVADO').length;
const failed  = MOCK_CERTS.filter(c => c.status === 'REPROVADO').length;
const pct     = Math.round((success / total) * 100);

export default function CertificadosPage() {
  const [query, setQuery] = useState('');

  const filtered = MOCK_CERTS.filter(c =>
    !query || c.cnpj.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
    c.empresa.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-screen-xl mx-auto space-y-8">

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1
          className="text-3xl font-bold"
          style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}
        >
          Consulta de Certificados
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Painel administrativo de controle e exportação
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="flex gap-5">
        <StatsCard
          icon={<FileText size={18} style={{ color: 'oklch(0.52 0.22 290)' }} />}
          iconBg="oklch(0.93 0.04 290)"
          label="Total"
          value={total}
          sub={<span style={{ color: 'var(--muted-foreground)' }}>Solicitações recebidas</span>}
          delay={0}
        />
        <StatsCard
          icon={<CheckCircle2 size={18} style={{ color: 'oklch(0.55 0.18 142)' }} />}
          iconBg="oklch(0.94 0.05 142)"
          label="Sucesso"
          value={success}
          sub={
            <span style={{ color: 'oklch(0.50 0.16 142)' }}>
              Aprovadas ({pct}%)
            </span>
          }
          delay={0.08}
        />
        <StatsCard
          icon={<XCircle size={18} style={{ color: 'oklch(0.55 0.22 27)' }} />}
          iconBg="oklch(0.95 0.04 27)"
          label="Falhas"
          value={failed}
          sub={<span style={{ color: 'oklch(0.50 0.18 27)' }}>Reprovadas</span>}
          delay={0.16}
        />
      </div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="bg-card rounded-2xl border px-5 py-4"
        style={{ borderColor: 'var(--border)', boxShadow: '0 2px 8px oklch(0 0 0 / 0.04)' }}
      >
        <p
          className="text-xs font-semibold mb-3 tracking-widest uppercase"
          style={{ color: 'var(--muted-foreground)', letterSpacing: '0.1em' }}
        >
          Busca rápida por CNPJ
        </p>
        <div className="relative flex items-center">
          <Search
            size={15}
            className="absolute left-3.5 pointer-events-none"
            style={{ color: 'var(--muted-foreground)' }}
          />
          <input
            type="text"
            placeholder="Digite o CNPJ da empresa…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 rounded-xl text-sm bg-transparent border outline-none transition-colors"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              letterSpacing: '0.01em',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          />
          <button
            className="absolute right-3 flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
            style={{ background: 'oklch(0.93 0.04 290)' }}
            type="button"
          >
            <Filter size={14} style={{ color: 'var(--primary)' }} />
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-card rounded-2xl border overflow-hidden"
        style={{ borderColor: 'var(--border)', boxShadow: '0 2px 8px oklch(0 0 0 / 0.04)' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Sindicato', 'Data', 'Solicitante', 'Programa', 'Status'].map(col => (
                <th
                  key={col}
                  className="text-left px-6 py-4 text-xs font-semibold tracking-widest uppercase"
                  style={{ color: 'var(--muted-foreground)', letterSpacing: '0.09em' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {filtered.map((cert, i) => (
                <motion.tr
                  key={cert.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.3, delay: i * 0.04, ease: 'easeOut' }}
                  className="group transition-colors"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0.975 0.010 290)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  {/* Sindicato */}
                  <td className="px-6 py-5 max-w-[220px]">
                    <p
                      className="text-xs font-medium leading-snug uppercase"
                      style={{ color: 'var(--muted-foreground)', letterSpacing: '0.04em' }}
                    >
                      {cert.sindicato}
                    </p>
                  </td>

                  {/* Data */}
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {cert.data}
                    </span>
                  </td>

                  {/* Solicitante */}
                  <td className="px-6 py-5">
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      {cert.empresa}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      {cert.cnpj}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {cert.cidade}
                    </p>
                  </td>

                  {/* Programa */}
                  <td className="px-6 py-5 max-w-[200px]">
                    <p
                      className="text-xs font-medium uppercase leading-snug"
                      style={{ color: 'var(--primary)', letterSpacing: '0.04em' }}
                    >
                      {cert.programa}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <StatusBadge status={cert.status} />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Nenhum certificado encontrado para "{query}"
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
