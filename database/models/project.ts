import { Types, Schema, model } from "mongoose";

export interface IProject {
  _id: Types.ObjectId;
  owner: string;
  name: string;
  users: string[];
  tasks: string[];
  tags: string[];
}

const projectSchema = new Schema<IProject>({
  _id: Types.ObjectId,
  name: { type: String, required: true },
  owner: { type: String, required: true },
  users: { type: [String], required: true },
  tasks: [String],
  tags: [String]
});

export const Project = model("Project", projectSchema);
