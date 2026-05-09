# Demo Precheck

Checklist concreta para ejecutar antes de configurar servicios externos y publicar la demo online.

## A. Local

- ejecutar `npm install`
- ejecutar `npm run build`
- ejecutar `npm run lint`
- confirmar que la app levanta con `npm run dev`
- confirmar que sin variables de entorno usa mocks locales

## B. Supabase

- crear un proyecto nuevo en Supabase
- ejecutar `supabase/schema.sql` completo desde `SQL Editor`
- confirmar tablas:
  - `categories`
  - `products`
  - `product_images`
  - `orders`
  - `order_items`
  - `store_settings`
  - `admin_users`
- confirmar RPC `create_order_with_items`
- confirmar bucket `product-images`
- confirmar policies RLS
- crear usuario admin en `Authentication > Users`
- insertar el usuario en `public.admin_users`

```sql
insert into public.admin_users (user_id, is_active)
values ('<auth-user-uuid>', true);
```

## C. Cloudflare Pages

- conectar el repo de GitHub
- seleccionar branch `main`
- elegir preset `Vite`
- configurar build command `npm run build`
- configurar output directory `dist`
- cargar variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- deploy

## D. Post deploy

- abrir `/`
- abrir `/catalogo`
- abrir `/carrito`
- abrir `/admin/login`
- crear `store_settings`
- crear categoria
- crear producto
- subir imagen
- generar pedido
- abrir WhatsApp
- verificar pedido en admin

## Resultado esperado

Si todo esto pasa sin errores visibles:
- el storefront queda listo para demo publica
- el panel admin queda listo para carga operativa basica
- Supabase y Cloudflare Pages quedan correctamente conectados
