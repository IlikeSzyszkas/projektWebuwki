import { Router, Request, Response, NextFunction } from 'express';
import { getRaces } from '../services/cacheService';

const router = Router();

router.get('/:season', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const season = parseInt(req.params.season);
    if (isNaN(season) || season < 1950 || season > new Date().getFullYear()) {
      res.status(400).json({ error: 'Invalid season year' });
      return;
    }
    const races = await getRaces(season);
    res.json({ season, races });
  } catch (err) {
    next(err);
  }
});

export default router;
