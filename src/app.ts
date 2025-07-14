import cors from "cors";
import express from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from './app/middlewares/notFound';
import { router } from "./app/routes";
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser())

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to tour management system",
  });
});

app.use(globalErrorHandler)
app.use(notFound)

export default app;