const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Verificar que las variables de entorno se cargaron correctamente
console.log('Configuración de entorno:', {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    port: process.env.PORT
});

// Configuración de la conexión a SQL Server
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Variable para mantener la conexión
let pool;

// Función para conectar a la base de datos
async function connectDB() {
    try {
        await sql.connect(config);
        console.log('Conexión exitosa a la base de datos');
    } catch (err) {
        console.error('Error al conectar con la base de datos:', err);
        throw err;
    }
}

// Conectar a la base de datos al iniciar
connectDB();

// Middleware para verificar la conexión
app.use(async (req, res, next) => {
    try {
        if (!pool) {
            pool = await connectDB();
        }
        next();
    } catch (err) {
        console.error('Error de conexión:', err);
        res.status(500).json({ error: 'Error de conexión a la base de datos' });
    }
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

// Ruta para obtener todos los cómics
app.get('/api/comics', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM Comics`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener cómics:', err);
        res.status(500).json({ error: 'Error al obtener los cómics' });
    }
});

// Ruta para obtener un cómic específico
app.get('/api/comics/:id', async (req, res) => {
    try {
        const result = await sql.query`
            SELECT * FROM Comics 
            WHERE id = ${req.params.id}
        `;
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Cómic no encontrado' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error al obtener el cómic:', err);
        res.status(500).json({ 
            error: 'Error al obtener el cómic',
            details: err.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 