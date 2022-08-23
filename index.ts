import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import categoryRouter from './src/routers/category.routes';
import filterRouter from './src/routers/filter.routes';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const frontendPath = __dirname + '/../frontend/dist';
app.use('/', express.static(frontendPath));

app.use('/categories', categoryRouter);
app.use('/filters', filterRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`⚡️ Server is running at http://localhost:${port}`);
});
