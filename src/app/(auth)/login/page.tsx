import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/features/auth/login-form';

export const metadata: Metadata = { title: 'Entrar' };

export default function LoginPage() {
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
          Bem-vindo de volta
        </h2>
        <p className="text-sm" style={{ color: 'oklch(0.55 0.03 60)' }}>
          Acesse sua conta para continuar
        </p>
      </div>
      <LoginForm />
      <p className="mt-5 text-center text-sm" style={{ color: 'var(--auth-muted)' }}>
        Não tem conta?{' '}
        <Link
          href="/register"
          className="font-medium hover:underline transition-colors"
          style={{ color: 'var(--auth-accent)' }}
        >
          Cadastre-se gratuitamente
        </Link>
      </p>
    </>
  );
}
