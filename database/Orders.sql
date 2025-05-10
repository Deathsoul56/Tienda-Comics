-- Insertar datos en la tabla Orders
USE Cazuela

INSERT INTO Orders (user_id, items)
VALUES
-- Cliente comprando múltiples cómics, incluyendo 3 unidades del cómic 1
(1, '[{"comic_id": 1, "quantity": 3}, {"comic_id": 2, "quantity": 1}]'),

-- Cliente comprando dos cómics diferentes en cantidades unitarias
(23, '[{"comic_id": 3, "quantity": 1}, {"comic_id": 4, "quantity": 1}]'),

-- Tony Stark (usuario 7) comprando varios cómics, incluyendo 3 unidades del cómic 8
(7, '[{"comic_id": 1, "quantity": 2}, {"comic_id": 5, "quantity": 1}, {"comic_id": 8, "quantity": 3}]'),

-- Doctor Strange (usuario 15) comprando cómics con 2 unidades del cómic 4
(15, '[{"comic_id": 3, "quantity": 1}, {"comic_id": 4, "quantity": 2}]'),

-- Cliente comprando tres cómics diferentes, con 2 unidades del cómic 15
(2, '[{"comic_id": 12, "quantity": 1}, {"comic_id": 15, "quantity": 2}, {"comic_id": 18, "quantity": 1}]'),

-- Cliente comprando 4 unidades del cómic 7 y 1 unidad del cómic 9
(5, '[{"comic_id": 7, "quantity": 4}, {"comic_id": 9, "quantity": 1}]');


INSERT INTO Orders (user_id, items)
VALUES
-- Usuario 9 comprando múltiples cómics con 3 unidades del cómic 14
(9, '[{"comic_id": 3, "quantity": 2}, {"comic_id": 11, "quantity": 1}, {"comic_id": 14, "quantity": 3}]'),

-- Dos órdenes separadas: usuario 3 compra 2 cómics y usuario 15 compra con 3 unidades del cómic 13
(3, '[{"comic_id": 4, "quantity": 2}, {"comic_id": 8, "quantity": 1}]'),
(15, '[{"comic_id": 10, "quantity": 1}, {"comic_id": 13, "quantity": 3}]'),

-- Usuario 27 comprando tres cómics con múltiples cantidades
(27, '[{"comic_id": 5, "quantity": 2}, {"comic_id": 16, "quantity": 1}, {"comic_id": 19, "quantity": 2}]'),

-- Tres órdenes individuales: compras simples y múltiples
(13, '[{"comic_id": 6, "quantity": 1}]'),
(4, '[{"comic_id": 2, "quantity": 3}, {"comic_id": 15, "quantity": 1}]'),
(11, '[{"comic_id": 1, "quantity": 1}, {"comic_id": 9, "quantity": 2}, {"comic_id": 12, "quantity": 1}]'),

-- Más órdenes variadas con diferentes cantidades
(23, '[{"comic_id": 8, "quantity": 2}, {"comic_id": 13, "quantity": 1}, {"comic_id": 19, "quantity": 3}]'),
(6, '[{"comic_id": 3, "quantity": 1}]'),
(18, '[{"comic_id": 5, "quantity": 2}]'),

-- Último grupo de órdenes incluyendo una compra grande de 5 unidades
(19, '[{"comic_id": 7, "quantity": 1}]'),
(8, '[{"comic_id": 4, "quantity": 3}, {"comic_id": 16, "quantity": 1}]'),
(25, '[{"comic_id": 2, "quantity": 1}, {"comic_id": 9, "quantity": 1}, {"comic_id": 14, "quantity": 2}, {"comic_id": 17, "quantity": 5}]');


-- More orders for 2024
INSERT INTO Orders (user_id, items)
VALUES
-- Comic enthusiast buying first 3 issues of a series
(12, '[{"comic_id": 1, "quantity": 1}, {"comic_id": 2, "quantity": 1}, {"comic_id": 3, "quantity": 1}]'),

-- Collector purchasing multiple sequential issues
(16, '[{"comic_id": 15, "quantity": 1}, {"comic_id": 16, "quantity": 1}, {"comic_id": 17, "quantity": 1}, {"comic_id": 18, "quantity": 1}]'),

-- Bulk buyer ordering multiple quantities
(21, '[{"comic_id": 7, "quantity": 5}, {"comic_id": 8, "quantity": 3}]'),

-- Regular customer with typical purchase
(14, '[{"comic_id": 4, "quantity": 2}, {"comic_id": 11, "quantity": 1}]'),

-- New reader making their first purchase
(17, '[{"comic_id": 1, "quantity": 1}]'),

-- Gift shopper buying multiple comics
(22, '[{"comic_id": 13, "quantity": 2}, {"comic_id": 19, "quantity": 2}, {"comic_id": 6, "quantity": 1}]'),

-- Series follower purchasing consecutive issues
(10, '[{"comic_id": 5, "quantity": 1}, {"comic_id": 6, "quantity": 1}, {"comic_id": 7, "quantity": 1}]'),

-- Occasional buyer with small order
(20, '[{"comic_id": 12, "quantity": 1}, {"comic_id": 14, "quantity": 1}]'),

-- Variety seeker with diverse selection
(24, '[{"comic_id": 3, "quantity": 2}, {"comic_id": 9, "quantity": 1}, {"comic_id": 15, "quantity": 1}, {"comic_id": 18, "quantity": 1}]'),

-- Limited edition buyer focusing on special issues
(26, '[{"comic_id": 10, "quantity": 1}, {"comic_id": 16, "quantity": 1}]'),

-- Regular collector building their collection
(5, '[{"comic_id": 2, "quantity": 1}, {"comic_id": 3, "quantity": 1}, {"comic_id": 4, "quantity": 1}]'),

-- Monthly subscriber with consistent order
(8, '[{"comic_id": 1, "quantity": 2}, {"comic_id": 5, "quantity": 2}]'),

-- Comic shop owner making large wholesale purchase
(13, '[{"comic_id": 7, "quantity": 10}, {"comic_id": 8, "quantity": 8}, {"comic_id": 9, "quantity": 5}]'),

-- Gift buyer selecting popular titles
(19, '[{"comic_id": 11, "quantity": 1}, {"comic_id": 15, "quantity": 1}]'),

-- Avid reader with diverse tastes
(22, '[{"comic_id": 6, "quantity": 1}, {"comic_id": 12, "quantity": 1}, {"comic_id": 18, "quantity": 1}]'),

-- Customer completing a series
(11, '[{"comic_id": 13, "quantity": 1}, {"comic_id": 14, "quantity": 1}, {"comic_id": 15, "quantity": 1}]'),

-- Reading group organizer making bulk purchase
(25, '[{"comic_id": 1, "quantity": 5}, {"comic_id": 4, "quantity": 5}, {"comic_id": 7, "quantity": 5}]'),

-- New series starter getting beginning issues
(16, '[{"comic_id": 16, "quantity": 1}, {"comic_id": 17, "quantity": 1}]'),

-- Back issue collector finding rare comics
(9, '[{"comic_id": 3, "quantity": 1}, {"comic_id": 8, "quantity": 1}, {"comic_id": 19, "quantity": 1}]'),

-- Limited edition hunter acquiring special issue
(27, '[{"comic_id": 10, "quantity": 1}]'),

-- Casual reader with small, varied purchase
(3, '[{"comic_id": 5, "quantity": 1}, {"comic_id": 9, "quantity": 1}]');


INSERT INTO Orders (user_id, items)
VALUES
-- Usuario comprando un solo cómic popular
(15, '[{"comic_id": 42, "quantity": 1}]'),

-- Usuario comprando varios cómics de una serie
(68, '[{"comic_id": 12, "quantity": 2}, {"comic_id": 13, "quantity": 1}]'),

-- Coleccionista comprando cómics raros
(92, '[{"comic_id": 87, "quantity": 1}, {"comic_id": 88, "quantity": 1}, {"comic_id": 89, "quantity": 1}]'),

-- Compra típica de un lector casual
(33, '[{"comic_id": 5, "quantity": 1}, {"comic_id": 19, "quantity": 1}]'),

-- Usuario comprando un cómic nuevo recién lanzado
(7, '[{"comic_id": 76, "quantity": 1}]'),

-- Compra grande de un cliente frecuente
(54, '[{"comic_id": 3, "quantity": 1}, {"comic_id": 27, "quantity": 2}, {"comic_id": 56, "quantity": 1}]'),

-- Usuario comprando cómics para regalo
(81, '[{"comic_id": 34, "quantity": 3}]'),

-- Compra de cómics variados
(29, '[{"comic_id": 61, "quantity": 1}, {"comic_id": 62, "quantity": 1}]'),

-- Usuario comprando cómics clásicos
(77, '[{"comic_id": 1, "quantity": 1}, {"comic_id": 2, "quantity": 1}]'),

-- Compra de cómics de diferentes géneros
(46, '[{"comic_id": 45, "quantity": 1}, {"comic_id": 67, "quantity": 1}, {"comic_id": 92, "quantity": 1}]');


INSERT INTO Orders (user_id, items)
VALUES
-- 1. First-time buyer starting a collection
(28, '[{"comic_id": 1, "quantity": 1}, {"comic_id": 2, "quantity": 1}]'),

-- 2. Complete series collector
(32, '[{"comic_id": 25, "quantity": 1}, {"comic_id": 26, "quantity": 1}, {"comic_id": 27, "quantity": 1}, {"comic_id": 28, "quantity": 1}]'),

-- 3. Bulk purchase for event giveaway
(45, '[{"comic_id": 5, "quantity": 10}]'),

-- 4. Varied genre explorer
(19, '[{"comic_id": 12, "quantity": 1}, {"comic_id": 35, "quantity": 1}, {"comic_id": 68, "quantity": 1}]'),

-- 5. Loyal customer monthly purchase
(8, '[{"comic_id": 15, "quantity": 2}, {"comic_id": 18, "quantity": 2}]'),

-- 6. Rare issue hunter
(63, '[{"comic_id": 50, "quantity": 1}, {"comic_id": 51, "quantity": 1}]'),

-- 7. Graphic novel enthusiast
(41, '[{"comic_id": 30, "quantity": 1}, {"comic_id": 31, "quantity": 1}, {"comic_id": 32, "quantity": 1}]'),

-- 8. Small gift purchase
(22, '[{"comic_id": 19, "quantity": 1}]'),

-- 9. Comic shop restock order
(13, '[{"comic_id": 3, "quantity": 5}, {"comic_id": 7, "quantity": 5}, {"comic_id": 9, "quantity": 5}]'),

-- 10. Birthday present bundle
(37, '[{"comic_id": 10, "quantity": 1}, {"comic_id": 11, "quantity": 1}, {"comic_id": 12, "quantity": 1}]'),

-- 11. Variant cover collector
(55, '[{"comic_id": 40, "quantity": 3}]'),

-- 12. New release day purchase
(29, '[{"comic_id": 75, "quantity": 1}, {"comic_id": 76, "quantity": 1}]'),

-- 13. Back issue completion
(44, '[{"comic_id": 33, "quantity": 1}, {"comic_id": 34, "quantity": 1}]'),

-- 14. Teacher for classroom
(52, '[{"comic_id": 20, "quantity": 6}]'),

-- 15. Impulse buyer
(38, '[{"comic_id": 42, "quantity": 1}]'),

-- 16. Holiday sale shopper
(61, '[{"comic_id": 8, "quantity": 2}, {"comic_id": 16, "quantity": 2}, {"comic_id": 24, "quantity": 2}]'),

-- 17. Subscription box recipient
(47, '[{"comic_id": 55, "quantity": 1}, {"comic_id": 56, "quantity": 1}, {"comic_id": 57, "quantity": 1}]'),

-- 18. Convention exclusive buyer
(59, '[{"comic_id": 60, "quantity": 1}, {"comic_id": 61, "quantity": 1}]'),

-- 19. Trade paperback collector
(34, '[{"comic_id": 70, "quantity": 1}, {"comic_id": 71, "quantity": 1}]'),

-- 20. First appearance hunter
(66, '[{"comic_id": 45, "quantity": 1}]'),

-- 21. Artist supporter
(23, '[{"comic_id": 80, "quantity": 1}, {"comic_id": 81, "quantity": 1}]'),

-- 22. Small publisher fan
(51, '[{"comic_id": 90, "quantity": 1}, {"comic_id": 91, "quantity": 1}]'),

-- 23. Holiday gift giver
(39, '[{"comic_id": 22, "quantity": 3}]'),

-- 24. Volume purchaser
(58, '[{"comic_id": 38, "quantity": 1}, {"comic_id": 39, "quantity": 1}]'),

-- 25. Key issue investor
(72, '[{"comic_id": 1, "quantity": 1}, {"comic_id": 5, "quantity": 1}]'),

-- 26. Casual reader
(31, '[{"comic_id": 15, "quantity": 1}]'),

-- 27. Complete story arc buyer
(49, '[{"comic_id": 25, "quantity": 1}, {"comic_id": 26, "quantity": 1}, {"comic_id": 27, "quantity": 1}]'),

-- 28. Variant edition collector
(64, '[{"comic_id": 50, "quantity": 2}]'),

-- 29. Graphic novel gift set
(42, '[{"comic_id": 65, "quantity": 1}, {"comic_id": 66, "quantity": 1}]'),

-- 30. Last-minute present
(27, '[{"comic_id": 12, "quantity": 1}, {"comic_id": 18, "quantity": 1}]');







-- Update all orders with random dates and times in 2024
UPDATE Orders
SET order_date = DATEADD(
        SECOND,
        ABS(CHECKSUM(NEWID()) % 86400), -- Random seconds in a day (0-86399)
        DATEADD(DAY,
                ABS(CHECKSUM(NEWID()) % 366), -- Random day in 2024 (it's a leap year)
                '2024-01-01')
    )
WHERE order_id >= 0;