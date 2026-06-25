import type { Metadata } from 'next';
import type React from 'react';
import { AuthAnimatedWrapper } from '@/components/features/auth/auth-animated-wrapper';

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
      <AuthAnimatedWrapper>{children}</AuthAnimatedWrapper>
    </div>
  );
}
