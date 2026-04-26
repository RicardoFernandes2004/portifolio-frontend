# Portifolio Frontend

Front-end Next.js 14 (App Router + TypeScript + Tailwind) com tema **cyberpunk / neon** integrado ao backend NestJS do portfolio (`portifolio-backend`).

## Stack

- **Next.js 14** — App Router, Route Handlers, Middleware, Server Components
- **TypeScript** — strict
- **Tailwind CSS** — tema custom com CSS vars + animations
- **TanStack Query** — cache de chamadas autenticadas no admin
- **Axios** — client HTTP com interceptor de JWT
- **React Hook Form + Zod** — formulários
- **react-markdown + rehype-highlight** — render de posts no blog
- **@uiw/react-md-editor** — editor markdown no admin
- **Framer Motion** — animações
- **lucide-react** — ícones

## Pré-requisitos

- Node.js >= 18.18 (testado em Node 24)
- Backend rodando em `http://localhost:3001` ([swagger em `/docs`](http://localhost:3001/docs))

> Ajuste o CORS do backend para liberar `http://localhost:3000`. Em NestJS basta `app.enableCors({ origin: 'http://localhost:3000', credentials: true })` no `main.ts`.

## Rodando

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Abra http://localhost:3000.

Para login admin, acesse `/login` e use as credenciais do seu usuário do backend (email **ou** username + password).

## Estrutura de rotas

### Pública

| Rota | Descrição |
|---|---|
| `/` | Hero + projetos em destaque + posts recentes + CTA download |
| `/projects` | Grid de projetos |
| `/projects/[id]` | Detalhe do projeto (galeria, tech, links sociais, colaboradores) |
| `/experiences` | Timeline de experiências profissionais |
| `/about` | Resume header + skills + languages + educations |
| `/blog` | Lista de posts publicados (com filtro por categoria) |
| `/blog/[slug]` | Detalhe do post (markdown) |
| `/download` | Faz download do PDF do currículo gerado dinamicamente |
| `/login` | Login do admin |

### Admin (protegida)

`/admin` (dashboard), `/admin/posts`, `/admin/projects`, `/admin/experiences`, `/admin/educations`, `/admin/skills`, `/admin/languages`, `/admin/categories`, `/admin/resume`.

## Segurança

O JWT do backend é armazenado em **cookie httpOnly** setado por uma Route Handler (`/api/auth/login`), nunca exposto ao JS do cliente. Um middleware Next.js bloqueia `/admin/*` quando o cookie está ausente ou expirado.

## Build

```bash
npm run build
npm run start
```

## Variáveis de ambiente

| Var | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL do backend acessível pelo navegador |
| `API_URL` | URL do backend acessível pelo servidor Next (Route Handlers, RSC) |
