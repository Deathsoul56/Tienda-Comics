-- Crear el trigger
USE Cazuela
GO

-- Actualizar la cantidad de reseñas en la tabla Comics
CREATE TRIGGER update_reviews_quantity
ON Reviews
AFTER INSERT
AS
BEGIN
    UPDATE Comics
    SET review_quantity = review_quantity + 1
    FROM Comics c
    INNER JOIN inserted i ON c.comic_id = i.comic_id;
END;
GO

-- Disminuir la cantidad de reviews
CREATE TRIGGER delete_reviews_quantity
    ON Reviews
    AFTER DELETE
    AS
BEGIN
    UPDATE Comics
    SET review_quantity = review_quantity - 1
    FROM Comics c
         INNER JOIN deleted d ON c.comic_id = d.comic_id
         AND c.review_quantity > 0;
END;
GO

-- Actualizar la cantidad de comics vendidos cuando se inserta una nueva orden
CREATE TRIGGER update_comics_sold_quantity
ON Orders
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar stock suficiente antes de actualizar
    IF EXISTS (
        SELECT 1
        FROM inserted i
        CROSS APPLY OPENJSON(i.items) WITH (
            comic_id INT '$.comic_id',
            quantity INT '$.quantity'
        ) j
        JOIN Comics c ON c.comic_id = j.comic_id
        WHERE c.stock_quantity < j.quantity
    )
    BEGIN
        THROW 50001, 'No hay suficiente stock para uno o más cómics en la orden.', 1;
        RETURN;
    END

    -- Actualizar sold_quantity y stock_quantity
    UPDATE c
    SET
        sold_quantity = sold_quantity + j.quantity,
        stock_quantity = stock_quantity - j.quantity
    FROM Comics c
    JOIN (
        SELECT
            CAST(JSON_VALUE(j.value, '$.comic_id') AS INT) as comic_id,
            CAST(JSON_VALUE(j.value, '$.quantity') AS INT) as quantity
        FROM inserted i
        CROSS APPLY OPENJSON(i.items) j
    ) j ON c.comic_id = j.comic_id;
END;
GO

-- Trigger para actualizar el stock de comics al insertar una compra
CREATE TRIGGER update_comics_buy_quantity
ON Purchases
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Sumar al stock de cada comic comprado
    UPDATE c
    SET stock_quantity = stock_quantity + CAST(JSON_VALUE(j.value, '$.quantity') AS INT)
    FROM Comics c
    INNER JOIN inserted i
    CROSS APPLY OPENJSON(i.items) j
        ON c.comic_id = CAST(JSON_VALUE(j.value, '$.comic_id') AS INT);
END;
GO

-- Calcular el precio total de la orden
CREATE TRIGGER calculate_order_total
ON ORDERS
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Procesar cada fila insertada y calcular el total
    INSERT INTO ORDERS (user_id, items, total_amount)
    SELECT
        i.user_id,
        i.items,
        (
            SELECT SUM(c.price * CAST(JSON_VALUE(j.value, '$.quantity') AS INT))
            FROM OPENJSON(i.items) j
            JOIN COMICS c ON c.comic_id = CAST(JSON_VALUE(j.value, '$.comic_id') AS INT)
        ) as total_amount
    FROM inserted i;
END;
GO

-- Actualizar el campo updated_at en la tabla Users
CREATE TRIGGER update_users_timestamp
ON Users
AFTER UPDATE
AS
BEGIN
    UPDATE Users
    SET updated_at = GETDATE()
    FROM Users u
    INNER JOIN inserted i ON u.user_id = i.user_id;
END;
GO


-- Actualizar el campo updated_at en la tabla Comics
CREATE TRIGGER update_comics_timestamp
ON Comics
AFTER UPDATE
AS
BEGIN
    UPDATE Comics
    SET updated_at = GETDATE()
    FROM Comics c
    INNER JOIN inserted i ON c.comic_id = i.comic_id;
END;
GO


-- Actualizar el campo updated_at en la tabla Orders
CREATE TRIGGER update_orders_timestamp
ON Orders
AFTER UPDATE
AS
BEGIN
    UPDATE Orders
    SET updated_at = GETDATE()
    FROM Orders o
    INNER JOIN inserted i ON o.order_id = i.order_id;
END;
GO


-- Actualizar el campo updated_at en la tabla Reviews
CREATE TRIGGER update_reviews_timestamp
ON Reviews
AFTER UPDATE
AS
BEGIN
    UPDATE Reviews
    SET updated_at = GETDATE()
    FROM Reviews r
    INNER JOIN inserted i ON r.review_id = i.review_id;
END;
GO