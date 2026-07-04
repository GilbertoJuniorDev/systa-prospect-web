'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Loader2, Search } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { consultaSchema, type ConsultaSchemaType } from '@/lib/validations/consulta';
import { runConsulta, exportarConsulta } from '@/lib/consulta-api';
import { getUserCredits, type CreditsResponse } from '@/lib/credits-api';
import type { ConsultaApiBody } from '@/types/consulta';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CustomSelect } from '@/components/ui/custom-select';
import { SegmentedControl } from '@/components/ui/segmented-control';
import {
  MonthYearRangePicker,
  MONTHS,
  type MonthYearRangeValue,
} from '@/components/ui/month-year-range-picker';
import { CnaeMultiSelect } from './CnaeMultiSelect';
import { MunicipioMultiSelect } from './MunicipioMultiSelect';
import { ConsultaResultCard } from './ConsultaResultCard';

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
    dataAberturaDeMes: values.dataAberturaDeMes,
    dataAberturaDeAno: values.dataAberturaDeAno,
    dataAberturaAteMes: values.dataAberturaAteMes,
    dataAberturaAteAno: values.dataAberturaAteAno,
  };
}

function buildFilterSummary(values: ConsultaSchemaType): { label: string; value: string }[] {
  const lines: { label: string; value: string }[] = [];

  lines.push({
    label: 'CNAE(s)',
    value: values.cnaes.map((c) => `${c.codigo} – ${c.descricao}`).join('; '),
  });
  lines.push({ label: 'UF', value: values.uf });
  lines.push({
    label: 'Município(s)',
    value: values.municipios.length > 0
      ? values.municipios.map((m) => m.descricao).join(', ')
      : 'Todos os municípios da UF',
  });
  lines.push({
    label: 'Situação cadastral',
    value: SITUACAO_OPTIONS.find((o) => o.value === values.situacao)?.label ?? values.situacao,
  });
  lines.push({
    label: 'MEI',
    value: MEI_OPTIONS.find((o) => o.value === values.mei)?.label ?? values.mei,
  });

  const hasDe = values.dataAberturaDeMes !== undefined && values.dataAberturaDeAno !== undefined;
  const hasAte = values.dataAberturaAteMes !== undefined && values.dataAberturaAteAno !== undefined;
  if (hasDe || hasAte) {
    const mesLabel = (m?: number) => MONTHS.find((x) => x.value === m)?.label ?? '';
    const de = hasDe ? `${mesLabel(values.dataAberturaDeMes)}/${values.dataAberturaDeAno}` : '—';
    const ate = hasAte ? `${mesLabel(values.dataAberturaAteMes)}/${values.dataAberturaAteAno}` : '—';
    lines.push({ label: 'Período de abertura', value: `De ${de} até ${ate}` });
  } else {
    lines.push({ label: 'Período de abertura', value: 'Sem filtro de data' });
  }

  return lines;
}

export function ConsultaForm() {
  const queryClient = useQueryClient();
  const [consultaTotal, setConsultaTotal] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportInsufficientCredits, setExportInsufficientCredits] = useState<{
    required: number;
    balance: number;
  } | null>(null);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [exportSummary, setExportSummary] = useState<{ label: string; value: string }[]>([]);

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
      dataAberturaDeMes: undefined,
      dataAberturaDeAno: undefined,
      dataAberturaAteMes: undefined,
      dataAberturaAteAno: undefined,
    },
  });

  const watchedUf = watch('uf');
  const [dataAberturaDeMes, dataAberturaDeAno, dataAberturaAteMes, dataAberturaAteAno] = watch([
    'dataAberturaDeMes',
    'dataAberturaDeAno',
    'dataAberturaAteMes',
    'dataAberturaAteAno',
  ]);

  // Clear municipalities and result count when UF changes
  useEffect(() => {
    setValue('municipios', []);
    setConsultaTotal(null);
  }, [watchedUf, setValue]);

  function handleDataAberturaChange(next: MonthYearRangeValue) {
    setValue('dataAberturaDeMes', next.fromMonth, { shouldDirty: true });
    setValue('dataAberturaDeAno', next.fromYear, { shouldDirty: true });
    setValue('dataAberturaAteMes', next.toMonth, { shouldDirty: true });
    setValue('dataAberturaAteAno', next.toYear, { shouldDirty: true, shouldValidate: true });
  }

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

  async function runExport() {
    setExportError(null);
    setExportInsufficientCredits(null);
    setIsExporting(true);
    try {
      const body = buildApiBody(getValues());
      const { blob, newBalance } = await exportarConsulta(body);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consulta_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (newBalance !== null) {
        queryClient.setQueryData(['user-credits'], (old: CreditsResponse | undefined) =>
          old ? { ...old, balance: newBalance } : old,
        );
        queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      }
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

  function handleRequestExport() {
    setExportSummary(buildFilterSummary(getValues()));
    setShowExportConfirm(true);
  }

  function handleCancelExport() {
    setShowExportConfirm(false);
  }

  function handleConfirmExport() {
    setShowExportConfirm(false);
    runExport();
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
          Filtre por CNAE, UF, Município, data de abertura, situação e MEI — depois exporte os resultados em XLSX.
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

                {/* Data de abertura — full width */}
                <div className="md:col-span-2 space-y-1.5">
                  <Label htmlFor="data-abertura-trigger">Data de abertura do CNPJ</Label>
                  <MonthYearRangePicker
                    id="data-abertura-trigger"
                    value={{
                      fromMonth: dataAberturaDeMes,
                      fromYear: dataAberturaDeAno,
                      toMonth: dataAberturaAteMes,
                      toYear: dataAberturaAteAno,
                    }}
                    onChange={handleDataAberturaChange}
                    aria-invalid={!!(
                      errors.dataAberturaDeMes ??
                      errors.dataAberturaDeAno ??
                      errors.dataAberturaAteMes ??
                      errors.dataAberturaAteAno
                    )}
                  />
                  {(errors.dataAberturaDeMes ??
                    errors.dataAberturaDeAno ??
                    errors.dataAberturaAteMes ??
                    errors.dataAberturaAteAno) && (
                    <p role="alert" className="text-xs text-destructive">
                      {
                        (errors.dataAberturaDeMes ??
                          errors.dataAberturaDeAno ??
                          errors.dataAberturaAteMes ??
                          errors.dataAberturaAteAno)?.message
                      }
                    </p>
                  )}
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    Opcional. Filtra empresas abertas dentro do período informado.
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
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {consultaTotal !== null && (
        <ConsultaResultCard
          total={consultaTotal}
          balance={creditsData?.balance}
          isExporting={isExporting}
          canExport={canExport}
          onRequestExport={handleRequestExport}
          exportError={exportError}
          exportInsufficientCredits={exportInsufficientCredits}
          showExportConfirm={showExportConfirm}
          exportSummary={exportSummary}
          onCancelExport={handleCancelExport}
          onConfirmExport={handleConfirmExport}
        />
      )}
    </div>
  );
}
