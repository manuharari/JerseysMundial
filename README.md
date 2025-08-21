# MundialJerseys — Next.js 14 (App Router) + Prisma + Mercado Pago

Proyecto migrado a App Router (carpeta /app). Mantiene Tailwind, Prisma y la integración con Mercado Pago.

## Cambios principales
- Rutas movidas a `/app` (App Router, server components por defecto).
- Endpoints convertidos a `app/api/*/route.ts` (route handlers).
- Admin UI convertido a componente cliente (`components/AdminClient.tsx`) y protegido por cookie (`admin_auth`).
- `BuyButton` como componente cliente para manejar la redirección al checkout.
