import sql from 'mssql';
import { Review } from '../../domain/entities';
import { ReviewRepository } from '../../domain/repositories';

export class SqlServerReviewRepository implements ReviewRepository {
  constructor(private dbConfig: sql.config) {}

  async findAll(): Promise<Review[]> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`
        SELECT Reviews.review_id, Reviews.comic_id, Reviews.user_id, Users.user_name, 
               Reviews.rating, Reviews.review_text, Reviews.created_at
        FROM dbo.Reviews
        LEFT JOIN Users ON Users.user_id = Reviews.user_id
        ORDER BY Reviews.created_at DESC
      `);

      return result.recordset.map(this.mapReviewRecord);
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async findById(id: number): Promise<Review | null> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`
        SELECT Reviews.review_id, Reviews.comic_id, Reviews.user_id, Users.user_name, 
               Reviews.rating, Reviews.review_text, Reviews.created_at
        FROM dbo.Reviews
        LEFT JOIN Users ON Users.user_id = Reviews.user_id
        WHERE Reviews.review_id = ${id}
      `);

      if (result.recordset.length === 0) {
        return null;
      }

      return this.mapReviewRecord(result.recordset[0]);
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async findByComicId(comicId: number): Promise<Review[]> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`
        SELECT Reviews.review_id, Reviews.comic_id, Reviews.user_id, Users.user_name, 
               Reviews.rating, Reviews.review_text, Reviews.created_at
        FROM dbo.Reviews
        LEFT JOIN Users ON Users.user_id = Reviews.user_id
        WHERE Reviews.comic_id = ${comicId}
        ORDER BY Reviews.created_at DESC
      `);

      return result.recordset.map(this.mapReviewRecord);
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async findByUserId(userId: number): Promise<Review[]> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`
        SELECT Reviews.review_id, Reviews.comic_id, Reviews.user_id, Users.user_name, 
               Reviews.rating, Reviews.review_text, Reviews.created_at
        FROM dbo.Reviews
        LEFT JOIN Users ON Users.user_id = Reviews.user_id
        WHERE Reviews.user_id = ${userId}
        ORDER BY Reviews.created_at DESC
      `);

      return result.recordset.map(this.mapReviewRecord);
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async create(reviewData: Omit<Review, 'review_id' | 'created_at'>): Promise<Review> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`
        INSERT INTO Reviews (comic_id, user_id, rating, review_text, created_at)
        OUTPUT INSERTED.*
        VALUES (${reviewData.comic_id}, ${reviewData.user_id}, ${reviewData.rating}, 
                '${reviewData.review_text}', GETDATE())
      `);

      const insertedRecord = result.recordset[0];
      return {
        review_id: insertedRecord.review_id,
        comic_id: insertedRecord.comic_id,
        user_id: insertedRecord.user_id,
        user_name: reviewData.user_name,
        rating: insertedRecord.rating,
        review_text: insertedRecord.review_text,
        created_at: new Date(insertedRecord.created_at)
      };
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async update(id: number, reviewData: Partial<Review>): Promise<Review | null> {
    try {
      await sql.connect(this.dbConfig);
      
      const updateFields: string[] = [];
      
      if (reviewData.rating !== undefined) {
        updateFields.push(`rating = ${reviewData.rating}`);
      }
      
      if (reviewData.review_text !== undefined) {
        updateFields.push(`review_text = '${reviewData.review_text}'`);
      }

      if (updateFields.length === 0) {
        return this.findById(id);
      }

      const result = await sql.query(`
        UPDATE Reviews 
        SET ${updateFields.join(', ')}
        WHERE review_id = ${id}
      `);

      if (result.rowsAffected[0] === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`DELETE FROM Reviews WHERE review_id = ${id}`);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  private mapReviewRecord(record: any): Review {
    return {
      review_id: record.review_id,
      comic_id: record.comic_id,
      user_id: record.user_id,
      user_name: record.user_name || `User ${record.user_id}`,
      rating: record.rating,
      review_text: record.review_text,
      created_at: new Date(record.created_at)
    };
  }
}