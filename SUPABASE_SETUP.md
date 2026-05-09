# Supabase Setup

Guia puntual para dejar Supabase listo para la demo real de UrbanCity.

## 1. Ejecutar el schema

1. Crear un proyecto nuevo en Supabase.
2. Abrir `SQL Editor`.
3. Ejecutar completo `supabase/schema.sql`.

## 2. Crear el primer admin

1. Ir a `Authentication > Users`.
2. Crear un usuario con email y password.
3. Copiar el `id` del usuario creado en `auth.users`.
4. Insertar ese usuario en `public.admin_users`:

```sql
insert into public.admin_users (user_id, is_active)
values ('<auth-user-uuid>', true);
```

## 3. Verificar Storage

Confirmar:
- existe el bucket `product-images`
- el bucket permite lectura publica de imagenes
- el panel admin puede subir y eliminar imagenes autenticado como admin

## 4. Verificar RLS

Confirmar:
- `categories`, `products`, `product_images` y `store_settings` tienen lectura publica segun el schema
- `orders` y `order_items` quedan reservados para admin
- la creacion publica de pedidos ocurre via RPC `create_order_with_items`
- solo admin autenticado puede modificar catalogo, configuracion y estados de pedido

## 5. Crear la primera configuracion del comercio

No cargues `store_settings` manualmente salvo emergencia.

Flujo recomendado:
1. iniciar sesion en `/admin/login`
2. entrar a `/admin/configuracion`
3. crear la primera configuracion del comercio desde el formulario

Campos:
- `store_name`
- `whatsapp_phone`
- `instagram_url`
- `address`
- `opening_hours`
- `checkout_message`

## 6. Regla de seguridad

No uses `SUPABASE_SERVICE_ROLE_KEY` en frontend.

Solo deben configurarse variables publicas del cliente:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
