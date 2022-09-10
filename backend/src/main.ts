import express, { Router } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { categoryRouter, filterRouter, refillRouter, productRouter } from './routers';

dotenv.config();

const app = express();
const port = process.env.PORT;
const apiRouter = Router();

apiRouter.use('/categories', categoryRouter);
apiRouter.use('/filters', filterRouter);
apiRouter.use('/refills', refillRouter);
apiRouter.use('/products', productRouter);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

const frontendPath = __dirname + '/../../frontend/dist';
app.use('/', express.static(frontendPath));
app.use('/api', apiRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`⚡️ Server is running at http://localhost:${port}`);
});
