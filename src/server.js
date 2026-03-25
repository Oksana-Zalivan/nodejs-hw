import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pinoHttp from 'pino-http';
import { errors } from 'celebrate';

import notesRouter from './routes/notesRoutes.js';
import { connectMongoDB } from './db/connectMongoDB.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

const logger = pinoHttp({
  transport: {
    target: 'pino-pretty',
  },
});

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/notes', notesRouter);

app.get('/test-error', (req, res) => {
  throw new Error('Simulated server error');
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use(errors());

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

const bootstrap = async () => {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
