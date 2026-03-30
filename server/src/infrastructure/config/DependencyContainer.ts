import { dbConfig } from './DatabaseConfig';

// Repositories
import {
  SqlServerComicRepository,
  SqlServerOrderRepository,
  SqlServerReviewRepository,
  SqlServerUserRepository
} from '../database';

// Use Cases
import {
  GetComicsUseCase,
  GetComicFiltersUseCase,
  GetComicByIdUseCase,
  CreateOrderUseCase,
  GetReviewsUseCase,
  GetSalesUseCase,
  AuthUseCase
} from '../../application/usecases';

// Controllers
import {
  ComicController,
  OrderController,
  ReviewController,
  AuthController
} from '../web';

export class DependencyContainer {
  // Repositories
  public readonly comicRepository: SqlServerComicRepository;
  public readonly orderRepository: SqlServerOrderRepository;
  public readonly reviewRepository: SqlServerReviewRepository;
  public readonly userRepository: SqlServerUserRepository;

  // Use Cases
  public readonly getComicsUseCase: GetComicsUseCase;
  public readonly getComicFiltersUseCase: GetComicFiltersUseCase;
  public readonly getComicByIdUseCase: GetComicByIdUseCase;
  public readonly createOrderUseCase: CreateOrderUseCase;
  public readonly getReviewsUseCase: GetReviewsUseCase;
  public readonly getSalesUseCase: GetSalesUseCase;
  public readonly authUseCase: AuthUseCase;

  // Controllers
  public readonly comicController: ComicController;
  public readonly orderController: OrderController;
  public readonly reviewController: ReviewController;
  public readonly authController: AuthController;

  constructor() {
    // Initialize repositories
    this.comicRepository = new SqlServerComicRepository(dbConfig);
    this.orderRepository = new SqlServerOrderRepository(dbConfig);
    this.reviewRepository = new SqlServerReviewRepository(dbConfig);
    this.userRepository = new SqlServerUserRepository(dbConfig);

    // Initialize use cases
    this.getComicsUseCase = new GetComicsUseCase(this.comicRepository);
    this.getComicFiltersUseCase = new GetComicFiltersUseCase(this.comicRepository);
    this.getComicByIdUseCase = new GetComicByIdUseCase(this.comicRepository);
    this.createOrderUseCase = new CreateOrderUseCase(this.orderRepository, this.comicRepository);
    this.getReviewsUseCase = new GetReviewsUseCase(this.reviewRepository);
    this.getSalesUseCase = new GetSalesUseCase(this.orderRepository);

    // Initialize controllers
    this.comicController = new ComicController(
      this.getComicsUseCase,
      this.getComicFiltersUseCase,
      this.getComicByIdUseCase
    );

    this.orderController = new OrderController(
      this.createOrderUseCase,
      this.getSalesUseCase
    );

    this.reviewController = new ReviewController(this.getReviewsUseCase);

    this.authUseCase = new AuthUseCase(this.userRepository);
    this.authController = new AuthController(this.authUseCase);
  }
}