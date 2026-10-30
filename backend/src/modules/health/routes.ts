import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/health
// Returns 200 without a database check today. The 503 case is added on Day 06.
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

export default router;
