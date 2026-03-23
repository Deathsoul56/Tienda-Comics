USE Cazuela;
SET NOCOUNT ON;

-- 1) Catálogo básico (paginable)
SELECT TOP (100)
    c.comic_id,
    c.title,
    c.author,
    c.genre,
    c.price,
    c.stock_quantity,
    c.sold_quantity,
    c.review_quantity
FROM dbo.Comics c
ORDER BY c.comic_id;

-- 2) Búsqueda exacta por título (mejor que LIKE cuando no hay comodines)
SELECT
    c.comic_id,
    c.title,
    c.author,
    c.publisher,
    c.genre,
    c.price,
    c.stock_quantity
FROM dbo.Comics c
WHERE c.title = 'Chainsaw Man';

-- 3) Búsqueda por prefijo (usa índice en title)
SELECT
    c.comic_id,
    c.title,
    c.price,
    c.stock_quantity
FROM dbo.Comics c
WHERE c.title LIKE 'Chain%'
ORDER BY c.title;

-- 4) Rango por fecha sargable (evita CAST(order_date AS DATE))
SELECT
    o.order_id,
    o.user_id,
    o.order_date,
    o.total_amount,
    o.status
FROM dbo.Orders o
WHERE o.order_date >= '2024-03-26'
  AND o.order_date < '2024-03-27'
ORDER BY o.order_date;

-- 5) Detalle de órdenes con usuario
SELECT
    o.order_id,
    o.user_id,
    u.user_name,
    o.order_date,
    o.total_amount,
    o.status
FROM dbo.Orders o
LEFT JOIN dbo.Users u ON u.user_id = o.user_id
ORDER BY o.order_id DESC;

-- 6) Top cómics vendidos
SELECT TOP (20)
    od.comic_id,
    od.title,
    SUM(od.quantity) AS cantidad_vendida,
    SUM(od.total_price) AS ingreso_estimado
FROM dbo.Orders_Details od
GROUP BY od.comic_id, od.title
ORDER BY cantidad_vendida DESC;

-- 7) Usuarios que han comprado X cómic
SELECT DISTINCT
    od.user_id,
    od.comic_id,
    od.title
FROM dbo.Orders_Details od
WHERE od.comic_id = 63
ORDER BY od.user_id;

-- 8) Chequeo de integridad: items de Orders con comic_id inexistente
SELECT
    o.order_id,
    j.comic_id,
    j.quantity
FROM dbo.Orders o
CROSS APPLY OPENJSON(o.items)
WITH (
    comic_id INT '$.comic_id',
    quantity INT '$.quantity'
) j
LEFT JOIN dbo.Comics c ON c.comic_id = j.comic_id
WHERE c.comic_id IS NULL
ORDER BY o.order_id;

-- 9) Chequeo de calidad: cantidades no válidas o repetidas en el mismo pedido
;WITH parsed AS (
    SELECT
        o.order_id,
        j.comic_id,
        j.quantity
    FROM dbo.Orders o
    CROSS APPLY OPENJSON(o.items)
    WITH (
        comic_id INT '$.comic_id',
        quantity INT '$.quantity'
    ) j
)
SELECT
    p.order_id,
    p.comic_id,
    SUM(p.quantity) AS quantity_total,
    COUNT(*) AS repeticiones
FROM parsed p
GROUP BY p.order_id, p.comic_id
HAVING SUM(CASE WHEN p.quantity <= 0 THEN 1 ELSE 0 END) > 0
    OR COUNT(*) > 1
ORDER BY p.order_id, p.comic_id;

-- 10) Validación de consistencia monetaria (total orden vs suma de detalle)
SELECT TOP (200)
    o.order_id,
    o.total_amount AS total_guardado,
    SUM(od.total_price) AS total_calculado,
    o.total_amount - SUM(od.total_price) AS diferencia
FROM dbo.Orders o
JOIN dbo.Orders_Details od ON od.order_id = o.order_id
GROUP BY o.order_id, o.total_amount
HAVING ABS(o.total_amount - SUM(od.total_price)) > 0.01
ORDER BY o.order_id;