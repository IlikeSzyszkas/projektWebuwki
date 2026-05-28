import { Router, Request, Response, NextFunction } from 'express';
import { getDriverStandings, getConstructorStandings } from '../services/cacheService';

const router = Router();

router.get('/drivers/:season', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const season = parseInt(req.params.season);
    if (isNaN(season)) {
      res.status(400).json({ error: 'Invalid season year' });
      return;
    }
    const standings = await getDriverStandings(season);
    res.json({ season, standings });
  } catch (err) {
    next(err);
  }
});

router.get('/constructors/:season', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const season = parseInt(req.params.season);
    if (isNaN(season)) {
      res.status(400).json({ error: 'Invalid season year' });
      return;
    }
    const standings = await getConstructorStandings(season);
    res.json({ season, standings });
  } catch (err) {
    next(err);
  }
});

export default router;
