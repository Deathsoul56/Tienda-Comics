USE master

DROP DATABASE IF EXISTS Cazuela
GO

CREATE DATABASE Cazuela
GO

USE Cazuela
GO

CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    user_name NVARCHAR(50) UNIQUE NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    first_name NVARCHAR(50),
    last_name NVARCHAR(50),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
)
GO

CREATE TABLE Comics (
    comic_id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(150) NOT NULL,
    author NVARCHAR(100),
    publisher NVARCHAR(100),
    genre NVARCHAR(50),
    publication_date DATE,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    sold_quantity INT DEFAULT 0,
    review_quantity INT DEFAULT 0,
    description NVARCHAR(MAX),
    cover_image_url NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
)
GO

CREATE TABLE Orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    items NVARCHAR(MAX) NOT NULL CHECK (ISJSON(items) = 1),
    order_date DATETIME NULL CONSTRAINT DF_FechaOrden DEFAULT GETDATE(),
    total_amount DECIMAL(10, 2) NOT NULL,
    status NVARCHAR(50) DEFAULT 'Pending',
    updated_at DATETIME DEFAULT GETDATE()
)
GO

CREATE TABLE Reviews (
    review_id INT IDENTITY(1,1) PRIMARY KEY,
    comic_id INT REFERENCES Comics(comic_id) ON DELETE CASCADE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    rating DECIMAL(2,1) CHECK (rating >= 1 AND rating <= 5),
    review_text NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
)
GO

CREATE TABLE Suppliers (
    supplier_id INT IDENTITY(1,1) PRIMARY KEY,
    supplier_name NVARCHAR(100) NOT NULL,
    contact_name NVARCHAR(100),
    address NVARCHAR(255),
    city NVARCHAR(100),
    state NVARCHAR(100),
    country NVARCHAR(100),
    postal_code NVARCHAR(20),
    phone_number NVARCHAR(20),
    email NVARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
)
GO

CREATE TABLE Purchases (
    purchase_id INT IDENTITY(1,1) PRIMARY KEY,
    supplier_id INT REFERENCES Suppliers(supplier_id) ON DELETE CASCADE,
    purchase_date DATETIME DEFAULT GETDATE(),
    total_amount DECIMAL(10, 2) NOT NULL,
    status NVARCHAR(50) DEFAULT 'Pending',
    items NVARCHAR(MAX) NOT NULL CHECK (ISJSON(items) = 1),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
)
GO

CREATE TABLE Error_log (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    error_message NVARCHAR(4000),
    error_stack NVARCHAR(4000),
    created_at DATETIME DEFAULT GETDATE()
)
GO

CREATE INDEX idx_reviews_comic_id ON Reviews(comic_id)
CREATE INDEX idx_reviews_user_id ON Reviews(user_id)
CREATE INDEX idx_comics_title ON Comics(title)
CREATE INDEX idx_comics_author ON Comics(author)
CREATE INDEX idx_comics_genre ON Comics(genre)
CREATE INDEX idx_orders_user_id ON Orders(user_id)
CREATE INDEX idx_orders_order_date ON Orders(order_date)
CREATE INDEX idx_suppliers_name ON Suppliers(supplier_name)
CREATE INDEX idx_purchases_supplier_id ON Purchases(supplier_id)
CREATE INDEX idx_purchases_purchase_date ON Purchases(purchase_date)
GO

CREATE VIEW Orders_Details AS
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
GO