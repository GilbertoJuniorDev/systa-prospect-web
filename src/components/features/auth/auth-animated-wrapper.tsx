'use client';

import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;
import type React from 'react';

export function AuthAnimatedWrapper({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <motion.div
        className="mb-8 text-center"
        initial={reduced ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: EASE }}
      >
        <motion.div
          className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4"
          style={{
            background: 'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
          }}
          initial={reduced ? false : { scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.05 }}
        >
          <span className="text-white font-bold text-lg">S</span>
        </motion.div>
        <motion.h1
          className="text-xl font-bold"
          style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28, delay: 0.16 }}
        >
          Systa
        </motion.h1>
        <motion.p
          className="text-sm mt-1"
          style={{ color: 'var(--muted-foreground)' }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28, delay: 0.22 }}
        >
          Gestão de certificados sindicais
        </motion.p>
      </motion.div>

      {/* Card */}
      <motion.div
        className="rounded-2xl border p-8"
        style={{
          background: '#fff',
          borderColor: 'var(--border)',
          boxShadow: '0 4px 24px oklch(0.52 0.22 290 / 0.08)',
        }}
        initial={reduced ? false : { opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.42, ease: EASE, delay: 0.08 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
