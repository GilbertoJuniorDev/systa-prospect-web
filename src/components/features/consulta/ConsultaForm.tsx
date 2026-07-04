'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Download, Loader2, Search, Coins, AlertTriangle, ExternalLink } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';

import { consultaSchema, type ConsultaSchemaType } from '@/lib/validations/consulta';
import { runConsulta, exportarConsulta } from '@/lib/consulta-api';
import { getUserCredits } from '@/lib/credits-api';
import type { ConsultaApiBody } from '@/types/consulta';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CustomSelect } from '@/components/ui/custom-select';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { CnaeMultiSelect } from './CnaeMultiSelect';
import { MunicipioMultiSelect } from './MunicipioMultiSelect';

const UF_LIST = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

const UF_OPTIONS = UF_LIST.map((uf) => ({ label: uf, value: uf }));

const SITUACAO_OPTIONS = [
  { label: 'Todas', value: 'todas' },
  { label: 'Ativa', value: 'ativa' },
  { label: 'Inativa', value: 'inativa' },
] as const;

const MEI_OPTIONS = [
  { label: 'Todos', value: 'todos' },
  { label: 'Sim', value: 'sim' },
  { label: 'Não', value: 'nao' },
] as const;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FADE_UP = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: EASE },
};

function buildApiBody(values: ConsultaSchemaType): ConsultaApiBody {
  return {
    cnaes: values.cnaes.map((c) => c.codigo),
    uf: values.uf,
    municipios: values.municipios.map((m) => m.codigo),
    situacao: values.situacao,
    mei: values.mei,
  };
}

export function ConsultaForm() {
  const [consultaTotal, setConsultaTotal] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportInsufficientCredits, setExportInsufficientCredits] = useState<{
    required: number;
    balance: number;
  } | null>(null);

  // Fetch user balance to show alongside export button
  const { data: creditsData } = useQuery({
    queryKey: ['user-credits'],
    queryFn: getUserCredits,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ConsultaSchemaType>({
    resolver: zodResolver(consultaSchema),
    defaultValues: {
      cnaes: [],
      uf: '',
      municipios: [],
      situacao: 'todas',
      mei: 'todos',
    },
  });

  const watchedUf = watch('uf');

  // Clear municipalities and result count when UF changes
  useEffect(() => {
    setValue('municipios', []);
    setConsultaTotal(null);
  }, [watchedUf, setValue]);

  const consultaMutation = useMutation({
    mutationFn: (body: ConsultaApiBody) => runConsulta(body),
    onSuccess: (data) => setConsultaTotal(data.total),
    onError: (err: unknown) => {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      setConsultaTotal(null);
      alert(msg ?? 'Erro ao realizar a consulta. Tente novamente.');
    },
  });

  async function onConsultar(values: ConsultaSchemaType) {
    setConsultaTotal(null);
    setExportError(null);
    setExportInsufficientCredits(null);
    consultaMutation.mutate(buildApiBody(values));
  }

  async function onExportar() {
    setExportError(null);
    setExportInsufficientCredits(null);
    setIsExporting(true);
    try {
      const body = buildApiBody(getValues());
      const blob = await exportarConsulta(body);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consulta_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      // When responseType is 'blob', axios wraps a 402 response with Blob data.
      // We need to parse the blob to extract the JSON error payload.
      if (axios.isAxiosError(err) && err.response?.status === 402) {
        try {
          const blobData = err.response.data as Blob;
          const text = await blobData.text();
          const parsed = JSON.parse(text) as { error?: string; required?: number };
          setExportInsufficientCredits({
            required: parsed.required ?? 0,
            balance: creditsData?.balance ?? 0,
          });
        } catch {
          setExportInsufficientCredits({
            required: 0,
            balance: creditsData?.balance ?? 0,
          });
        }
        return;
      }

      let msg = 'Erro ao exportar. Tente novamente.';
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response?: { data?: { error?: string } } }).response;
        if (res?.data?.error) msg = res.data.error;
      }
      setExportError(msg);
    } finally {
      setIsExporting(false);
    }
  }

  const isConsulting = consultaMutation.isPending;
  const canExport = consultaTotal !== null && consultaTotal > 0 && !isExporting;

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Page header */}
      <motion.div {...FADE_UP} className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}
        >
          Consulta de Estabelecimentos
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Filtre por CNAE, UF, Município, situação e MEI — depois exporte os resultados em XLSX.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Consulta</CardTitle>
            <CardDescription>
              Campos marcados com * são obrigatórios.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onConsultar)} noValidate>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* CNAE(s) — full width */}
                <div className="md:col-span-2 space-y-1.5">
                  <Label htmlFor="cnae-search">
                    CNAE(s) <span aria-hidden="true" className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="cnaes"
                    control={control}
                    render={({ field }) => (
                      <CnaeMultiSelect
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.cnaes && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.cnaes.message ?? errors.cnaes.root?.message}
                    </p>
                  )}
                </div>

                {/* UF */}
                <div className="space-y-1.5">
                  <Label htmlFor="uf-select">
                    UF <span aria-hidden="true" className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="uf"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        id="uf-select"
                        options={UF_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Selecione a UF…"
                        aria-invalid={!!errors.uf}
                      />
                    )}
                  />
                  {errors.uf && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.uf.message}
                    </p>
                  )}
                </div>

                {/* Município(s) */}
                <div className="space-y-1.5">
                  <Label>Município(s)</Label>
                  <Controller
                    name="municipios"
                    control={control}
                    render={({ field }) => (
                      <MunicipioMultiSelect
                        uf={watchedUf}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    Opcional. Deixe em branco para todos os municípios da UF.
                  </p>
                </div>

                {/* Situação */}
                <div className="space-y-1.5">
                  <Label>Situação Cadastral</Label>
                  <Controller
                    name="situacao"
                    control={control}
                    render={({ field }) => (
                      <SegmentedControl
                        options={SITUACAO_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                {/* MEI */}
                <div className="space-y-1.5">
                  <Label>MEI</Label>
                  <Controller
                    name="mei"
                    control={control}
                    render={({ field }) => (
                      <SegmentedControl
                        options={MEI_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Action bar */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isConsulting}
                  className="gap-2"
                >
                  {isConsulting ? (
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

                <div className="flex flex-col items-start gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    disabled={!canExport}
                    onClick={onExportar}
                    className="gap-2"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Exportando…
                      </>
                    ) : (
                      <>
                        <Download className="size-4" />
                        Exportar XLSX
                      </>
                    )}
                  </Button>
                  {/* Balance badge */}
                  {creditsData !== undefined && (
                    <span
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: 'oklch(0.94 0.025 290)',
                        color: 'oklch(0.40 0.12 290)',
                        border: '1px solid oklch(0.85 0.06 290)',
                      }}
                      aria-label={`Saldo atual: ${creditsData.balance} registros`}
                    >
                      <Coins className="size-3" aria-hidden="true" />
                      Saldo: {creditsData.balance.toLocaleString('pt-BR')} registros
                    </span>
                  )}
                </div>
              </div>

              {/* Result count + estimated export cost */}
              {consultaTotal !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-2"
                >
                  {consultaTotal === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Nenhum estabelecimento encontrado para os filtros selecionados.
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        <span
                          className="font-bold"
                          style={{ color: 'oklch(0.52 0.22 290)' }}
                        >
                          {consultaTotal.toLocaleString('pt-BR')}
                        </span>{' '}
                        estabelecimento{consultaTotal !== 1 ? 's' : ''} encontrado
                        {consultaTotal !== 1 ? 's' : ''}.
                        <span className="ml-2 text-muted-foreground">
                          Clique em &ldquo;Exportar XLSX&rdquo; para baixar.
                        </span>
                      </p>
                      {/* Estimated export cost */}
                      <span
                        className="inline-flex items-center gap-1.5 text-xs"
                        style={{ color: 'var(--muted-foreground)' }}
                        aria-label={`Exportar ${consultaTotal.toLocaleString('pt-BR')} registros consumirá ${consultaTotal.toLocaleString('pt-BR')} do seu saldo`}
                      >
                        <Coins className="size-3 shrink-0" aria-hidden="true" />
                        Exportar ~{consultaTotal.toLocaleString('pt-BR')} registros consumirá{' '}
                        <strong>{consultaTotal.toLocaleString('pt-BR')}</strong>{' '}
                        registro{consultaTotal !== 1 ? 's' : ''} do seu saldo
                      </span>
                    </>
                  )}
                </motion.div>
              )}

              {/* Export error — generic */}
              {exportError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  role="alert"
                  className="mt-3 text-sm text-destructive"
                >
                  {exportError}
                </motion.p>
              )}

              {/* Export error — 402 insufficient credits */}
              {exportInsufficientCredits && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 rounded-xl border p-4"
                  style={{
                    background: 'oklch(0.97 0.025 60)',
                    borderColor: 'oklch(0.80 0.10 60)',
                  }}
                  role="alert"
                  aria-live="polite"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className="size-5 shrink-0 mt-0.5"
                      style={{ color: 'oklch(0.55 0.18 60)' }}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'oklch(0.35 0.14 60)' }}>
                        Registros insuficientes para exportar
                      </p>
                      <p className="mt-0.5 text-sm" style={{ color: 'oklch(0.45 0.10 60)' }}>
                        {exportInsufficientCredits.required > 0
                          ? `Você precisaria de ${exportInsufficientCredits.required.toLocaleString('pt-BR')} registros, mas possui apenas ${exportInsufficientCredits.balance.toLocaleString('pt-BR')}.`
                          : 'Você não tem registros suficientes para exportar esta consulta.'}
                      </p>
                      <Link
                        href="/creditos"
                        className="mt-2 inline-flex items-center gap-1 text-sm font-medium underline-offset-2 hover:underline transition-colors"
                        style={{ color: 'oklch(0.45 0.18 290)' }}
                      >
                        Comprar registros
                        <ExternalLink className="size-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
