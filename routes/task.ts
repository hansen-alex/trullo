import { Request, Response } from "express";
import { Types } from "mongoose";
import { Task } from "../database/models/task";
import { Project } from "../database/models/project";

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
    task.status = "to-do";
    task.createdAt = Date.now();
    task.save();

    //Update projects tasks array
    await Project.findByIdAndUpdate(
      request.body.project,
      {
        $push: { tasks: task.id }
      }
    );

    return response.status(200).send(task);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const UpdateTaskById = async (request: Request, response: Response) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    return response.status(200).send(updatedTask);
  } catch (error) {
    console.log(error);

    return response.status(500).send(error);
  }
};

export const PushTaskTag = async (request: Request, response: Response) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: request.params.id, tags: { $nin: [ request.body.tag ] } },
      { $push: { tags: request.body.tag } },
      { new: true }
    );
    return response.status(200).send(updatedTask);
  } catch (error) {
    return response.status(500).send(error);
  }
}

export const PullTaskTag = async (request: Request, response: Response) => {
  try {   
    const updatedTask = await Task.findByIdAndUpdate(
      request.params.id,
      { $pull: { tags: request.body.tag } },
      { new: true }
    );
    return response.status(200).send(updatedTask);
  } catch (error) {
    return response.status(500).send(error);
  }
}

export const DeleteTaskById = async (request: Request, response: Response) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(request.params.id);

    //TODO: update projects tasks array

    return response.status(200).send(deletedTask);
  } catch (error) {
    return response.status(500).send(error);
  }
};
