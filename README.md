# UrbanCity

Storefront estatico para un comercio chico que vende por catalogo, carrito y cierre por WhatsApp. Esta base prioriza simplicidad operativa: no hay pagos online, no hay cuentas de comprador y no hay servidor propio.

Estado actual:

- Publico: `home`, `catalogo`, `detalle`, `carrito`, `checkout` y `contacto`.
- Datos: fallback demo o Supabase si `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estan configurados.
- Checkout: genera resumen de pedido para WhatsApp y ya puede persistir en Supabase usando la RPC `create_order_with_items`.
- Admin: estructura inicial y pantallas placeholder. Login real y CRUD quedan para la siguiente etapa.

## Stack

- React + Vite + TypeScript estricto
- Tailwind CSS v4
- React Router
- Zustand persistido en `localStorage`
- React Hook Form + Zod
- Supabase JS

## Instalacion

```bash
npm install
npm run dev
```

Build de produccion:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Variables de entorno

Copiá `.env.example` a `.env` y completá:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

No uses `SUPABASE_SERVICE_ROLE_KEY` en el frontend.

## Configuracion de Supabase

1. Crear un proyecto en Supabase.
2. Ejecutar el script [supabase/sql/001_initial_schema.sql](/C:/Users/gonza/Documents/UrbanCity/supabase/sql/001_initial_schema.sql:1).
3. Verificar que el bucket `product-images` exista.
4. Cargar una fila inicial en `store_settings`.
5. Crear al menos un usuario admin en Supabase Auth.
6. Insertar ese usuario en `public.admin_users`.

Ejemplo de `store_settings`:

```sql
insert into public.store_settings (
  store_name,
  whatsapp_phone,
  instagram_url,
  address,
  opening_hours,
  checkout_message
) values (
  'UrbanCity Atelier',
  '5491123456789',
  'https://instagram.com/urbancity.atelier',
  'Av. Directorio 1420, Caballito, Buenos Aires',
  'Lunes a sabados de 10:00 a 19:30',
  'La disponibilidad final y el pago se coordinan por WhatsApp.'
);
```

## SQL y seguridad

El script crea:

- Tablas base del storefront y pedidos.
- Tabla `admin_users`.
  Sin esta tabla no hay forma seria de escribir RLS admin-only con Supabase Auth.
- Politicas RLS para lectura publica controlada.
- RPC `create_order_with_items` para crear pedidos publicos sin abrir inserts directos sobre todo el esquema.
- Bucket y politicas iniciales para `product-images`.

## Crear el primer admin

1. Crear el usuario desde Supabase Auth.
2. Buscar su `id` en `auth.users`.
3. Ejecutar:

```sql
insert into public.admin_users (id, email, display_name)
select id, email, 'Owner'
from auth.users
where email = 'tu-admin@dominio.com';
```

## Deploy en Cloudflare Pages

Configuracion recomendada:

- Build command: `npm run build`
- Build output directory: `dist`
- Framework preset: `Vite`
- Variables de entorno: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

El archivo `public/_redirects` ya deja lista la app para SPA routing.

## Estructura base

```text
src/
  components/
    ui/
    layout/
    product/
    cart/
    admin/
  pages/
    public/
    admin/
  routes/
  lib/
  store/
  types/
  schemas/
  hooks/
  data/
```

## Como usar el panel

En esta primera base el panel solo tiene placeholders en `/admin` y `/admin/login`.

Siguiente etapa recomendada:

1. Login real con Supabase Auth.
2. Guard de rutas admin.
3. CRUD de categorias y productos.
4. Upload de imagenes a Storage.
5. Vista de pedidos y cambio de estados.
6. Configuracion editable de `store_settings`.
