import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect(process.env.DB_URI as string, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
});

app.get("/", (request: Request, response: Response) => {
  try {
    response.status(200).send();
  } catch (error) {
    response.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});
