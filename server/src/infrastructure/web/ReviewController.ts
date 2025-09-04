import { Request, Response } from 'express';
import { GetReviewsUseCase } from '../../application/usecases';

export class ReviewController {
  constructor(private getReviewsUseCase: GetReviewsUseCase) {}

  async getReviewsByComicId(req: Request, res: Response): Promise<void> {
    try {
      const comicId = parseInt(req.params.comic_id, 10);

      if (isNaN(comicId) || comicId <= 0) {
        res.status(400).json({ error: 'Valid comic ID is required' });
        return;
      }

      const reviews = await this.getReviewsUseCase.execute(comicId);
      res.json(reviews);
    } catch (error) {
      console.error('Error getting reviews:', error);
      res.status(500).json({ error: 'Failed to get reviews' });
    }
  }
}