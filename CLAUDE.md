# CLAUDE.md

@AGENTS.md

## Visão Geral do Projeto

Aplicação Next.js com App Router, TypeScript em modo estrito, Tailwind CSS para estilização, Zustand para estado global e Jest + Testing Library para testes.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Linguagem | TypeScript (strict mode) |
| Estilo | Tailwind CSS |
| Estado global | Zustand |
| Testes | Jest + Testing Library |
| Linting | ESLint + Prettier |

---

## Comandos essenciais

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção
npm start            # servidor de produção
npm run lint         # ESLint em todo o projeto
npm run type-check   # tsc --noEmit (sem emitir arquivos)
npm test             # Jest (todos os testes)
npm run test:watch   # Jest em modo watch
npm run test:ci      # Jest com coverage para CI
```

> Sempre use `npm`. Nunca `yarn` ou `pnpm`.

---

## Estrutura de pastas

```
src/
├── app/                    # Rotas, layouts e páginas (App Router)
│   ├── (auth)/             # Route group — sem segmento de URL
│   ├── (marketing)/
│   ├── api/                # Route Handlers
│   ├── layout.tsx          # Root layout
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/                 # Componentes base reutilizáveis (Button, Input, Card…)
│   └── features/           # Componentes de domínio (AuthForm, UserCard…)
│
├── hooks/                  # Custom hooks (use-prefixados)
├── lib/                    # Helpers, utils, clientes de API
├── store/                  # Stores Zustand (um arquivo por domínio)
├── types/                  # Tipos e interfaces globais
└── styles/                 # globals.css e tokens extras
```

---

## TypeScript — strict mode

O `tsconfig.json` tem `"strict": true`. Isso significa:

- **Proibido `any`** — use `unknown` e faça narrowing, ou tipagem explícita.
- **Sem asserções non-null** (`!`) sem comentário justificando.
- **Tipos de retorno explícitos** em funções exportadas e Server Actions.
- **Sem `@ts-ignore`** — use `@ts-expect-error` com comentário obrigatório.
- Props de componentes sempre em interface nomeada `{Component}Props`.

```typescript
// ✅ correto
interface UserCardProps {
  userId: string
  onSelect: (id: string) => void
}

export function UserCard({ userId, onSelect }: UserCardProps): JSX.Element { ... }

// ❌ errado
export function UserCard({ userId, onSelect }: any) { ... }
```

---

## Arquitetura de componentes (App Router)

### Regra principal: Server Component por padrão

Adicione `'use client'` **apenas** quando o componente precisar de:
- Hooks do React (`useState`, `useEffect`, `useContext`…)
- Eventos do browser (`onClick`, `onChange`…)
- APIs do browser (`localStorage`, `window`…)
- Store do Zustand (qualquer `useStore`)

```typescript
// ✅ Server Component — sem diretiva, busca dados diretamente
async function ProductList() {
  const products = await fetchProducts()
  return <ul>{products.map(p => <ProductItem key={p.id} {...p} />)}</ul>
}

// ✅ Client Component — apenas onde necessário
'use client'
function AddToCartButton({ productId }: { productId: string }) {
  const addItem = useCartStore(s => s.addItem)
  return <button onClick={() => addItem(productId)}>Adicionar</button>
}
```

### Colocation de arquivos

Coloque arquivos relacionados próximos ao componente que os usa:

```
components/features/user-card/
├── user-card.tsx
├── user-card.test.tsx
└── user-card.types.ts   # se os tipos não forem globais
```

### Barrel exports

Cada pasta de componente expõe um `index.ts`:

```typescript
// components/ui/index.ts
export { Button } from './button/button'
export { Input } from './input/input'
export { Card, CardHeader, CardContent } from './card/card'
```

---

## Zustand — padrão de stores

Uma store por domínio. Arquivo em `src/store/{domain}.store.ts`.

```typescript
// src/store/cart.store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface CartItem {
  id: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (id: string) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        addItem: (id) =>
          set((state) => {
            const existing = state.items.find((i) => i.id === id)
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.id === id ? { ...i, quantity: i.quantity + 1 } : i
                ),
              }
            }
            return { items: [...state.items, { id, quantity: 1 }] }
          }),
        removeItem: (id) =>
          set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
        clearCart: () => set({ items: [] }),
      }),
      { name: 'cart-storage' }
    ),
    { name: 'CartStore' }
  )
)
```

**Seletores** — sempre use seletores granulares para evitar re-renders:

```typescript
// ✅ re-renderiza só quando items.length muda
const count = useCartStore(s => s.items.length)

// ❌ re-renderiza em qualquer mudança na store
const { items } = useCartStore()
```

---

## Tailwind CSS — padrões

### Utilitário `cn()`

Sempre use `cn()` (clsx + tailwind-merge) para combinar classes condicionais.
Crie em `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

Uso:

```typescript
<div className={cn(
  'rounded-lg border p-4',
  isActive && 'border-blue-500 bg-blue-50',
  isDisabled && 'cursor-not-allowed opacity-50',
  className  // sempre aceite className como prop opcional
)} />
```

### Regras de estilo

- **Sem `style={{}}`** — use Tailwind. Se precisar de valor dinâmico, use CSS variables.
- **Sem classes Tailwind hardcoded em lógica JS** — extraia para variáveis ou `cva`.
- Use `cva` (class-variance-authority) para variantes de componente:

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  className?: string
}
```

---

## Testes — Jest + Testing Library

### Nomenclatura e localização

- Arquivo de teste ao lado do componente: `button.test.tsx`
- Testes de hook: `use-cart.test.ts`
- Testes de utilitário: `utils.test.ts`

### Padrões obrigatórios

```typescript
import { render, screen, userEvent } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renderiza o texto corretamente', () => {
    render(<Button>Salvar</Button>)
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument()
  })

  it('chama onClick ao ser clicado', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Salvar</Button>)
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('fica desabilitado quando a prop disabled é passada', () => {
    render(<Button disabled>Salvar</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Queries por prioridade (Testing Library)

1. `getByRole` — sempre que possível
2. `getByLabelText` — formulários
3. `getByPlaceholderText` — inputs sem label visível
4. `getByText` — conteúdo estático
5. `getByTestId` — último recurso, use `data-testid`

### Mockando Zustand em testes

```typescript
jest.mock('@/store/cart.store', () => ({
  useCartStore: jest.fn(),
}))

beforeEach(() => {
  (useCartStore as jest.Mock).mockImplementation((selector) =>
    selector({ items: [], addItem: jest.fn() })
  )
})
```

---

## Data fetching — Server Components

Prefira buscar dados diretamente no Server Component. Só use Route Handlers para:
- Webhooks externos
- Mutações via formulário sem Server Actions
- Endpoints consumidos por terceiros

```typescript
// ✅ busca no servidor, sem overhead de cliente
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({ where: { id: params.id } })
  if (!product) notFound()
  return <ProductDetail product={product} />
}
```

### Server Actions para mutações

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const CreateProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
})

export async function createProduct(formData: FormData) {
  const parsed = CreateProductSchema.safeParse({
    name: formData.get('name'),
    price: Number(formData.get('price')),
  })

  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  await db.product.create({ data: parsed.data })
  revalidatePath('/products')
  return { success: true }
}
```

---

## Tratamento de erros

- `error.tsx` em cada segmento que pode falhar (sempre `'use client'`).
- `not-found.tsx` para rotas e recursos inexistentes.
- `loading.tsx` com Suspense boundaries explícitos para UX de carregamento.
- Nunca faça `catch` silencioso — logue ou relance o erro.

```typescript
// app/products/error.tsx
'use client'

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div role="alert">
      <p>Ocorreu um erro ao carregar os produtos.</p>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  )
}
```

---

## Acessibilidade (obrigatório)

- HTML semântico: `<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`.
- Todo `<img>` tem `alt` descritivo (ou `alt=""` se decorativo).
- Todo formulário tem `<label>` associado via `htmlFor` / `id`.
- Ícones sem texto visível têm `aria-label` ou `aria-hidden + texto visível ao lado`.
- Ordem de foco com teclado deve ser lógica e visível.
- Contraste mínimo WCAG AA (4.5:1 para texto normal).

---

## Convenções de nomenclatura

| Item | Convenção | Exemplo |
|---|---|---|
| Componente | PascalCase | `UserCard.tsx` |
| Hook | camelCase com `use` | `useCartStore.ts` |
| Store | camelCase com `use` | `cart.store.ts` |
| Utilitário | camelCase | `format-date.ts` |
| Constante global | UPPER_SNAKE | `MAX_RETRIES` |
| Variável/função | camelCase | `fetchProducts` |
| Rota de pasta | kebab-case | `app/user-profile/` |
| Interface de props | PascalCase + Props | `UserCardProps` |

---

## Git — commits convencionais

```
feat(cart): adiciona remoção de item por swipe
fix(auth): corrige redirect após login social
refactor(product): extrai lógica de preço para hook
test(button): adiciona teste de estado desabilitado
chore(deps): atualiza next para 14.2
```

Tipos: `feat` · `fix` · `refactor` · `test` · `docs` · `chore` · `perf` · `style`

---

## Checklist antes de cada PR

- [ ] `pnpm type-check` sem erros
- [ ] `pnpm lint` sem warnings
- [ ] `pnpm test` 100% passando
- [ ] Nenhum `console.log` esquecido
- [ ] Nenhum `any` sem justificativa
- [ ] Server/Client Components usados corretamente
- [ ] Acessibilidade verificada (roles, alt, labels)
- [ ] Tratamento de loading e error states
