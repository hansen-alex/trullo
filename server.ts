import dotenv from "dotenv";
import express from "express";
import cors from "cors"
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
  GetProjectTasks,
  GetProjectUsers,
  PushProjectTag,
  PullProjectTag,
} from "./routes/project";
import {
  CreateTask,
  DeleteTaskById,
  GetTasks,
  GetTaskById,
  UpdateTaskById,
  PushTaskTag,
  PullTaskTag,
} from "./routes/task";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DB_URI as string, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
});

app.get("/api/user", GetUsers);
app.post("/api/user", CreateUser);
app.get("/api/user/:id", GetUserById);
app.put("/api/user/:id", UpdateUserById);
app.delete("/api/user/:id", DeleteUserById);

app.get("/api/project", GetProjects);
app.post("/api/project", CreateProject);
app.get("/api/project/:id", GetProjectById);
app.get("/api/project/:id/tasks", GetProjectTasks);
app.get("/api/project/:id/users", GetProjectUsers);
app.put("/api/project/:id", UpdateProjectById);
app.put("/api/project/:id/tag/push", PushProjectTag);
app.put("/api/project/:id/tag/pull", PullProjectTag);
app.delete("/api/project/:id", DeleteProjectById);

app.get("/api/task", GetTasks);
app.post("/api/task", CreateTask);
app.get("/api/task/:id", GetTaskById);
app.put("/api/task/:id", UpdateTaskById);
app.put("/api/task/:id/tag/push", PushTaskTag);
app.put("/api/task/:id/tag/pull", PullTaskTag);
app.delete("/api/task/:id", DeleteTaskById);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});
