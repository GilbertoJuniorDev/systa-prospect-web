'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;
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
  const reduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    await fetch('/api/proxy/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => null);
    setSubmitted(true);
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {submitted ? (
        <motion.div
          key="success"
          className="text-center space-y-4 py-4"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          <div className="flex justify-center">
            <motion.div
              initial={reduced ? false : { scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.08 }}
            >
              <CheckCircle className="h-12 w-12" style={{ color: 'var(--auth-accent)' }} />
            </motion.div>
          </div>
          <motion.p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--auth-muted)' }}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.2 }}
          >
            Se este e-mail está cadastrado, você receberá um link de redefinição em breve.
          </motion.p>
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.28 }}
          >
            <Link
              href="/login"
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--auth-accent)' }}
            >
              Voltar ao login
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
          exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.18, ease: 'easeIn' }}
        >
          <motion.div
            className="space-y-1.5"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: EASE, delay: 0.32 }}
          >
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
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: EASE, delay: 0.4 }}
            whileTap={isSubmitting || reduced ? undefined : { scale: 0.98 }}
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
                  Enviando…
                </>
              ) : (
                'Enviar link de redefinição'
              )}
            </Button>
          </motion.div>

          <motion.div
            className="text-center"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.48 }}
          >
            <Link
              href="/login"
              className="text-sm hover:underline"
              style={{ color: 'var(--auth-muted)' }}
            >
              Voltar ao login
            </Link>
          </motion.div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
