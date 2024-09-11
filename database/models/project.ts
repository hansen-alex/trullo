import { Schema, model } from "mongoose";

export interface IProject {
  _id: string;
  name: string;
  owner: string;
  users: string[];
  tasks: string[];
}

const projectSchema = new Schema<IProject>({
  _id: String,
  name: { type: String, required: true },
  owner: { type: String, required: true },
  users: { type: [String], required: true },
  tasks: { type: [String], required: true },
});

export const Project = model("Project", projectSchema);