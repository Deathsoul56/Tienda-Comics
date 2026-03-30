import { Comic } from '../../domain/entities';
import { ComicRepository } from '../../domain/repositories';

export class GetComicByIdUseCase {
  constructor(private comicRepository: ComicRepository) {}

  async execute(id: number): Promise<Comic | null> {
    return this.comicRepository.findById(id);
  }
}
