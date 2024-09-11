import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import {
  GetUsers,
  GetUserById,
  CreateUser,
  UpdateUserById,
  DeleteUserById,
} from "./routes/user";
import {
  GetProjects,
  GetProjectById,
  CreateProject,
  UpdateProjectById,
  DeleteProjectById,
} from "./routes/project";
import {
  CreateTask,
  DeleteTaskById,
  GetTaskById,
  GetTasks,
  UpdateTaskById,
} from "./routes/task";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URI as string, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
});

app.get("/api/user", GetUsers);
app.get("/api/user/:id", GetUserById);
app.post("/api/user", CreateUser);
app.put("/api/user/:id", UpdateUserById);
app.delete("/api/user/:id", DeleteUserById);

app.get("/api/project", GetProjects);
app.get("/api/project/:id", GetProjectById);
app.post("/api/project", CreateProject);
app.put("/api/project/:id", UpdateProjectById);
app.delete("/api/project/:id", DeleteProjectById);

//LO: test ^v^v & look at issues in routes/user.ts, then add specific routes.

app.get("/api/task", GetTasks);
app.get("/api/task/:id", GetTaskById);
app.post("/api/task", CreateTask);
app.put("/api/task/:id", UpdateTaskById);
app.delete("/api/task/:id", DeleteTaskById);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});
