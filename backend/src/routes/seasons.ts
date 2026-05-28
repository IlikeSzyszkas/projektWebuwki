import { Router, Request, Response, NextFunction } from 'express';
import { getSeasons } from '../services/cacheService';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const seasons = await getSeasons();
    res.json({ seasons });
  } catch (err) {
    next(err);
  }
});

export default router;
