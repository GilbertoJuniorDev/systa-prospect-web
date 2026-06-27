'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { getMinhasConsultas } from '@/lib/consulta-api';
import {
  ConsultaCard,
  ConsultaCardSkeleton,
} from '@/components/features/minhas-consultas/ConsultaCard';
import { EmptyConsultasState } from '@/components/features/minhas-consultas/EmptyConsultasState';

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
          <ConsultaCardSkeleton />
          <ConsultaCardSkeleton />
          <ConsultaCardSkeleton />
        </div>
      ) : isError ? (
        <div
          className="rounded-2xl border p-8 text-sm"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          Não foi possível carregar as consultas. Tente recarregar a página.
        </div>
      ) : consultas.length === 0 ? (
        <EmptyConsultasState />
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
