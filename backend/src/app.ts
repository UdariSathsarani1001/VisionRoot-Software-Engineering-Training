import express from 'express';
import cors from 'cors';
import { env } from './config/environment';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import healthRoutes from './modules/health/routes';
import requestRoutes from './modules/requests/routes';

const app = express();

// CORS — must come before routes so preflight OPTIONS requests are answered.
app.use(
  cors({
    origin: env.corsOrigin,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }),
);

// Parse JSON bodies. Malformed JSON produces a SyntaxError caught by errorHandler.
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/requests', requestRoutes);

// Unknown routes — must come after all registered routes.
app.use(notFoundHandler);

// Central error handler — must be last and must have four parameters.
app.use(errorHandler);

export default app;
