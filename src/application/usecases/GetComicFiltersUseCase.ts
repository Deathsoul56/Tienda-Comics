import type { ComicFilterOptions } from '../../domain/entities';
import type { ComicRepository } from '../../domain/repositories';

export class GetComicFiltersUseCase {
  private comicRepository: ComicRepository;

  constructor(comicRepository: ComicRepository) {
    this.comicRepository = comicRepository;
  }

  async execute(): Promise<ComicFilterOptions> {
    try {
      return await this.comicRepository.getFilterOptions();
    } catch (error) {
      throw new Error(`Failed to get comic filters: ${error}`);
    }
  }
}