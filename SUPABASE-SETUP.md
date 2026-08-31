# Configuración Supabase — INMUDEJ CMS v3

Esta versión ya está preparada para trabajar con el proyecto Supabase configurado en `assets/js/config.js`.

## 1. Ejecutar la migración

1. Entra a Supabase > SQL Editor.
2. Abre `supabase/migrations/001_inmudej_cms.sql`.
3. Copia todo el contenido y ejecútalo una sola vez.
4. La migración crea:
   - Roles y permisos.
   - Perfiles de usuarios.
   - Invitaciones.
   - Configuración institucional.
   - Carrousel.
   - Convocatorias.
   - Formularios.
   - Calendario.
   - Servicios y costos.
   - Documentos de transparencia.
   - Bucket público `inmudej-public`.
   - Políticas RLS.
   - Funciones para login por usuario, bootstrap inicial e invitaciones.

## 2. Activar el primer administrador

1. Antes de publicar el sitio, abre `admin.html` en el mismo dominio de prueba.
2. Si `bootstrap_open` está activo, aparecerá **Primera configuración**.
3. El usuario principal queda definido como `admin`.
4. Indica nombre, correo real y contraseña.
5. Si Supabase exige confirmación de correo, confirma el mensaje y vuelve a `admin.html`.
6. Ingresa con:
   - Usuario: `admin`
   - Contraseña: la que definiste.
7. Al primer ingreso, el sistema reclama automáticamente el rol `Administrador general` y cierra el bootstrap.

> Recomendación: realiza este paso antes de hacer público el deployment.

## 3. Usuarios adicionales

No se utiliza una `service_role` en el navegador.

Desde **Administración > Usuarios**:
1. Pulsa **Invitar usuario**.
2. Define correo, usuario y rol.
3. Se genera un enlace único de `register.html?token=...`.
4. Envía ese enlace al colaborador.
5. El colaborador crea su contraseña y Supabase le asigna el rol de la invitación.

## 4. Roles incluidos

- **Administrador general**: acceso completo.
- **Editor de contenido**: contenido, calendario, servicios, transparencia e información institucional.
- **Agenda y convocatorias**: convocatorias, formularios y calendario.
- **Solo consulta**: acceso al panel sin permisos de modificación.

El Administrador puede crear roles adicionales y combinar permisos desde el módulo **Roles y permisos**.

## 5. Archivos

Las nuevas fotografías y PDF se suben al bucket público:

`inmudej-public`

Carpetas creadas dinámicamente:
- `carousel/`
- `convocatorias/`
- `formularios/`
- `transparencia/`
- `servicios/`

El bucket limita los archivos a 10 MB.

## 6. Migrar datos del CMS v2

Si el navegador conserva datos en `localStorage` de la versión anterior, el dashboard mostrará una tarjeta:

**Migrar datos locales a Supabase**

El proceso hace `upsert` de la configuración y contenido anterior hacia las nuevas tablas.

## 7. Seguridad

El navegador utiliza únicamente la URL pública de Supabase y la **publishable key**. Esto es correcto para aplicaciones web siempre que las políticas RLS estén activas.

No debe incorporarse en HTML, JavaScript, GitHub o Vercel ninguna contraseña de PostgreSQL, `service_role`, secret key o cadena `DATABASE_URL`.

La conexión PostgreSQL proporcionada para tareas administrativas no fue almacenada en este proyecto.

## 8. Auth en producción

En Supabase > Authentication:
- Mantén activado Email/Password.
- Para el primer administrador puedes conservar la confirmación por correo y usar un correo real.
- Configura `Site URL` con el dominio final de Vercel.
- Agrega el dominio de preview sólo si vas a validar correos desde previews.

## 9. Vercel

Este proyecto sigue siendo un sitio estático. No requiere backend de Vercel porque Supabase proporciona Auth, Data API y Storage.

Sube toda la carpeta a GitHub y conecta el repositorio a Vercel. No agregues secretos de PostgreSQL al repositorio.
