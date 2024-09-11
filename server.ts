import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { User } from "./database/models/user";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URI as string, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
});

app.get("/api/user", async (request: Request, response: Response) => {
  try {
    const users = await User.find();
    return response.status(200).send(users);
  } catch (error) {
    return response.status(500).send(error);
  }
});

app.get("/api/user/:id", async (request: Request, response: Response) => {
  try {
    const user = await User.findById(request.params.id);
    if (!user) return response.status(404).send({ message: "No user found!" });

    return response.status(200).send(user);
  } catch (error) {
    return response.status(500).send(error);
  }
});

app.post("/api/user", async (request: Request, response: Response) => {
  try {
    const user = await new User(request.body); //TODO: validation on data, ex role
    user._id = new Types.ObjectId();
    user.save();

    return response.status(200).send(user);
  } catch (error) {
    return response.status(500).send(error);
  }
});

app.put("/api/user/:id", async (request: Request, response: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      request.params.id,
      request.body /* TODO: validation, tried to update field "namee", got a status 200. also got 200 on unexisting id (probably an issue elsewhere too), might be intended???*/
    );
    return response.status(200).send(updatedUser); //Does not always (ever?) return updated name
  } catch (error) {
    console.log(error);

    return response.status(500).send(error);
  }
});

app.delete("/api/user/:id", async (request: Request, response: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(request.params.id);
    return response.status(200).send(deletedUser);
  } catch (error) {
    return response.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});
