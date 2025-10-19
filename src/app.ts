import cors from 'cors';
import express from 'express';
import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRoutes, userRoutes } from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(xss());

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
	// biome-ignore lint/suspicious/noConsole: console log for development mode
	console.log('Development mode');
	app.use(morgan('dev'));
}

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

export default app;
