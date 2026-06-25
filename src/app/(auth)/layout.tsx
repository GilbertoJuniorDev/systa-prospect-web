import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: { template: '%s — Systa', default: 'Systa' },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={
        {
          background: 'var(--background)',
          '--auth-primary': 'oklch(0.18 0.055 290)',
          '--auth-primary-hover': 'oklch(0.52 0.22 290)',
          '--auth-accent': 'oklch(0.52 0.22 290)',
          '--auth-muted': 'oklch(0.50 0.050 290)',
          '--auth-border': 'oklch(0.90 0.020 290)',
          '--auth-destructive': 'oklch(0.55 0.22 27)',
        } as React.CSSProperties
      }
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4"
            style={{
              background: 'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
            }}
          >
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1
            className="text-xl font-bold"
            style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}
          >
            Systa
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Gestão de certificados sindicais
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{
            background: '#fff',
            borderColor: 'var(--border)',
            boxShadow: '0 4px 24px oklch(0.52 0.22 290 / 0.08)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
