import { Request, Response } from "express";
import { Types } from "mongoose";
import { Task } from "../database/models/task";

//TODO: fix same issues with validation & status codes as in user

export const GetTasks = async (request: Request, response: Response) => {
  try {
    const tasks = await Task.find();
    return response.status(200).send(tasks);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const GetTaskById = async (request: Request, response: Response) => {
  try {
    const task = await Task.findById(request.params.id);
    if (!task)
      return response
        .status(404)
        .send({ message: `No Task found with id: ${request.params.id}` });

    return response.status(200).send(task);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const CreateTask = async (request: Request, response: Response) => {
  try {
    const task = await new Task(request.body);
    task._id = new Types.ObjectId();
    task.save();

    return response.status(200).send(task);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const UpdateTaskById = async (request: Request, response: Response) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      request.params.id,
      request.body
    );
    return response.status(200).send(updatedTask);
  } catch (error) {
    console.log(error);

    return response.status(500).send(error);
  }
};

export const DeleteTaskById = async (request: Request, response: Response) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(request.params.id);
    return response.status(200).send(deletedTask);
  } catch (error) {
    return response.status(500).send(error);
  }
};
