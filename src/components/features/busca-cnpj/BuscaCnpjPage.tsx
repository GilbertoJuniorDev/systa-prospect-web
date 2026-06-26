'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Search, Loader2, Building2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { buscaCnpjSchema, type BuscaCnpjSchemaType } from '@/lib/validations/busca-cnpj';
import { buscarCnpj } from '@/lib/busca-cnpj-api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CnpjResultCard, CnpjResultSkeleton } from './CnpjResultCard';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FADE_UP = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: EASE },
};

function formatCnpjMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export function BuscaCnpjPage() {
  const [searchCnpj, setSearchCnpj] = useState<string | null>(null);
  const [maskedValue, setMaskedValue] = useState('');

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BuscaCnpjSchemaType>({
    resolver: zodResolver(buscaCnpjSchema),
    defaultValues: { cnpj: '' },
  });

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ['cnpj', searchCnpj],
    queryFn: () => buscarCnpj(searchCnpj!),
    enabled: searchCnpj !== null,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  function handleCnpjChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCnpjMask(e.target.value);
    setMaskedValue(formatted);
    setValue('cnpj', formatted, { shouldValidate: false });
  }

  function onSubmit(values: BuscaCnpjSchemaType) {
    setSearchCnpj(values.cnpj);
  }

  const errorMessage = (() => {
    if (!isError || !error) return null;
    if (axios.isAxiosError(error)) {
      return (error.response?.data as { error?: string })?.error ?? 'Erro ao consultar o CNPJ.';
    }
    return 'Erro ao consultar o CNPJ.';
  })();

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Page header */}
      <motion.div {...FADE_UP} className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}
        >
          Consulta por CNPJ
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Informe um CNPJ de 14 dígitos para obter o cadastro completo da empresa.
        </p>
      </motion.div>

      {/* Search card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Buscar CNPJ</CardTitle>
            <CardDescription>Digite o CNPJ com ou sem formatação.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="cnpj-input">CNPJ</Label>
                  <Input
                    id="cnpj-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="00.000.000/0000-00"
                    value={maskedValue}
                    onChange={handleCnpjChange}
                    aria-invalid={!!errors.cnpj}
                    className="font-mono"
                    autoComplete="off"
                  />
                  {errors.cnpj && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.cnpj.message}
                    </p>
                  )}
                </div>
                <div className="pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isFetching}
                    className="gap-2 w-full sm:w-auto"
                  >
                    {isFetching ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Consultando…
                      </>
                    ) : (
                      <>
                        <Search className="size-4" />
                        Consultar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* States */}
      {isFetching && <CnpjResultSkeleton />}

      {isError && !isFetching && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
        >
          <p className="text-sm font-medium text-destructive">{errorMessage}</p>
        </motion.div>
      )}

      {data && !isFetching && !isError && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <CnpjResultCard data={data} />
        </motion.div>
      )}

      {!searchCnpj && !isFetching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-col items-center gap-3"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <Building2 className="size-12 opacity-20" />
          <p className="text-sm">Digite um CNPJ acima para consultar.</p>
        </motion.div>
      )}
    </div>
  );
}
