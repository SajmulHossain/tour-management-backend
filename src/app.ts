import httpStatus from 'http-status-codes';
import cors from "cors";
import express, { Request, Response } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { router } from "./app/routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to tour management system",
  });
});


app.use(globalErrorHandler)
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).
  json({
    success: false,
    message: "Route not found"
  })
})

export default app;