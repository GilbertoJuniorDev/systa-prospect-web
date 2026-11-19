'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Building2, ShieldCheck, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { EASE_OUT } from './animation-constants';

interface LandingHeroProps {
  isAuthenticated: boolean;
}

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  Icon: React.ElementType;
}

const STATS: StatItem[] = [
  { value: 50, suffix: 'M+', label: 'empresas na base', Icon: Building2 },
  { value: 100, suffix: '%', label: 'dados atualizados', Icon: RefreshCw },
  { value: 0, suffix: '', label: 'mensalidade', Icon: ShieldCheck },
];

function AnimatedCounter({
  value,
  suffix,
  duration = 1500,
}: {
  value: number;
  suffix: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();
  const started = useRef(false);

  useEffect(() => {
    if (reduced || started.current || value === 0) {
      setDisplay(value);
      return;
    }
    started.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration, reduced]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

export function LandingHero({ isAuthenticated }: LandingHeroProps) {
  const reduced = useReducedMotion();

  const fadeItem = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 20 } as const),
    animate: { opacity: 1, y: 0 } as const,
    transition: { duration: 0.5, ease: EASE_OUT, delay },
  });

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[calc(100svh-4rem)] flex items-center overflow-hidden"
    >
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, oklch(0.68 0.25 320 / 0.10) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-48 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, oklch(0.52 0.22 290 / 0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div {...fadeItem(0)}>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{
                background: 'oklch(0.52 0.22 290 / 0.10)',
                color: 'oklch(0.52 0.22 290)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'oklch(0.52 0.22 290)' }}
              />
              Dados Oficiais da Receita Federal
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            id="hero-heading"
            {...fadeItem(0.08)}
            className="font-extrabold leading-tight mb-5"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              letterSpacing: '-0.03em',
              color: 'var(--foreground)',
            }}
          >
            Prospecção B2B com{' '}
            <span
              style={{
                background:
                  'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              dados reais
            </span>{' '}
            do Brasil
          </motion.h1>

          {/* Sub */}
          <motion.p
            {...fadeItem(0.16)}
            className="text-lg md:text-xl leading-relaxed mb-8 max-w-2xl"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Consulte mais de 50 milhões de empresas, filtre por CNAE, estado e cidade, e
            exporte listas qualificadas em Excel — tudo via registros sem mensalidade.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeItem(0.24)} className="flex flex-wrap gap-3 mb-14">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-12 px-6 text-base font-semibold rounded-xl'
                )}
                style={{
                  background: 'oklch(0.52 0.22 290)',
                  color: 'white',
                  boxShadow: '0 4px 18px oklch(0.52 0.22 290 / 0.35)',
                }}
              >
                Ir para o Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'h-12 px-6 text-base font-semibold rounded-xl'
                  )}
                  style={{
                    background: 'oklch(0.52 0.22 290)',
                    color: 'white',
                    boxShadow: '0 4px 18px oklch(0.52 0.22 290 / 0.35)',
                  }}
                >
                  Começar Grátis — 5 registros grátis
                </Link>
                <a
                  href="#como-funciona"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'h-12 px-6 text-base font-semibold rounded-xl'
                  )}
                >
                  Ver como funciona →
                </a>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeItem(0.36)} className="flex flex-wrap gap-x-8 gap-y-6">
            {STATS.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                {i > 0 && (
                  <div
                    className="hidden sm:block w-px h-10 self-center"
                    style={{ background: 'var(--border)' }}
                  />
                )}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'oklch(0.52 0.22 290 / 0.10)' }}
                >
                  <stat.Icon size={17} style={{ color: 'oklch(0.52 0.22 290)' }} />
                </div>
                <div>
                  <div
                    className="text-2xl font-extrabold leading-none"
                    style={{
                      fontVariantNumeric: 'tabular-nums',
                      color: 'var(--foreground)',
                    }}
                  >
                    {stat.value === 0 ? (
                      'Sem'
                    ) : (
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    )}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
