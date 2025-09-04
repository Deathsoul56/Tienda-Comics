import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

export const dbConfig: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || "",
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true,
  },
};

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: sql.ConnectionPool | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async getPool(): Promise<sql.ConnectionPool> {
    if (!this.pool) {
      this.pool = new sql.ConnectionPool(dbConfig);
      await this.pool.connect();
    }
    return this.pool;
  }

  public async closePool(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
    }
  }
}