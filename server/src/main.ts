import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DependencyContainer } from './infrastructure/config';
import { createRoutes } from './infrastructure/web';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize dependency injection container
const container = new DependencyContainer();

// Setup routes
const routes = createRoutes(
  container.comicController,
  container.orderController,
  container.reviewController
);

app.use('/', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Comics Store API is running' });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Comics Store Server listening on http://localhost:${port}`);
  console.log(`📊 Health check available at http://localhost:${port}/health`);
});

export default app;