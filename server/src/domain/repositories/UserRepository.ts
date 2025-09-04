import { User } from '../entities';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(user: Omit<User, 'user_id' | 'created_at' | 'updated_at'>): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}