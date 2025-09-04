import { Review } from '../../domain/entities';
import { ReviewRepository } from '../../domain/repositories';

export class GetReviewsUseCase {
  constructor(private reviewRepository: ReviewRepository) {}

  async execute(comicId: number): Promise<Review[]> {
    try {
      if (comicId <= 0) {
        throw new Error('Comic ID must be a positive number');
      }

      return await this.reviewRepository.findByComicId(comicId);
    } catch (error) {
      throw new Error(`Failed to get reviews: ${error}`);
    }
  }
}