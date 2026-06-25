'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordSchema } from '@/lib/validations/auth';
import type { ForgotPasswordFormValues } from '@/types/auth';

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
    ).catch(() => null);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="flex justify-center">
          <CheckCircle className="h-12 w-12" style={{ color: 'var(--auth-accent)' }} />
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--auth-muted)' }}>
          Se este e-mail está cadastrado, você receberá um link de redefinição em breve.
        </p>
        <Link
          href="/login"
          className="text-sm font-medium hover:underline"
          style={{ color: 'var(--auth-accent)' }}
        >
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <Label
          htmlFor="email"
          className="text-sm font-medium"
          style={{ color: 'var(--auth-primary)' }}
        >
          E-mail cadastrado
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          {...register('email')}
          aria-invalid={!!errors.email}
          style={{ borderColor: 'var(--auth-border)' }}
        />
        {errors.email && (
          <p role="alert" className="text-xs mt-1" style={{ color: 'var(--auth-destructive)' }}>
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 font-semibold text-sm cursor-pointer"
        style={{ background: 'var(--auth-primary)', color: '#fff' }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando…
          </>
        ) : (
          'Enviar link de redefinição'
        )}
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm hover:underline"
          style={{ color: 'var(--auth-muted)' }}
        >
          Voltar ao login
        </Link>
      </div>
    </form>
  );
}
