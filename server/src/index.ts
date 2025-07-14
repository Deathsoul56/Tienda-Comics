import express from "express";
import { Request, Response } from "express";
import sql from "mssql";
import cors from "cors";

const app = express();
const port = 4000;

// Configuración de la conexión a SQL Server local
const dbConfig: sql.config = {
  user: "react",
  password: "cazuela",
  server: "localhost",
  database: "Cazuela",
  options: {
    trustServerCertificate: true,
  },
};

app.use(cors());

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
    const result = await sql.query("SELECT * FROM Comics");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
