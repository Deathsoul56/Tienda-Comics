// ...existing code...
import express from "express";
import { Request, Response } from "express";
import sql from "mssql";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

// Configuración de la conexión a SQL Server usando variables de entorno
const dbConfig: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || "",
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true,
  },
};

app.use(cors());
// Endpoint para obtener opciones de filtros (autor, editorial, género)
app.get("/comics/filters", async (req: Request, res: Response) => {
  try {
    await sql.connect(dbConfig);
    const authorsResult = await sql.query("SELECT DISTINCT author FROM Comics");
    const publishersResult = await sql.query("SELECT DISTINCT publisher FROM Comics");
    const genresResult = await sql.query("SELECT DISTINCT genre FROM Comics");
    res.json({
      authors: authorsResult.recordset.map((row: any) => row.author),
      publishers: publishersResult.recordset.map((row: any) => row.publisher),
      genres: genresResult.recordset.map((row: any) => row.genre)
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.get("/test-db", async (req: Request, res: Response) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query("SELECT 1 AS test");
    res.json({ success: true, result: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

// Ruta para obtener todos los cómics desde la base de datos
app.get("/comics", async (req: Request, res: Response) => {
  try {
    await sql.connect(dbConfig);
    // Obtener filtros desde query params
    const { author, publisher, genre, priceRange } = req.query;
    let query = "SELECT * FROM Comics WHERE 1=1";
    if (author) query += ` AND author = '${author}'`;
    if (publisher) query += ` AND publisher = '${publisher}'`;
    if (genre) query += ` AND genre = '${genre}'`;
    if (priceRange) {
      // priceRange debe ser un string como "0-5", "5-10", etc.
      const [min, max] = String(priceRange).split('-');
      query += ` AND price > ${min} AND price <= ${max}`;
    }
    const result = await sql.query(query);
    // Generar la ruta de la imagen automáticamente usando el título
    const fs = require('fs');
    const path = require('path');
    const imagesDir = path.join(__dirname, '../../public/images');
    const comics = result.recordset.map((comic: any) => {
      const baseName = comic.title;
      const jpgPath = path.join(imagesDir, `${baseName}.jpg`);
      const webpPath = path.join(imagesDir, `${baseName}.webp`);
      let imageFileName = '';
      if (fs.existsSync(webpPath)) {
        imageFileName = `${baseName}.webp`;
      } else if (fs.existsSync(jpgPath)) {
        imageFileName = `${baseName}.jpg`;
      } else {
        imageFileName = 'default.jpg'; // Imagen por defecto si no existe ninguna
      }
      return {
        ...comic,
        image: `/images/${imageFileName}`
      };
    });
    res.json(comics);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
