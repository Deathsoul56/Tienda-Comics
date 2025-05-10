-- Crear la base de datos si no existe
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'TiendaComics')
BEGIN
    CREATE DATABASE TiendaComics;
END
GO

USE TiendaComics;
GO

-- Tabla de Usuarios
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Usuarios')
BEGIN
    CREATE TABLE Usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        fecha_registro DATETIME DEFAULT GETDATE()
    );
END
GO

-- Tabla de Comics
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Comics')
BEGIN
    CREATE TABLE Comics (
        id INT IDENTITY(1,1) PRIMARY KEY,
        titulo VARCHAR(200) NOT NULL,
        autor VARCHAR(100) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL,
        imagen VARCHAR(255),
        fecha_publicacion DATE
    );
END
GO

-- Tabla de Carrito
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Carrito')
BEGIN
    CREATE TABLE Carrito (
        id INT IDENTITY(1,1) PRIMARY KEY,
        userId INT NOT NULL,
        comicId INT NOT NULL,
        quantity INT NOT NULL,
        fecha_agregado DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (userId) REFERENCES Usuarios(id),
        FOREIGN KEY (comicId) REFERENCES Comics(id)
    );
END
GO

-- Insertar algunos datos de ejemplo
IF NOT EXISTS (SELECT * FROM Comics)
BEGIN
    INSERT INTO Comics (titulo, autor, descripcion, precio, stock, imagen, fecha_publicacion)
    VALUES 
    ('Spider-Man: No Way Home', 'Marvel Comics', 'La última aventura de Spider-Man', 19.99, 50, 'spiderman.jpg', '2023-01-15'),
    ('Batman: The Dark Knight', 'DC Comics', 'La historia definitiva del Caballero Oscuro', 24.99, 30, 'batman.jpg', '2023-02-20'),
    ('X-Men: Days of Future Past', 'Marvel Comics', 'Los X-Men viajan en el tiempo', 21.99, 40, 'xmen.jpg', '2023-03-10');
END
GO

-- Insertar un usuario de prueba
IF NOT EXISTS (SELECT * FROM Usuarios WHERE email = 'admin@example.com')
BEGIN
    INSERT INTO Usuarios (nombre, email, password)
    VALUES ('Admin', 'admin@example.com', 'admin123');
END
GO 