USE Cazuela
GO

INSERT INTO Purchases (supplier_id, purchase_date, total_amount, status, items) VALUES
(11, CONVERT(DATETIME, '20240501', 112), 1500.00, 'Completado', '[{"comic_id": 9, "quantity": 20}, {"comic_id": 127, "quantity": 10}]'), -- Manga Nippon Distribution (Japón)
(12, CONVERT(DATETIME, '20240603', 112), 1200.00, 'Completado', '[{"comic_id": 21, "quantity": 30}, {"comic_id": 88, "quantity": 20}]'), -- Seoul Manhwa Export (Corea del Sur)
(13, CONVERT(DATETIME, '20240405', 112), 1350.00, 'Pendiente',   '[{"comic_id": 15, "quantity": 10}, {"comic_id": 34, "quantity": 20}]'), -- Tokyo Manga Hub (Japón)
(15, CONVERT(DATETIME, '20240310', 112), 1100.00, 'Completado', '[{"comic_id": 77, "quantity": 40}]'), -- Busan Manhwa Center (Corea del Sur)
(17, CONVERT(DATETIME, '20240212', 112), 1600.00, 'Pendiente',   '[{"comic_id": 102, "quantity": 20}, {"comic_id": 56, "quantity": 10}]'), -- Shanghai Graphic Distribution (China)
(6, CONVERT(DATETIME, '20240715', 112), 1800.00, 'Completado',  '[{"comic_id": 201, "quantity": 20}, {"comic_id": 202, "quantity": 10}]'),  -- European Delicacies (Alemania)
(18, CONVERT(DATETIME, '20240716', 112), 1750.00, 'Pendiente',  '[{"comic_id": 210, "quantity": 30}]'),  -- Paris BD Distribution (Francia)
(19, CONVERT(DATETIME, '20240518', 112), 1400.00, 'Completado', '[{"comic_id": 220, "quantity": 20}, {"comic_id": 221, "quantity": 20}]'), -- Milan Fumetti S.p.A. (Italia)
(20, CONVERT(DATETIME, '20240619', 112), 1300.00, 'Pendiente',  '[{"comic_id": 230, "quantity": 10}]'),  -- Barcelona Novela Gráfica (España)
(21, CONVERT(DATETIME, '20240320', 112), 1550.00, 'Completado', '[{"comic_id": 240, "quantity": 20}, {"comic_id": 241, "quantity": 10}]'), -- Berlin Comic Vertrieb (Alemania)
(1, CONVERT(DATETIME, '20240520', 112), 550.00, 'Completado', '[{"comic_id": 23, "quantity": 50}]'),
(2, CONVERT(DATETIME, '20240214', 112), 950.00, 'Completado', '[{"comic_id": 45, "quantity": 15}, {"comic_id": 67, "quantity": 12}]'), -- Restock de Valentine
(3, CONVERT(DATETIME, '20240308', 112), 1050.00, 'Completado', '[{"comic_id": 89, "quantity": 25}]'), -- Spring collection
(4, CONVERT(DATETIME, '20240425', 112), 1200.00, 'Pendiente', '[{"comic_id": 112, "quantity": 18}, {"comic_id": 98, "quantity": 10}]'), -- Premium order
(5, CONVERT(DATETIME, '20240512', 112), 875.00, 'Completado', '[{"comic_id": 33, "quantity": 20}, {"comic_id": 44, "quantity": 15}]'), -- Summer prep
(7, CONVERT(DATETIME, '20240608', 112), 1650.00, 'Completado', '[{"comic_id": 125, "quantity": 22}, {"comic_id": 67, "quantity": 8}]'), -- Mid-year stock
(8, CONVERT(DATETIME, '20240721', 112), 1100.00, 'Pendiente', '[{"comic_id": 76, "quantity": 30}]'), -- Bulk order
(9, CONVERT(DATETIME, '20240815', 112), 950.00, 'Completado', '[{"comic_id": 90, "quantity": 25}, {"comic_id": 104, "quantity": 12}]'), -- Summer clearance
(10, CONVERT(DATETIME, '20240903', 112), 1450.00, 'Completado', '[{"comic_id": 110, "quantity": 20}, {"comic_id": 55, "quantity": 15}]'), -- Back-to-school
(14, CONVERT(DATETIME, '20240920', 112), 1100.00, 'Pendiente', '[{"comic_id": 135, "quantity": 35}]'), -- Fall collection
(16, CONVERT(DATETIME, '20241010', 112), 800.00, 'Completado', '[{"comic_id": 42, "quantity": 16}, {"comic_id": 61, "quantity": 14}]'); -- Halloween special
GO

-- Asignar horas aleatorias a cada compra
UPDATE Purchases
SET purchase_date = DATEADD(SECOND, ABS(CHECKSUM(NEWID())) % 86400, CAST(CAST(purchase_date AS DATE) AS DATETIME));
GO
