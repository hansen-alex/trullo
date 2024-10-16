import { Request, Response } from "express";
import { Types } from "mongoose";
import bcrypt from "bcrypt"
import { User } from "../database/models/user";

const encryptPassword = (password: string) => {
  return bcrypt.hash(password, 10);
}

export const GetUsers = async (request: Request, response: Response) => {
  try {
    const users = await User.find();
    return response.status(200).send(users);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const GetUserById = async (request: Request, response: Response) => {
  try {
    const user = await User.findById(request.params.id);
    if (!user)
      return response
        .status(404)
        .send({ message: `No User found with id: ${request.params.id}` });

    return response.status(200).send(user);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const CreateUser = async (request: Request, response: Response) => {
  try {
    const user = await new User(request.body); //TODO: validation on data, ex role
    user._id = new Types.ObjectId();
    user.password = await encryptPassword(user.password);
    user.save();

    return response.status(200).send(user);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const SignIn = async (request: Request, response: Response) => {
  try {
    const user = await User.findOne({ email: request.body.email });
    
    if(!request.body.password) return response.status(400).send({ message: "No password submitted." });
    if(!user) return response.status(400).send({ message: "Email and password do not match." })
    if(!await bcrypt.compare(request.body.password, user!.password)) return response.status(400).send({ message: "Email and password do not match." });

    return response.status(200).send(/*{ token: "TODO" }*/);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const UpdateUserById = async (request: Request, response: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      request.params.id,
      /* TODO: validation, tried to update field "namee", got a status 200. also got 200 on unexisting id (probably an issue elsewhere too), might be intended??? */
      request.body,
      { new: true }
    );
    return response.status(200).send(updatedUser);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const ResetPassword = async (request: Request, response: Response) => {
  try {
    if(!request.body.oldPassword) return response.status(400).send({ message: "No password submitted." });
    if(!request.body.newPassword) return response.status(400).send({ message: "No new password submitted." });
    if(request.body.oldPassword == request.body.newPassword) return response.status(400).send({ message: "New password is the same as old." });
    
    const user = await User.findById(request.params.id)
    if(!user) return response.status(404).send({ message: "User not found." })

    if(!await bcrypt.compare(request.body.oldPassword, user!.password)) return response.status(400).send({ message: "Incorrect password." });

    user.password = await encryptPassword(request.body.newPassword);
    user.save();

    return response.status(200).send();
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const DeleteUserById = async (request: Request, response: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(request.params.id);

    //what to do with projects this user owns? delete?
    //update any task this user is assigned to

    return response.status(200).send(deletedUser);
  } catch (error) {
    return response.status(500).send(error);
  }
};
