import { Router, Request, Response, NextFunction } from 'express';
import { getRaceResults, getQualifyingResults } from '../services/cacheService';

const router = Router();

router.get('/:season/:round', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const season = parseInt(req.params.season);
    const round = parseInt(req.params.round);
    if (isNaN(season) || isNaN(round) || round < 1) {
      res.status(400).json({ error: 'Invalid season or round' });
      return;
    }
    const [results, qualifying] = await Promise.all([
      getRaceResults(season, round),
      getQualifyingResults(season, round),
    ]);
    res.json({ season, round, results, qualifying });
  } catch (err) {
    next(err);
  }
});

export default router;
