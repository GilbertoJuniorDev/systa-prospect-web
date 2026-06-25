'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPasswordSchema } from '@/lib/validations/auth';
import type { ResetPasswordFormValues } from '@/types/auth';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordFormValues) {
    setServerError(null);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, newPassword: data.newPassword }),
      },
    );

    if (res.ok) {
      router.push('/login?reset=success');
    } else {
      setServerError('Link inválido ou expirado. Solicite um novo link.');
    }
  }

  if (!token || !email) {
    return (
      <div className="text-center space-y-3 py-4">
        <p className="text-sm" style={{ color: 'var(--auth-destructive)' }}>
          Link inválido ou expirado.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm font-medium hover:underline"
          style={{ color: 'var(--auth-accent)' }}
        >
          Solicitar novo link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <Label
          htmlFor="newPassword"
          className="text-sm font-medium"
          style={{ color: 'var(--auth-primary)' }}
        >
          Nova senha
        </Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          {...register('newPassword')}
          aria-invalid={!!errors.newPassword}
          style={{ borderColor: 'var(--auth-border)' }}
        />
        {errors.newPassword && (
          <p role="alert" className="text-xs mt-1" style={{ color: 'var(--auth-destructive)' }}>
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="confirmPassword"
          className="text-sm font-medium"
          style={{ color: 'var(--auth-primary)' }}
        >
          Confirmar senha
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repita a nova senha"
          {...register('confirmPassword')}
          aria-invalid={!!errors.confirmPassword}
          style={{ borderColor: 'var(--auth-border)' }}
        />
        {errors.confirmPassword && (
          <p role="alert" className="text-xs mt-1" style={{ color: 'var(--auth-destructive)' }}>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {serverError && (
        <div className="space-y-2">
          <p
            role="alert"
            className="text-sm text-center rounded-lg py-2.5 px-3"
            style={{
              color: 'var(--auth-destructive)',
              background: 'oklch(0.97 0.04 25)',
              border: '1px solid oklch(0.88 0.08 25)',
            }}
          >
            {serverError}
          </p>
          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-sm hover:underline"
              style={{ color: 'var(--auth-accent)' }}
            >
              Solicitar novo link
            </Link>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 font-semibold text-sm cursor-pointer"
        style={{ background: 'var(--auth-primary)', color: '#fff' }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando…
          </>
        ) : (
          'Redefinir senha'
        )}
      </Button>
    </form>
  );
}
