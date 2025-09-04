import sql from 'mssql';
import { Comic } from '../../domain/entities';
import { ComicRepository, ComicFilters, ComicFilterOptions } from '../../domain/repositories';

export class SqlServerComicRepository implements ComicRepository {
  constructor(private dbConfig: sql.config) {}

  async findAll(filters?: ComicFilters): Promise<Comic[]> {
    try {
      await sql.connect(this.dbConfig);
      
      let query = "SELECT * FROM Comics WHERE 1=1";
      let hasFilter = false;

      if (filters?.author) {
        query += ` AND author = '${filters.author}'`;
        hasFilter = true;
      }

      if (filters?.publisher) {
        query += ` AND publisher = '${filters.publisher}'`;
        hasFilter = true;
      }

      if (filters?.genre) {
        query += ` AND genre = '${filters.genre}'`;
        hasFilter = true;
      }

      if (filters?.priceRange) {
        const [min, max] = filters.priceRange.split('-');
        query += ` AND price > ${min} AND price <= ${max}`;
        hasFilter = true;
      }

      // Add ordering
      if (filters?.order === 'price_asc') {
        query += ' ORDER BY price ASC';
      } else if (filters?.order === 'price_desc') {
        query += ' ORDER BY price DESC';
      } else if (filters?.order === 'title_asc') {
        query += ' ORDER BY title ASC';
      } else if (filters?.order === 'title_desc') {
        query += ' ORDER BY title DESC';
      } else if (!hasFilter) {
        query += ' ORDER BY comic_id OFFSET 0 ROWS FETCH NEXT 500 ROWS ONLY';
      }

      const result = await sql.query(query);
      return this.mapComicsWithImages(result.recordset);
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async findById(id: number): Promise<Comic | null> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`SELECT * FROM Comics WHERE comic_id = ${id}`);
      
      if (result.recordset.length === 0) {
        return null;
      }

      const comics = this.mapComicsWithImages(result.recordset);
      return comics[0];
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async findByIds(ids: number[]): Promise<Comic[]> {
    try {
      await sql.connect(this.dbConfig);
      const idsStr = ids.join(',');
      const result = await sql.query(`SELECT * FROM Comics WHERE comic_id IN (${idsStr})`);
      return this.mapComicsWithImages(result.recordset);
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async create(comicData: Omit<Comic, 'comic_id' | 'created_at' | 'updated_at'>): Promise<Comic> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`
        INSERT INTO Comics (title, author, publisher, genre, publication_date, price, stock_quantity, sold_quantity, review_quantity, description, image)
        OUTPUT INSERTED.*
        VALUES ('${comicData.title}', '${comicData.author}', '${comicData.publisher}', '${comicData.genre}', 
                '${comicData.publication_date}', ${comicData.price}, ${comicData.stock_quantity}, 
                ${comicData.sold_quantity}, ${comicData.review_quantity}, '${comicData.description}', '${comicData.image}')
      `);
      
      const comics = this.mapComicsWithImages(result.recordset);
      return comics[0];
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async update(id: number, comicData: Partial<Comic>): Promise<Comic | null> {
    try {
      await sql.connect(this.dbConfig);
      
      const updateFields = Object.keys(comicData)
        .filter(key => key !== 'comic_id')
        .map(key => `${key} = '${(comicData as any)[key]}'`)
        .join(', ');

      if (updateFields.length === 0) {
        return this.findById(id);
      }

      const result = await sql.query(`
        UPDATE Comics 
        SET ${updateFields}, updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE comic_id = ${id}
      `);

      if (result.recordset.length === 0) {
        return null;
      }

      const comics = this.mapComicsWithImages(result.recordset);
      return comics[0];
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`DELETE FROM Comics WHERE comic_id = ${id}`);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async getFilterOptions(): Promise<ComicFilterOptions> {
    try {
      await sql.connect(this.dbConfig);
      
      const [authorsResult, publishersResult, genresResult] = await Promise.all([
        sql.query("SELECT DISTINCT author FROM Comics"),
        sql.query("SELECT DISTINCT publisher FROM Comics"),
        sql.query("SELECT DISTINCT genre FROM Comics")
      ]);

      return {
        authors: authorsResult.recordset.map((row: any) => row.author),
        publishers: publishersResult.recordset.map((row: any) => row.publisher),
        genres: genresResult.recordset.map((row: any) => row.genre)
      };
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async updateStock(id: number, quantityChange: number): Promise<boolean> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`
        UPDATE Comics 
        SET stock_quantity = stock_quantity + ${quantityChange}, updated_at = GETDATE()
        WHERE comic_id = ${id}
      `);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async incrementSoldQuantity(id: number, quantity: number): Promise<boolean> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`
        UPDATE Comics 
        SET sold_quantity = sold_quantity + ${quantity}, updated_at = GETDATE()
        WHERE comic_id = ${id}
      `);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  private mapComicsWithImages(records: any[]): Comic[] {
    const fs = require('fs');
    const path = require('path');
    const imagesDir = path.join(__dirname, '../../../public/images');

    return records.map((record: any) => {
      const baseName = record.title;
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
        ...record,
        image: `/images/${imageFileName}`,
        publication_date: new Date(record.publication_date),
        created_at: new Date(record.created_at),
        updated_at: new Date(record.updated_at)
      };
    });
  }
}