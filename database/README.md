# Base de Datos TiendaComics

Esta carpeta contiene los scripts y archivos relacionados con la base de datos de la tienda de cómics.

## Estructura

- `init.sql`: Script de inicialización de la base de datos
- `seed.sql`: Datos de ejemplo para la base de datos
- `backup/`: Carpeta para respaldos de la base de datos

## Uso

1. Para crear la base de datos y sus tablas:
```sql
sqlcmd -S localhost -U sa -P 123456 -i init.sql
```

2. Para cargar datos de ejemplo:
```sql
sqlcmd -S localhost -U sa -P 123456 -i seed.sql
```

## Estructura de la Base de Datos

### Tablas

1. **Usuarios**
   - id (PK)
   - nombre
   - email
   - password
   - fecha_registro

2. **Comics**
   - id (PK)
   - titulo
   - autor
   - descripcion
   - precio
   - stock
   - imagen
   - fecha_publicacion

3. **Carrito**
   - id (PK)
   - userId (FK)
   - comicId (FK)
   - quantity
   - fecha_agregado 