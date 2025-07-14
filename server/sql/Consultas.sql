USE Cazuela

SELECT * FROM Users

SELECT * FROM Comics WHERE comic_id = 63

SELECT * FROM Comics

SELECT * FROM Comics
WHERE title LIKE 'Chainsaw Man$'

SELECT * FROM dbo.Reviews

SELECT * FROM dbo.Orders

SELECT * FROM Orders_Details

SELECT
    comic_id,
    title,
    SUM(quantity) AS Cantidad
FROM Orders_Details
GROUP BY comic_id, title
ORDER BY Cantidad DESC



SELECT * FROM Orders WHERE CAST(order_date AS DATE) = '2024-03-26'


SELECT
    Orders.user_id,
    user_name,
    order_date,
    total_amount,
    status,
    items
FROM
    Orders
    LEFT JOIN dbo.Users on Orders.user_id = Users.user_id


--


SELECT o.order_id,
       o.user_id,
       u.user_name,
       o.order_date,
       o.status,
       i.comic_id,
       c.title,
       i.quantity,
       c.price AS unitary_price,
       i.quantity * c.price as total_price,
       o.total_amount
FROM
    Orders o
    LEFT JOIN Users u ON o.user_id = u.user_id
    CROSS APPLY OPENJSON(o.items)
                              WITH (
                                  comic_id INT '$.comic_id',
                                  quantity INT '$.quantity'
                                  ) i
    LEFT JOIN Comics c ON c.comic_id = i.comic_id
-- WHERE o.user_id = 9
ORDER BY o.order_id;





SELECT distinct user_id,
       comic_id,
       title
FROM Orders_Details