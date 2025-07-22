USE Cazuela
GO


INSERT INTO Purchases (supplier_id, purchase_date, total_amount, status, items) VALUES
(11, '2024-05-01', 1500.00, 'Completado', '[{"comic_id": 9, "quantity": 20}, {"comic_id": 127, "quantity": 10}]'), -- Manga Nippon Distribution (Japón)
(12, '2024-06-03', 1200.00, 'Completado', '[{"comic_id": 21, "quantity": 30}, {"comic_id": 88, "quantity": 20}]'), -- Seoul Manhwa Export (Corea del Sur)
(13, '2024-04-05', 1350.00, 'Pendiente',   '[{"comic_id": 15, "quantity": 10}, {"comic_id": 34, "quantity": 20}]'), -- Tokyo Manga Hub (Japón)
(15, '2024-03-10', 1100.00, 'Completado', '[{"comic_id": 77, "quantity": 40}]'), -- Busan Manhwa Center (Corea del Sur)
(17, '2024-02-12', 1600.00, 'Pendiente',   '[{"comic_id": 102, "quantity": 20}, {"comic_id": 56, "quantity": 10}]'), -- Shanghai Graphic Distribution (China)
(6, '2024-07-15', 1800.00, 'Completado',  '[{"comic_id": 201, "quantity": 20}, {"comic_id": 202, "quantity": 10}]'),  -- European Delicacies (Alemania)
(18, '2024-07-16', 1750.00, 'Pendiente',  '[{"comic_id": 210, "quantity": 30}]'),  -- Paris BD Distribution (Francia)
(19, '2024-05-18', 1400.00, 'Completado', '[{"comic_id": 220, "quantity": 20}, {"comic_id": 221, "quantity": 20}]'), -- Milan Fumetti S.p.A. (Italia)
(20, '2024-06-19', 1300.00, 'Pendiente',  '[{"comic_id": 230, "quantity": 10}]'),  -- Barcelona Novela Gráfica (España)
(21, '2024-03-20', 1550.00, 'Completado', '[{"comic_id": 240, "quantity": 20}, {"comic_id": 241, "quantity": 10}]'), -- Berlin Comic Vertrieb (Alemania)
(1, '2024-05-20', 550.00, 'Completado', '[{"comic_id": 23, "quantity": 50}]');
GO
