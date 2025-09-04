# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fullstack comics store application built with React + TypeScript (frontend) and Express + TypeScript (backend) using SQL Server as the database. The application manages comic inventory, customer orders, reviews, and sales analytics.

## Development Commands

### Frontend (React + Vite)
```bash
npm install          # Install dependencies
npm run dev          # Start development server on port 3000
npm run build        # Build for production (runs tsc -b && vite build)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend (Express + TypeScript)
```bash
cd server
npm install          # Install dependencies
npx tsc              # Compile TypeScript
node dist/index.js   # Run compiled server
# or
npx ts-node index.ts # Run with ts-node directly
```

## Architecture

### Frontend Structure
- **App.tsx**: Main component with state management for cart, comics, and view navigation
- **components/**: Core UI components
  - `CatalogoComics.tsx`: Comic catalog with filtering and search
  - `ComicDetail.tsx`: Individual comic details view
  - `HomePage.tsx`: Landing page with carousel
  - `VentasTienda.tsx`: Sales dashboard with charts
  - `Carrito.tsx`: Shopping cart functionality
- **hooks/**: Custom React hooks
  - `useComicFilters.ts`: Comic filtering logic
- **API Integration**: Uses `VITE_API_BASE_URL` environment variable (defaults to http://localhost:4000)

### Backend Structure
- **server/src/index.ts**: Express server with SQL Server integration
- **Key endpoints**:
  - `GET /comics`: Fetch comics with filtering (author, publisher, genre, price range)
  - `GET /comics/filters`: Get available filter options
  - `GET /reviews/:comic_id`: Get reviews for specific comic
  - `GET /ventas`: Sales data for dashboard
  - `GET /ventas-mensuales`: Monthly sales analytics
  - `POST /orders`: Create new orders (from checkout)

### Database
- **SQL Server** with comprehensive schema including:
  - Comics, Users, Orders, Reviews, Suppliers, Compras tables
  - Triggers for stock management
  - See `server/sql/` for complete schema and queries

## Environment Configuration

### Backend Environment Variables (.env in server/)
```
DB_SERVER=your_sql_server
DB_DATABASE=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
PORT=4000
```

### Frontend Environment Variables
```
VITE_API_BASE_URL=http://localhost:4000
```

## Key Features

1. **Comic Catalog**: Browse, search, and filter comics by author, publisher, genre, and price
2. **Shopping Cart**: Persistent cart with localStorage, quantity management
3. **Order Processing**: Checkout system that creates orders in database
4. **Sales Analytics**: Dashboard with monthly sales charts using Recharts
5. **Reviews System**: User reviews and ratings for comics
6. **Image Management**: Automatic image resolution (prefers .webp, falls back to .jpg)

## Development Notes

- Frontend uses React 19 with modern hooks and TypeScript strict mode
- Backend uses Express 5 with MSSQL driver and CORS enabled
- ESLint configured with React hooks and TypeScript rules
- No test framework currently configured
- Images stored in `public/images/` directory, referenced by comic title
- Cart state persists in localStorage
- Server runs on port 4000, frontend on port 3000

## Common Tasks

- **Add new comic**: Insert into database, ensure image exists in `public/images/`
- **Modify filters**: Update both frontend filter UI and backend query parameters
- **Update schema**: Modify SQL files in `server/sql/` and update TypeScript interfaces
- **Deploy**: Build frontend with `npm run build`, compile backend with `npx tsc`