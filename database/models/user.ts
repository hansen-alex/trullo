import { Schema, model } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "owner";
}

const userSchema = new Schema<IUser>({
  _id: String,
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "owner"], required: true },
});

export const User = model("User", userSchema);
