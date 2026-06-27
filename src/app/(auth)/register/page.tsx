import type { Metadata } from 'next';
import { RegisterForm } from '@/components/features/auth/RegisterForm';

export const metadata: Metadata = { title: 'Criar conta' };

export default function RegisterPage() {
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
          Crie sua conta
        </h2>
        <p className="text-sm" style={{ color: 'oklch(0.55 0.03 60)' }}>
          Gratuito. Sem necessidade de cartão.
        </p>
      </div>
      <RegisterForm />
    </>
  );
}
