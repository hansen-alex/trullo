import { Types, Schema, model } from "mongoose";

export interface ITask {
  _id: Types.ObjectId;
  project: string;
  title: string;
  description: string;
  status: "to-do" | "in progress" | "done" | "blocked";
  assignedTo: string;
  createdAt: number;
  finishedBy: number;
  tags: string[];
}

const taskSchema = new Schema<ITask>({
  _id: Types.ObjectId,
  project: { type: String, required: true},
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["to-do", "in-progess", "done", "blocked"],
    required: true
  },
  assignedTo: String,
  createdAt: { type: Number, required: true },
  finishedBy: Number,
  tags: [String],
});

export const Task = model("Task", taskSchema);
