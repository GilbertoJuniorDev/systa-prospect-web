'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema } from '@/lib/validations/auth';
import type { RegisterFormValues } from '@/types/auth';

const EASE = [0.16, 1, 0.3, 1] as const;

const field: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.28 } },
};

export function RegisterForm() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormValues) {
    setServerError(null);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push('/dashboard');
      router.refresh();
      return;
    }

    const json = await res.json().catch(() => ({}));
    const errorCode = (json as { error?: string }).error;

    if (errorCode === 'email_already_exists') {
      setServerError('Este e-mail já está cadastrado. Tente fazer login.');
    } else {
      setServerError('Não foi possível criar a conta. Tente novamente.');
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
      {/* Name (optional) */}
      <motion.div variants={reduced ? undefined : field} className="space-y-1.5">
        <Label
          htmlFor="name"
          className="text-sm font-medium"
          style={{ color: 'var(--auth-primary)' }}
        >
          Nome{' '}
          <span className="font-normal text-xs" style={{ color: 'var(--auth-muted)' }}>
            (opcional)
          </span>
        </Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Seu nome"
          {...register('name')}
          aria-invalid={!!errors.name}
          style={{ borderColor: 'var(--auth-border)' }}
        />
        {errors.name && (
          <p role="alert" className="text-xs mt-1" style={{ color: 'var(--auth-destructive)' }}>
            {errors.name.message}
          </p>
        )}
      </motion.div>

      {/* Email */}
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

      {/* Password */}
      <motion.div variants={reduced ? undefined : field} className="space-y-1.5">
        <Label
          htmlFor="password"
          className="text-sm font-medium"
          style={{ color: 'var(--auth-primary)' }}
        >
          Senha
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            {...register('password')}
            aria-invalid={!!errors.password}
            className="pr-10"
            style={{ borderColor: 'var(--auth-border)' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer transition-opacity hover:opacity-70"
            style={{ color: 'var(--auth-muted)' }}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.password && (
          <p role="alert" className="text-xs mt-1" style={{ color: 'var(--auth-destructive)' }}>
            {errors.password.message}
          </p>
        )}
      </motion.div>

      {/* Confirm Password */}
      <motion.div variants={reduced ? undefined : field} className="space-y-1.5">
        <Label
          htmlFor="confirmPassword"
          className="text-sm font-medium"
          style={{ color: 'var(--auth-primary)' }}
        >
          Confirmar senha
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repita a senha"
            {...register('confirmPassword')}
            aria-invalid={!!errors.confirmPassword}
            className="pr-10"
            style={{ borderColor: 'var(--auth-border)' }}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
            className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer transition-opacity hover:opacity-70"
            style={{ color: 'var(--auth-muted)' }}
            tabIndex={-1}
          >
            {showConfirm ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p role="alert" className="text-xs mt-1" style={{ color: 'var(--auth-destructive)' }}>
            {errors.confirmPassword.message}
          </p>
        )}
      </motion.div>

      {/* Server error */}
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

      {/* Submit */}
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
              Criando conta…
            </>
          ) : (
            'Criar conta'
          )}
        </Button>
      </motion.div>

      {/* Login link */}
      <motion.div
        variants={reduced ? undefined : field}
        className="text-center text-sm"
        style={{ color: 'var(--auth-muted)' }}
      >
        Já tem conta?{' '}
        <Link
          href="/login"
          className="font-medium hover:underline transition-colors"
          style={{ color: 'var(--auth-accent)' }}
        >
          Entrar
        </Link>
      </motion.div>
    </motion.form>
  );
}
