'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema } from '@/lib/validations/auth';
import type { LoginFormValues } from '@/types/auth';

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormValues) {
    setServerError(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push('/dashboard');
      router.refresh();
    } else {
      const json = await res.json().catch(() => ({}));
      setServerError(
        (json as { error?: string }).error ?? 'Erro ao fazer login. Tente novamente.',
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <Label
          htmlFor="email"
          className="text-sm font-medium"
          style={{ color: 'var(--auth-primary)' }}
        >
          E-mail
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

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-sm font-medium"
            style={{ color: 'var(--auth-primary)' }}
          >
            Senha
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs hover:underline transition-colors"
            style={{ color: 'var(--auth-accent)' }}
          >
            Esqueci minha senha
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register('password')}
          aria-invalid={!!errors.password}
          style={{ borderColor: 'var(--auth-border)' }}
        />
        {errors.password && (
          <p role="alert" className="text-xs mt-1" style={{ color: 'var(--auth-destructive)' }}>
            {errors.password.message}
          </p>
        )}
      </div>

      {serverError && (
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
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 font-semibold text-sm transition-all duration-200 cursor-pointer"
        style={{ background: 'var(--auth-primary)', color: '#fff' }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando…
          </>
        ) : (
          'Entrar'
        )}
      </Button>
    </form>
  );
}
