import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/environment';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';
import healthRoutes from './modules/health/routes';
import requestRoutes from './modules/requests/routes';

const app = express();

// Security headers — sets X-Content-Type-Options, removes X-Powered-By and more.
// Registered first so every response carries the headers.
app.use(helmet());

// CORS — must come before routes so preflight OPTIONS requests are answered.
app.use(
  cors({
    origin: env.corsOrigin,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }),
);

// Structured request logging — before routes so all requests are captured.
app.use(requestLogger);

// Parse JSON bodies. Cap at 10 kb — enough for any valid request payload.
// Oversized bodies raise an error with status 413, caught by errorHandler.
// Malformed JSON produces a SyntaxError, also caught by errorHandler.
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/requests', requestRoutes);

// Unknown routes — must come after all registered routes.
app.use(notFoundHandler);

// Central error handler — must be last and must have four parameters.
app.use(errorHandler);

export default app;
