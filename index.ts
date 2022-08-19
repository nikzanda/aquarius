import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import filterRouter from './src/routers/filter.routes'

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors())

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.use('/filters', filterRouter)

app.listen(port, () => {
  console.log(`⚡️ Server is running at http://localhost:${port}`);
});
