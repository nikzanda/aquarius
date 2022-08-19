import express from "express";
import dotenv from "dotenv";
import testRouter from './src/routers/filter.routes'

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.use('/filters', testRouter)

app.listen(port, () => {
  console.log(`⚡️ Server is running at http://localhost:${port}`);
});
