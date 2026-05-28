import express from 'express';
import cors from 'cors';
import router from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

export default app;
