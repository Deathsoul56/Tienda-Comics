import { ComicRepository, ComicFilterOptions } from '../../domain/repositories';

export class GetComicFiltersUseCase {
  constructor(private comicRepository: ComicRepository) {}

  async execute(): Promise<ComicFilterOptions> {
    try {
      return await this.comicRepository.getFilterOptions();
    } catch (error) {
      throw new Error(`Failed to get comic filters: ${error}`);
    }
  }
}