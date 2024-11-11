import { Request, Response } from "express";
import { Types } from "mongoose";
import bcrypt from "bcrypt"
import { User } from "../database/models/user";
import { Project } from "../database/models/project";
import { Task } from "../database/models/task";

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
        .send({ message: `No User found.` });

    return response.status(200).send(user);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const CreateUser = async (request: Request, response: Response) => {
  try {
    //Validate that email is unique
    if(await User.findOne({email: request.body.email})) return response.status(400).send({ message: "Email is already in use." });
    
    const user = await new User(request.body);
    user._id = new Types.ObjectId();
    user.password = await encryptPassword(user.password);

    const validationError = user.validateSync();
    if(validationError) throw validationError;
    user.save();

    return response.status(200).send(user);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const SignIn = async (request: Request, response: Response) => {
  try {
    if(!request.body.email) return response.status(400).send({ message: "No email submitted." });
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
      request.body,
      { new: true }
    );

    if(!updatedUser) return response.status(404).send({ message: "No user found." });

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
    const user = await User.findById(request.params.id);
    if(!user) return response.status(404).send({ message: "User not found." });

    //Dont let user be deleted if they own a project
    if((await Project.find({ owner: user._id })).length > 0) return response.status(400).send({ message: "User must transfer ownership of all project before deletion." })

    //Update any task this user is assigned to
    await Task.updateMany({ assignedTo: user._id }, { assignedTo: null });

    //Update any project this user has joined
    await Project.updateMany({ users: { "$in": user._id } }, { $pull: { users: user._id } });

    await user.deleteOne();

    return response.status(200).send();
  } catch (error) {
    return response.status(500).send(error);
  }
};
