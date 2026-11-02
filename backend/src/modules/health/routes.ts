import { Router, Request, Response } from 'express';
import { checkDatabaseConnectivity } from '../../database/connection';

const router = Router();

// GET /api/health
// Returns 200 { status: 'ok' } when the database is reachable.
// Returns 503 { status: 'unavailable' } when the database cannot be reached.
// Never throws: all failures are caught inside checkDatabaseConnectivity.
router.get('/', async (_req: Request, res: Response) => {
  const isUp = await checkDatabaseConnectivity();
  if (isUp) {
    res.status(200).json({ status: 'ok' });
  } else {
    res.status(503).json({ status: 'unavailable' });
  }
});

export default router;
