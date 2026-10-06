# Hyrux

Hyrux is a responsive startup landing page built with server-rendered React.

## Tech Stack

- React 19 and TypeScript
- TanStack Start and TanStack Router
- Vite 8
- Tailwind CSS 4
- Radix UI primitives and Lucide icons

## Requirements

- Node.js 22.12 or newer
- npm

## Setup

```sh
npm ci
npm run dev
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check TypeScript without emitting files |

## Project CMS

The website now includes an integrated private CMS for project management.

- Admin login: `/admin/login`
- Admin dashboard: `/admin`
- Project list: `/admin/projects`
- Public listing: `/projects`
- Project detail: `/projects/:slug`

### Admin Credentials

Configure admin credentials with environment variables:

- `CYRUX_ADMIN_EMAIL`
- `CYRUX_ADMIN_PASSWORD_HASH`

An example file is provided at `.env.example`.

For local development only, you may set `CYRUX_ADMIN_PASSWORD` instead of a hash.
