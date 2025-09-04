import { Comic } from '../../domain/entities';
import { ComicRepository, ComicFilters } from '../../domain/repositories';

export class GetComicsUseCase {
  constructor(private comicRepository: ComicRepository) {}

  async execute(filters?: ComicFilters): Promise<Comic[]> {
    try {
      return await this.comicRepository.findAll(filters);
    } catch (error) {
      throw new Error(`Failed to get comics: ${error}`);
    }
  }
}