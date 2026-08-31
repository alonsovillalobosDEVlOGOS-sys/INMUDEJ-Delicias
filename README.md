# INMUDEJ Delicias — Landing Page

Sitio web estático preparado para **GitHub Pages** y **Vercel**, sin proceso de compilación.

## Estructura

```text
inmudej-landing/
├── index.html
├── visor-pdf.html
├── fracciones-ichitaip.html
├── vercel.json
├── 404.html
├── assets/
│   ├── css/styles.css
│   ├── js/
│   │   ├── app.js
│   │   ├── pdf-viewer.js
│   │   └── fracciones.js
│   ├── data/
│   │   ├── activities.json
│   │   └── fracciones.json
│   ├── img/
│   │   ├── inmudej-logo.png
│   │   ├── identidad-institucional.jpg
│   │   └── natacion-inmudej.jpg
│   └── pdfs/
│       ├── privacidad/
│       ├── normatividad/
│       └── ichitaip/
└── DEPLOY.md
```

## Cargar PDFs de Transparencia

Agrega los archivos con estos nombres:

- `assets/pdfs/privacidad/aviso-privacidad-simplificado.pdf`
- `assets/pdfs/privacidad/aviso-privacidad-integral.pdf`
- `assets/pdfs/normatividad/reglamento-interior-inmudej.pdf`
- `assets/pdfs/normatividad/acuerdo-creacion-inmudej.pdf`
- `assets/pdfs/normatividad/manual-organizacion-inmudej.pdf`

El visor detecta automáticamente si el PDF existe; mientras no esté cargado muestra una pantalla de “Documento preparado para carga”.

## Calendario de actividades

Edita `assets/data/activities.json`. Ejemplo:

```json
[
  {
    "date": "2026-09-12",
    "title": "Torneo municipal de ejemplo",
    "time": "09:00",
    "location": "Polideportivo Bicentenario",
    "category": "Deporte"
  }
]
```

Categorías con color especial: `Deporte`, `Juventud`, `Convocatoria`.

## Fracciones ICHITAIP

1. Guarda archivos dentro de `assets/pdfs/ichitaip/`.
2. Agrega el registro a `assets/data/fracciones.json`:

```json
[
  {
    "fraccion": "Fracción I",
    "titulo": "Marco normativo aplicable",
    "periodo": "2026",
    "descripcion": "Información vigente",
    "archivo": "assets/pdfs/ichitaip/fraccion-i.pdf"
  }
]
```

## Facebook

La sección de publicaciones usa el Page Plugin de Facebook con esta página:

`https://www.facebook.com/INMUDEJDelicias`

Algunos navegadores o bloqueadores de rastreo pueden ocultar el plugin; por eso se incluyen botones directos a la página oficial.

## Contenido institucional a validar

- La **Misión** se redactó con base en el objeto establecido en el Reglamento Interior del INMUDEJ.
- La **Visión** es una propuesta editorial para esta landing y conviene reemplazarla si existe una redacción oficial vigente.
- Los textos de servicios son descripciones generales y deben ajustarse a la cartera oficial que INMUDEJ desee publicar.
