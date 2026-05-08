# AGENTS.md

## Proyecto

Tienda web simple para comercio chico.

La app NO procesa pagos online. El objetivo es catálogo + carrito + generación de pedido por WhatsApp.

## Principios

- Mantener el proyecto simple.
- No agregar Mercado Pago, Stripe ni webhooks salvo pedido explícito.
- No agregar usuarios compradores.
- No agregar servidor propio.
- Priorizar deploy estático en Cloudflare Pages.
- Usar Supabase solo para productos, categorías, imágenes, pedidos y configuración.
- Mantener el costo mensual técnico en $0 siempre que sea posible.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Supabase
- React Router
- Zustand o Context API para carrito local

## Reglas de implementación

- El carrito debe vivir en localStorage.
- El checkout genera pedido y abre WhatsApp con mensaje precargado.
- El pedido queda como “pendiente de confirmación”.
- El pago se coordina fuera de la web.
- No mostrar textos como “compra aprobada” o “pago confirmado”.
- Usar textos como:
  - “Pedido generado”
  - “Pendiente de confirmación”
  - “Coordiná el pago y retiro por WhatsApp”

## Seguridad

- Nunca exponer SUPABASE_SERVICE_ROLE_KEY en frontend.
- Usar Row Level Security en Supabase.
- El público puede leer productos activos y crear pedidos.
- Solo admin puede modificar productos, categorías, imágenes, configuración y estados de pedidos.

## Calidad

- Código limpio.
- TypeScript estricto.
- Componentes reutilizables.
- Responsive mobile-first.
- UX simple para usuario no técnico.
- README actualizado con cada cambio importante.