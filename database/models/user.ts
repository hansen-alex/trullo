import { Types, Schema, model } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: /* TODO: This would be a user role over the hole app, would make more sense per project */
  "user" | "admin" | "owner";
  joinedProjects: string[];
}

const userSchema = new Schema<IUser>({
  _id: Types.ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "owner"], required: true },
  joinedProjects: [String]
});

export const User = model("User", userSchema);
