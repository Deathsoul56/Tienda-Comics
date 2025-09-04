import type { Comic, ComicFilters } from '../../domain/entities';
import type { ComicRepository } from '../../domain/repositories';

export class GetComicsUseCase {
  private comicRepository: ComicRepository;

  constructor(comicRepository: ComicRepository) {
    this.comicRepository = comicRepository;
  }

  async execute(filters?: ComicFilters): Promise<Comic[]> {
    try {
      return await this.comicRepository.findAll(filters);
    } catch (error) {
      throw new Error(`Failed to get comics: ${error}`);
    }
  }
}