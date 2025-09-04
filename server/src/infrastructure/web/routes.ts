import { Router } from 'express';
import { ComicController } from './ComicController';
import { OrderController } from './OrderController';
import { ReviewController } from './ReviewController';

export function createRoutes(
  comicController: ComicController,
  orderController: OrderController,
  reviewController: ReviewController
): Router {
  const router = Router();

  // Comic routes
  router.get('/comics', (req, res) => comicController.getComics(req, res));
  router.get('/comics/filters', (req, res) => comicController.getComicFilters(req, res));

  // Order routes
  router.post('/orders', (req, res) => orderController.createOrder(req, res));
  router.get('/ventas', (req, res) => orderController.getSales(req, res));
  router.get('/ventas-mensuales', (req, res) => orderController.getMonthlySales(req, res));

  // Review routes
  router.get('/reviews/:comic_id', (req, res) => reviewController.getReviewsByComicId(req, res));

  return router;
}