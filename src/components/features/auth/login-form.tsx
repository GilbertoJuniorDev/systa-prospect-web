'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
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

const EASE = [0.16, 1, 0.3, 1] as const;

const field: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.32 } },
};

export function LoginForm() {
  const router = useRouter();
  const reduced = useReducedMotion();
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
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
      variants={reduced ? undefined : container}
      initial={reduced ? false : 'hidden'}
      animate={reduced ? undefined : 'show'}
    >
      <motion.div variants={reduced ? undefined : field} className="space-y-1.5">
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
      </motion.div>

      <motion.div variants={reduced ? undefined : field} className="space-y-1.5">
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
      </motion.div>

      <AnimatePresence>
        {serverError && (
          <motion.p
            key="server-error"
            role="alert"
            className="text-sm text-center rounded-lg py-2.5 px-3"
            style={{
              color: 'var(--auth-destructive)',
              background: 'oklch(0.97 0.04 25)',
              border: '1px solid oklch(0.88 0.08 25)',
            }}
            initial={reduced ? false : { opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {serverError}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        variants={reduced ? undefined : field}
        whileTap={isSubmitting || reduced ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 font-semibold text-sm transition-colors cursor-pointer"
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
      </motion.div>
    </motion.form>
  );
}
