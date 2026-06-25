'use client';

import { motion } from 'framer-motion';

export default function RepisPage() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <h1
          className="text-3xl font-bold"
          style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}
        >
          Repis
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Em construção
        </p>
      </motion.div>
    </div>
  );
}
