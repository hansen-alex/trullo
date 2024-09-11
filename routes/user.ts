import { Request, Response } from "express";
import { Types } from "mongoose";
import { User } from "../database/models/user";

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
    user.save();

    return response.status(200).send(user);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const UpdateUserById = async (request: Request, response: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      request.params.id,
      request.body /* TODO: validation, tried to update field "namee", got a status 200. also got 200 on unexisting id (probably an issue elsewhere too), might be intended???*/
    );
    return response.status(200).send(updatedUser); //Does not always (ever?) return updated name
  } catch (error) {
    console.log(error);

    return response.status(500).send(error);
  }
};

export const DeleteUserById = async (request: Request, response: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(request.params.id);
    return response.status(200).send(deletedUser);
  } catch (error) {
    return response.status(500).send(error);
  }
};
