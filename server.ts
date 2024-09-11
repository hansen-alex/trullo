import dotenv from "dotenv";
import express, { Request, Response } from "express";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

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
