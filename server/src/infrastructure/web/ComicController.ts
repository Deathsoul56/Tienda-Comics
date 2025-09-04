import { Request, Response } from 'express';
import { GetComicsUseCase, GetComicFiltersUseCase } from '../../application/usecases';
import { ComicFilters } from '../../domain/repositories';

export class ComicController {
  constructor(
    private getComicsUseCase: GetComicsUseCase,
    private getComicFiltersUseCase: GetComicFiltersUseCase
  ) {}

  async getComics(req: Request, res: Response): Promise<void> {
    try {
      const filters: ComicFilters = {
        author: req.query.author as string,
        publisher: req.query.publisher as string,
        genre: req.query.genre as string,
        priceRange: req.query.priceRange as string,
        order: req.query.order as any
      };

      const comics = await this.getComicsUseCase.execute(filters);
      res.json(comics);
    } catch (error) {
      console.error('Error getting comics:', error);
      res.status(500).json({ error: 'Failed to get comics' });
    }
  }

  async getComicFilters(req: Request, res: Response): Promise<void> {
    try {
      const filters = await this.getComicFiltersUseCase.execute();
      res.json(filters);
    } catch (error) {
      console.error('Error getting comic filters:', error);
      res.status(500).json({ error: 'Failed to get comic filters' });
    }
  }
}