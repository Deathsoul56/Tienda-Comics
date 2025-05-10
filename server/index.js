const express = require('express');
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();

const app = express();

// Configuración de CORS más permisiva para desarrollo
app.use(cors({
  origin: '*', // Permitir todas las origenes en desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Configuración de la conexión a SQL Server
const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'Cazuela',
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Conexión a la base de datos
async function connectDB() {
  try {
    await sql.connect(dbConfig);
    console.log('Conexión exitosa a SQL Server');
  } catch (err) {
    console.error('Error al conectar con SQL Server:', err);
    console.log('Configuración de conexión:', {
      user: dbConfig.user,
      server: dbConfig.server,
      database: dbConfig.database,
      port: dbConfig.port
    });
  }
}

// Conectar a la base de datos
connectDB();

// Middleware para manejar errores de conexión
app.use((req, res, next) => {
  if (!sql.connected) {
    return res.status(500).json({ error: 'Error de conexión con la base de datos' });
  }
  next();
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Rutas para Comics
app.get('/api/comics', async (req, res) => {
  try {
    const result = await sql.query`
      SELECT id, titulo, autor, descripcion, precio, stock, imagen, fecha_publicacion 
      FROM Comics
      ORDER BY fecha_publicacion DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener cómics:', err);
    res.status(500).json({ error: 'Error al obtener los cómics' });
  }
});

app.get('/api/comics/:id', async (req, res) => {
  try {
    const result = await sql.query`
      SELECT id, titulo, autor, descripcion, precio, stock, imagen, fecha_publicacion
      FROM Comics 
      WHERE id = ${req.params.id}
    `;
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Comic no encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error al obtener comic:', err);
    res.status(500).json({ error: 'Error al obtener el comic' });
  }
});

// Rutas para el Carrito
app.post('/api/cart', async (req, res) => {
  try {
    const { userId, comicId, quantity } = req.body;
    
    // Verificar si el comic existe y tiene stock
    const comicCheck = await sql.query`
      SELECT stock FROM Comics WHERE id = ${comicId}
    `;
    
    if (comicCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Comic no encontrado' });
    }
    
    if (comicCheck.recordset[0].stock < quantity) {
      return res.status(400).json({ message: 'Stock insuficiente' });
    }

    // Verificar si el usuario existe
    const userCheck = await sql.query`
      SELECT id FROM Usuarios WHERE id = ${userId}
    `;
    
    if (userCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Insertar en el carrito
    await sql.query`
      INSERT INTO Carrito (userId, comicId, quantity)
      VALUES (${userId}, ${comicId}, ${quantity})
    `;
    
    res.status(201).json({ message: 'Item añadido al carrito' });
  } catch (err) {
    console.error('Error al añadir al carrito:', err);
    res.status(500).json({ error: 'Error al añadir al carrito' });
  }
});

app.get('/api/cart/:userId', async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        c.id, 
        c.quantity, 
        c.fecha_agregado,
        co.id as comicId,
        co.titulo, 
        co.precio, 
        co.imagen,
        co.stock
      FROM Carrito c
      JOIN Comics co ON c.comicId = co.id
      WHERE c.userId = ${req.params.userId}
      ORDER BY c.fecha_agregado DESC
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener carrito:', err);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Rutas para Usuarios
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await sql.query`
      SELECT id, nombre, email, fecha_registro
      FROM Usuarios
      WHERE email = ${email} AND password = ${password}
    `;
    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en el inicio de sesión' });
  }
});

app.post('/api/users/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    
    // Verificar si el email ya existe
    const emailCheck = await sql.query`
      SELECT id FROM Usuarios WHERE email = ${email}
    `;
    
    if (emailCheck.recordset.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const result = await sql.query`
      INSERT INTO Usuarios (nombre, email, password)
      VALUES (${nombre}, ${email}, ${password})
    `;
    
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 