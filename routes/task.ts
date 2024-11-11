import { Request, Response } from "express";
import { isValidObjectId, Types } from "mongoose";
import { Task } from "../database/models/task";
import { Project } from "../database/models/project";

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
    if(!isValidObjectId(request.body.project)) return response.status(400).send({ message: "Invalid project ID." });
    if(!await Project.exists({ _id: request.body.project })) return response.status(404).send({ message: `No Project found with id: ${request.body.project}` });

    const task = await new Task(request.body);
    task._id = new Types.ObjectId();
    task.status = "to-do";
    task.createdAt = Date.now();

    const validationError = task.validateSync();
    if(validationError) throw validationError;
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

    if(!updatedTask) return response.status(404).send({ message: "No Task found." });

    return response.status(200).send(updatedTask);
  } catch (error) {
    console.log(error);

    return response.status(500).send(error);
  }
};

export const PushTaskTag = async (request: Request, response: Response) => {
  try {
    if(!request.body.tag) return response.status(400).send({ message: "Invalid tag name." });

    const task = await Task.findById(request.params.id)
    if(!task) return response.status(404).send({ message: "No Task found." });

    const project = await Project.findById(task.project);
    if(!project) return response.status(404).send({ message: "Task is in invalid Project." });

    //Validate that tag exists in project
    if(!project.tags.includes(request.body.tag)) return response.status(400).send({ message: `${request.body.tag} is not a valid tag in Project.` });

    //Tag is already applied to Task
    if(task.tags.includes(request.body.tag)) return response.status(200).send(task);

    await task.updateOne(
      { $push: { tags: request.body.tag } },
    );

    return response.status(200).send(task);
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
    const task = await Task.findById(request.params.id);
    if(!task) return response.status(404).send({ message: "No Task found." });
    
    //Update projects tasks array
    await Project.findOneAndUpdate({ _id: task.project }, { $pull: { tasks: request.params.id }});

    await task.deleteOne();

    return response.status(200).send(task);
  } catch (error) {
    return response.status(500).send(error);
  }
};
