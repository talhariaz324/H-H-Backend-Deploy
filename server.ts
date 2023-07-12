import 'express-async-errors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { errorHandler, notFoundMiddleware } from './middlewares';
import { connectDB } from './config/db';
import routes from './routes';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api', routes);
app.use(notFoundMiddleware);
app.use(errorHandler);

const port = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI as string);
    console.log('Database connected');
    app.listen(port, () => console.log(`Server is up and running on ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
