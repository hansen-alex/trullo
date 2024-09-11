import { Schema, model } from "mongoose";

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  status: "to-do" | "in progress" | "done" | "blocked";
  assignedTo?: string;
  createdAt: string;
  finishedBy: string;
  tags?: string[];
}

const taskSchema = new Schema<ITask>({
  _id: String,
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["to-do", "in-progess", "done", "blocked"],
    required: true,
  },
  assignedTo: String,
  createdAt: { type: String, required: true },
  finishedBy: { type: String, required: true },
  tags: [String],
});

export const Task = model("Task", taskSchema);
