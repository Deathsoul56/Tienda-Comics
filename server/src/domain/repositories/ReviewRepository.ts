import { Review } from '../entities';

export interface ReviewRepository {
  findAll(): Promise<Review[]>;
  findById(id: number): Promise<Review | null>;
  findByComicId(comicId: number): Promise<Review[]>;
  findByUserId(userId: number): Promise<Review[]>;
  create(review: Omit<Review, 'review_id' | 'created_at'>): Promise<Review>;
  update(id: number, review: Partial<Review>): Promise<Review | null>;
  delete(id: number): Promise<boolean>;
}