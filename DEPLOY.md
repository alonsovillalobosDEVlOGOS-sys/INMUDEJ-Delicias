# Deploy GitHub + Vercel

## Antes de desplegar

1. Ejecuta, en orden, `supabase/migrations/001_inmudej_cms.sql` y `supabase/migrations/002_inmudej_cms_v4.sql`.
2. Abre `admin.html` en un entorno de prueba y crea el primer administrador `admin`.
3. Confirma que el bootstrap queda cerrado al ingresar correctamente.
4. Revisa `assets/js/config.js`.
5. Nunca subas contraseñas de PostgreSQL ni claves `service_role`/secret al repositorio.

## GitHub

Sube el contenido completo de esta carpeta al repositorio. La raíz debe contener `index.html` y `vercel.json`.

## Vercel

1. Importa el repositorio.
2. Framework Preset: **Other**.
3. Build Command: vacío.
4. Output Directory: `.`
5. Deploy.

## Supabase Auth

Después de conocer el dominio final:

1. Ve a Authentication > URL Configuration.
2. Define `Site URL` con el dominio de Vercel.
3. Añade URLs de redirección de preview sólo si las necesitas.

## Pruebas finales

- `/` carga el carrousel sin áreas blancas.
- El botón **Login** abre el modal.
- `admin` puede iniciar sesión.
- El panel muestra el rol correcto.
- Subir una imagen crea un archivo en `inmudej-public`.
- Crear un aviso, torneo o convocatoria lo refleja en la landing.
- Agregar una fotografía a un servicio la refleja en la tarjeta pública.
- Crear un evento lo refleja en el calendario.
- Invitar un usuario genera una URL de `register.html?token=...`.
- Un editor no ve Usuarios/Roles si no tiene permiso.
