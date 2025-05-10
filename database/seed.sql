USE TiendaComics;
GO

-- Insertar usuarios de prueba
IF NOT EXISTS (SELECT * FROM Usuarios WHERE email = 'admin@example.com')
BEGIN
    INSERT INTO Usuarios (nombre, email, password)
    VALUES 
    ('Admin', 'admin@example.com', 'admin123'),
    ('Usuario', 'usuario@example.com', 'usuario123');
END
GO

-- Insertar comics de ejemplo
IF NOT EXISTS (SELECT * FROM Comics)
BEGIN
    INSERT INTO Comics (titulo, autor, descripcion, precio, stock, imagen, fecha_publicacion)
    VALUES 
    ('Spider-Man: No Way Home', 'Marvel Comics', 'La última aventura de Spider-Man', 19.99, 50, 'spiderman.jpg', '2023-01-15'),
    ('Batman: The Dark Knight', 'DC Comics', 'La historia definitiva del Caballero Oscuro', 24.99, 30, 'batman.jpg', '2023-02-20'),
    ('X-Men: Days of Future Past', 'Marvel Comics', 'Los X-Men viajan en el tiempo', 21.99, 40, 'xmen.jpg', '2023-03-10'),
    ('Watchmen', 'DC Comics', 'Una historia de superhéroes alternativa', 29.99, 25, 'watchmen.jpg', '2023-04-05'),
    ('The Walking Dead', 'Image Comics', 'La historia de supervivencia en un mundo post-apocalíptico', 18.99, 45, 'walkingdead.jpg', '2023-05-10');
END
GO

-- Insertar algunos items en el carrito de prueba
IF NOT EXISTS (SELECT * FROM Carrito)
BEGIN
    INSERT INTO Carrito (userId, comicId, quantity)
    VALUES 
    (1, 1, 2),  -- Admin compra 2 Spider-Man
    (1, 3, 1),  -- Admin compra 1 X-Men
    (2, 2, 1);  -- Usuario compra 1 Batman
END
GO 