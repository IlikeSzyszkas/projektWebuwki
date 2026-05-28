import { Router } from 'express';
import seasonRoutes from './seasons';
import raceRoutes from './races';
import resultRoutes from './results';
import standingRoutes from './standings';

const router = Router();

router.use('/seasons', seasonRoutes);
router.use('/races', raceRoutes);
router.use('/results', resultRoutes);
router.use('/standings', standingRoutes);

export default router;
