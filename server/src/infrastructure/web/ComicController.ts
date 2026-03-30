import { Request, Response } from 'express';
import { GetComicsUseCase, GetComicFiltersUseCase, GetComicByIdUseCase } from '../../application/usecases';
import { ComicFilters } from '../../domain/repositories';

export class ComicController {
  constructor(
    private getComicsUseCase: GetComicsUseCase,
    private getComicFiltersUseCase: GetComicFiltersUseCase,
    private getComicByIdUseCase: GetComicByIdUseCase
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

  async getComicById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid ID format' });
        return;
      }
      const comic = await this.getComicByIdUseCase.execute(id);
      if (comic) {
        res.json(comic);
      } else {
        res.status(404).json({ error: 'Comic not found' });
      }
    } catch (error) {
      console.error('Error getting comic by id:', error);
      res.status(500).json({ error: 'Failed to get comic details' });
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