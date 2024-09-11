import { Types, Schema, model } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: /* TODO: This would be a user role over the hole app, i want it per project */
  "user" | "admin" | "owner";
}

const userSchema = new Schema<IUser>({
  _id: Types.ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "owner"], required: true },
});

export const User = model("User", userSchema);
