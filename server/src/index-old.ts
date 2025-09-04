import express from "express";
import { Request, Response } from "express";
import sql from "mssql";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

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

// Endpoint para obtener las ventas de la tienda
app.get("/ventas", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const ventasResult = await sql.query(`
      SELECT o.order_id, u.user_name, o.order_date, o.total_amount, o.status, o.items
      FROM ${process.env.DB_DATABASE}.dbo.Orders o
      LEFT JOIN ${process.env.DB_DATABASE}.dbo.Users u ON o.user_id = u.user_id
      ORDER BY o.order_date DESC
    `);
    res.json(ventasResult.recordset);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

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

// Ruta para obtener todos los cómics desde la base de datos
app.get("/comics", async (req: Request, res: Response) => {
  try {
    await sql.connect(dbConfig);
    const { author, publisher, genre, priceRange, order } = req.query;
    let query = "SELECT * FROM Comics WHERE 1=1";
    let hasFilter = false;
    if (author) { query += ` AND author = '${author}'`; hasFilter = true; }
    if (publisher) { query += ` AND publisher = '${publisher}'`; hasFilter = true; }
    if (genre) { query += ` AND genre = '${genre}'`; hasFilter = true; }
    if (priceRange) {
      const [min, max] = String(priceRange).split('-');
      query += ` AND price > ${min} AND price <= ${max}`;
      hasFilter = true;
    }
    if (order === 'price') {
      query += ' ORDER BY price ASC';
    } else if (order === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (order === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else if (order === 'title_asc') {
      query += ' ORDER BY title ASC';
    } else if (order === 'title_desc') {
      query += ' ORDER BY title DESC';
    } else if (!hasFilter) {
      query += ' ORDER BY comic_id OFFSET 0 ROWS FETCH NEXT 500 ROWS ONLY';
    }
    const result = await sql.query(query);
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
        imageFileName = 'default.jpg';
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

// Ruta para obtener las reseñas de un cómic específico
app.get("/reviews/:comic_id", async (req: Request, res: Response) => {
  try {
    await sql.connect(dbConfig);
    const { comic_id } = req.params;
    const result = await sql.query(`
      SELECT Reviews.review_id, Reviews.comic_id, Reviews.user_id, Users.user_name, Reviews.rating, Reviews.review_text, Reviews.created_at
      FROM dbo.Reviews
      LEFT JOIN Users ON Users.user_id = Reviews.user_id
      WHERE Reviews.comic_id = ${comic_id}
      ORDER BY Reviews.created_at DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Endpoint para obtener las ventas mensuales (dashboard)
app.get("/ventas-mensuales", async (req: Request, res: Response) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query(`
      SELECT
        YEAR(order_date) AS Year,
        MONTH(order_date) AS Month,
        SUM(total_amount) AS TotalSales,
        COUNT(DISTINCT order_id) AS TotalOrders
      FROM Orders_Details
      GROUP BY YEAR(order_date), MONTH(order_date)
      ORDER BY Year, Month;
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
