import { z } from 'zod';

const cnaeOptionSchema = z.object({
  codigo: z.string(),
  descricao: z.string(),
});

const municipioOptionSchema = z.object({
  codigo: z.string(),
  descricao: z.string(),
});

export const consultaSchema = z.object({
  cnaes: z
    .array(cnaeOptionSchema)
    .min(1, 'Selecione ao menos um CNAE.'),
  uf: z.string().length(2, 'Selecione uma UF.'),
  municipios: z.array(municipioOptionSchema),
  situacao: z.enum(['todas', 'ativa', 'inativa']),
  mei: z.enum(['todos', 'sim', 'nao']),
});

export type ConsultaSchemaType = z.infer<typeof consultaSchema>;
