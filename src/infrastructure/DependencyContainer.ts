// Repositories
import { ApiComicRepository, ApiOrderRepository } from './api';
import { LocalStorageCartRepository } from './storage';

// Use Cases
import {
  GetComicsUseCase,
  GetComicFiltersUseCase,
  CartUseCase,
  CheckoutUseCase
} from '../application/usecases';

export class DependencyContainer {
  // Repositories
  public readonly comicRepository: ApiComicRepository;
  public readonly cartRepository: LocalStorageCartRepository;
  public readonly orderRepository: ApiOrderRepository;

  // Use Cases
  public readonly getComicsUseCase: GetComicsUseCase;
  public readonly getComicFiltersUseCase: GetComicFiltersUseCase;
  public readonly cartUseCase: CartUseCase;
  public readonly checkoutUseCase: CheckoutUseCase;

  constructor() {
    // Initialize repositories
    this.comicRepository = new ApiComicRepository();
    this.cartRepository = new LocalStorageCartRepository();
    this.orderRepository = new ApiOrderRepository();

    // Initialize use cases
    this.getComicsUseCase = new GetComicsUseCase(this.comicRepository);
    this.getComicFiltersUseCase = new GetComicFiltersUseCase(this.comicRepository);
    this.cartUseCase = new CartUseCase(this.cartRepository);
    this.checkoutUseCase = new CheckoutUseCase(this.cartRepository, this.orderRepository);
  }
}

// Global instance
export const container = new DependencyContainer();