# Publicación en GitHub y Vercel

## Opción A — GitHub Pages

1. Crea un repositorio, por ejemplo `inmudej-delicias`.
2. Sube **todo el contenido** de esta carpeta a la raíz del repositorio.
3. En GitHub entra a **Settings → Pages**.
4. En **Build and deployment** selecciona `Deploy from a branch`.
5. Elige `main` y carpeta `/ (root)`.
6. Guarda. GitHub publicará la URL del sitio.

> Si el repositorio no está en la raíz de un dominio, los enlaces funcionan porque el proyecto usa rutas relativas.

## Opción B — Vercel

1. Importa el repositorio desde `vercel.com/new`.
2. Framework Preset: **Other**.
3. Build Command: dejar vacío.
4. Output Directory: dejar vacío (raíz del proyecto).
5. Deploy.

El archivo `vercel.json` agrega encabezados básicos de seguridad y caché para imágenes/PDF.

## Actualizaciones posteriores

- **PDFs:** agrega o reemplaza archivos en `assets/pdfs/`.
- **Calendario:** edita `assets/data/activities.json`.
- **Fracciones ICHITAIP:** edita `assets/data/fracciones.json` y carga los archivos en `assets/pdfs/ichitaip/`.
- **Imágenes:** reemplaza archivos dentro de `assets/img/` conservando los nombres para no editar HTML.
