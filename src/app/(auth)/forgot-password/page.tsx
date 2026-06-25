import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/features/auth/forgot-password-form';

export const metadata: Metadata = { title: 'Recuperar senha' };

export default function ForgotPasswordPage() {
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
          Recuperar senha
        </h2>
        <p className="text-sm" style={{ color: 'oklch(0.55 0.03 60)' }}>
          Informe seu e-mail e enviaremos um link de redefinição
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
