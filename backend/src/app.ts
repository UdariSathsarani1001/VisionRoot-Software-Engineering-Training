import express from 'express';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import healthRoutes from './modules/health/routes';
import requestRoutes from './modules/requests/routes';

const app = express();

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
