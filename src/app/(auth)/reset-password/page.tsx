import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/features/auth/reset-password-form';

export const metadata: Metadata = { title: 'Nova senha' };

export default function ResetPasswordPage() {
  return (
    <>
      <div className="mb-6">
        <h2
          className="text-xl font-semibold mb-1"
          style={{
            color: 'oklch(0.22 0.05 50)',
            fontFamily: 'var(--font-plus-jakarta-sans, sans-serif)',
          }}
        >
          Criar nova senha
        </h2>
        <p className="text-sm" style={{ color: 'oklch(0.55 0.03 60)' }}>
          Escolha uma senha segura para sua conta
        </p>
      </div>
      <Suspense
        fallback={
          <div className="h-32 animate-pulse rounded-lg bg-gray-100" />
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </>
  );
}
