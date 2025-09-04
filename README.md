
# Tienda de Cómics

Proyecto fullstack para gestionar y visualizar cómics usando React, TypeScript, Vite (frontend) y Express + SQL Server (backend).

## Arquitectura del Sistema

```mermaid
graph TB
    subgraph "Frontend (React + TypeScript + Vite)"
        A[HomePage.tsx] --> B[CatalogoComics.tsx]
        B --> C[ComicDetail.tsx]
        B --> D[Carrito.tsx]
        A --> E[VentasTienda.tsx]
        F[App.tsx] --> A
        F --> B
        F --> C
        F --> D
        F --> E
        G[useComicFilters.ts] --> B
        H[App.css] --> F
        I[index.css] --> F
    end

    subgraph "Backend (Express + TypeScript)"
        J[index.ts] --> K[Express Server]
        K --> L[API Routes]
    end

    subgraph "Base de Datos (SQL Server)"
        M[(Comics)]
        N[(Users)]
        O[(Orders)]
        P[(Compras)]
        Q[(Review)]
        R[(Suppliers)]
        S[Triggers] --> M
        S --> N
        S --> O
    end

    subgraph "Assets"
        T[public/images/] --> B
        U[public/home/] --> A
        V[public/logo.png] --> F
    end

    F -->|HTTP Requests| L
    L -->|SQL Queries| M
    L --> N
    L --> O
    L --> P
    L --> Q
    L --> R

    style A fill:#e1f5fe
    style B fill:#e1f5fe
    style C fill:#e1f5fe
    style D fill:#e1f5fe
    style E fill:#e1f5fe
    style F fill:#e8f5e8
    style K fill:#fff3e0
    style L fill:#fff3e0
    style M fill:#fce4ec
    style N fill:#fce4ec
    style O fill:#fce4ec
```

## Flujo de Datos

```mermaid
sequenceDiagram
    participant User as Usuario
    participant FE as Frontend (React)
    participant BE as Backend (Express)
    participant DB as SQL Server

    User->>FE: Accede a la tienda
    FE->>BE: GET /api/comics
    BE->>DB: SELECT * FROM Comics
    DB-->>BE: Lista de cómics
    BE-->>FE: JSON con cómics
    FE-->>User: Muestra catálogo

    User->>FE: Selecciona cómic
    FE->>BE: GET /api/comics/:id
    BE->>DB: SELECT * FROM Comics WHERE id = ?
    DB-->>BE: Detalles del cómic
    BE-->>FE: JSON con detalles
    FE-->>User: Muestra detalles

    User->>FE: Añade al carrito
    FE->>FE: Actualiza estado local
    User->>FE: Procede al checkout
    FE->>BE: POST /api/orders
    BE->>DB: INSERT INTO Orders
    DB-->>BE: Confirmación
    BE-->>FE: Orden creada
    FE-->>User: Confirmación de compra
```

## Características
- Visualización de catálogo de cómics
- Consulta de cómics desde base de datos SQL Server
- Navegación con React Router
- Estilos modernos con CSS

## Instalación

### Frontend (Vite + React)
```bash
npm install
```

### Backend (Express)
```bash
cd server
npm install
```

## Ejecución

### Frontend
```bash
npm run dev
```

### Backend
```bash
cd .\server\
npx tsc
node dist/index.js
```
o si tienes TypeScript:
```bash
npx ts-node index.ts
```

## Estructura del proyecto
- `src/` : Código fuente del frontend
  - `components/` : Componentes reutilizables (ej. CatalogoComics)
  - `App.tsx` : Componente principal
- `server/` : Backend Express y scripts SQL
  - `index.ts` : Servidor Express principal
  - `sql/` : Scripts y consultas SQL

## Uso
1. Asegúrate de tener una base de datos SQL Server con la tabla `Comics`.
2. Configura las variables de entorno en `server/.env`:
   - `DB_SERVER`, `DB_DATABASE`, `DB_USER`, `DB_PASSWORD`, `PORT`
3. Inicia el backend y frontend como se indica arriba.
4. Accede a la app en [http://localhost:3000](http://localhost:3000).

## Personalización
Agrega tus cómics en la base de datos y personaliza los estilos en `App.css`.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
