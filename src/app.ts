import cors from 'cors';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorController } from './controllers';
import { authRoutes, userRoutes } from './routes';
import { AppError } from './utils';

const app = express();
// Middleware

if (process.env.NODE_ENV === 'development') {
  // biome-ignore lint/suspicious/noConsole: console log for development mode
  console.log('Development mode');
  app.use(morgan('dev'));
} else {
  app.use(morgan('tiny'));
}

app.use(helmet());
app.use(cors());

app.use(xss());

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
console.log(process.env.NODE_ENV);

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

export default app;
