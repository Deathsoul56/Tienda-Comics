import sql from 'mssql';
import { User, UserEntity } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';

export class SqlServerUserRepository implements UserRepository {
    constructor(private dbConfig: sql.config) { }

    async findAll(): Promise<User[]> {
        try {
            await sql.connect(this.dbConfig);
            const result = await sql.query('SELECT * FROM Users');
            return result.recordset;
        } catch (error) {
            throw new Error(`Database error: ${error}`);
        }
    }

    async findById(id: number): Promise<User | null> {
        try {
            await sql.connect(this.dbConfig);
            const request = new sql.Request();
            request.input('id', sql.Int, id);
            const result = await request.query('SELECT * FROM Users WHERE user_id = @id');

            if (result.recordset.length === 0) return null;
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Database error: ${error}`);
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            await sql.connect(this.dbConfig);
            const request = new sql.Request();
            request.input('email', sql.NVarChar, email);
            const result = await request.query('SELECT * FROM Users WHERE email = @email');

            if (result.recordset.length === 0) return null;
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Database error: ${error}`);
        }
    }

    async findByUsername(username: string): Promise<User | null> {
        try {
            await sql.connect(this.dbConfig);
            const request = new sql.Request();
            request.input('username', sql.NVarChar, username);
            const result = await request.query('SELECT * FROM Users WHERE user_name = @username');

            if (result.recordset.length === 0) return null;
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Database error: ${error}`);
        }
    }

    async create(userData: Omit<User, 'user_id' | 'created_at' | 'updated_at'>): Promise<User> {
        try {
            await sql.connect(this.dbConfig);
            const request = new sql.Request();
            request.input('user_name', sql.NVarChar, userData.user_name);
            request.input('email', sql.NVarChar, userData.email);
            request.input('password_hash', sql.NVarChar, userData.password_hash);
            request.input('first_name', sql.NVarChar, userData.first_name);
            request.input('last_name', sql.NVarChar, userData.last_name);

            const result = await request.query(`
        INSERT INTO Users (user_name, email, password_hash, first_name, last_name, created_at, updated_at)
        OUTPUT INSERTED.*
        VALUES (@user_name, @email, @password_hash, @first_name, @last_name, GETDATE(), GETDATE())
      `);

            return result.recordset[0];
        } catch (error) {
            throw new Error(`Database error: ${error}`);
        }
    }

    async update(id: number, user: Partial<User>): Promise<User | null> {
        try {
            await sql.connect(this.dbConfig);
            const request = new sql.Request();
            request.input('id', sql.Int, id);
            
            const queryOptions: string[] = [];
            if (user.user_name !== undefined) {
                queryOptions.push('user_name = @user_name');
                request.input('user_name', sql.NVarChar, user.user_name);
            }
            if (user.first_name !== undefined) {
                queryOptions.push('first_name = @first_name');
                request.input('first_name', sql.NVarChar, user.first_name);
            }
            if (user.last_name !== undefined) {
                queryOptions.push('last_name = @last_name');
                request.input('last_name', sql.NVarChar, user.last_name);
            }
            
            if (queryOptions.length === 0) return this.findById(id);

            queryOptions.push('updated_at = GETDATE()');
            
            await request.query(`
                UPDATE Users 
                SET ${queryOptions.join(', ')}
                WHERE user_id = @id
            `);

            return this.findById(id);
        } catch (error) {
            throw new Error(`Database error: ${error}`);
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            await sql.connect(this.dbConfig);
            const request = new sql.Request();
            request.input('id', sql.Int, id);
            const result = await request.query('DELETE FROM Users WHERE user_id = @id');
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Database error: ${error}`);
        }
    }
}
