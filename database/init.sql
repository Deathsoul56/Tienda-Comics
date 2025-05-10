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