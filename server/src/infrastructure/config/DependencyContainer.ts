import { dbConfig } from './DatabaseConfig';

// Repositories
import { 
  SqlServerComicRepository,
  SqlServerOrderRepository, 
  SqlServerReviewRepository 
} from '../database';

// Use Cases
import {
  GetComicsUseCase,
  GetComicFiltersUseCase,
  CreateOrderUseCase,
  GetReviewsUseCase,
  GetSalesUseCase
} from '../../application/usecases';

// Controllers
import {
  ComicController,
  OrderController,
  ReviewController
} from '../web';

export class DependencyContainer {
  // Repositories
  public readonly comicRepository: SqlServerComicRepository;
  public readonly orderRepository: SqlServerOrderRepository;
  public readonly reviewRepository: SqlServerReviewRepository;

  // Use Cases
  public readonly getComicsUseCase: GetComicsUseCase;
  public readonly getComicFiltersUseCase: GetComicFiltersUseCase;
  public readonly createOrderUseCase: CreateOrderUseCase;
  public readonly getReviewsUseCase: GetReviewsUseCase;
  public readonly getSalesUseCase: GetSalesUseCase;

  // Controllers
  public readonly comicController: ComicController;
  public readonly orderController: OrderController;
  public readonly reviewController: ReviewController;

  constructor() {
    // Initialize repositories
    this.comicRepository = new SqlServerComicRepository(dbConfig);
    this.orderRepository = new SqlServerOrderRepository(dbConfig);
    this.reviewRepository = new SqlServerReviewRepository(dbConfig);

    // Initialize use cases
    this.getComicsUseCase = new GetComicsUseCase(this.comicRepository);
    this.getComicFiltersUseCase = new GetComicFiltersUseCase(this.comicRepository);
    this.createOrderUseCase = new CreateOrderUseCase(this.orderRepository, this.comicRepository);
    this.getReviewsUseCase = new GetReviewsUseCase(this.reviewRepository);
    this.getSalesUseCase = new GetSalesUseCase(this.orderRepository);

    // Initialize controllers
    this.comicController = new ComicController(
      this.getComicsUseCase, 
      this.getComicFiltersUseCase
    );
    
    this.orderController = new OrderController(
      this.createOrderUseCase,
      this.getSalesUseCase
    );
    
    this.reviewController = new ReviewController(this.getReviewsUseCase);
  }
}