import { Request, Response } from "express";
import { isValidObjectId, Types } from "mongoose";
import { Project } from "../database/models/project";
import { Task } from "../database/models/task";
import { User } from "../database/models/user";

export const GetProjects = async (request: Request, response: Response) => {
  try {
    const projects = await Project.find();
    return response.status(200).send(projects);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const GetProjectById = async (request: Request, response: Response) => {
  try {
    const project = await Project.findById(request.params.id);
    if (!project)
      return response
        .status(404)
        .send({ message: `No Project found with id: ${request.params.id}` });

    return response.status(200).send(project);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const GetProjectTasks = async (request: Request, response: Response) => {  
  try {
    const project = await Project.findById(request.params.id);
    if (!project)
      return response
        .status(404)
        .send({ message: `No Project found with id: ${request.params.id}` });

    const tasks = await Task.find({ "_id": { $in: project?.tasks } });
    return response.status(200).send(tasks);
  } catch (error) {
    return response.status(500).send(error);
  }
}

export const GetProjectUsers = async (request: Request, response: Response) => {  
  try {
    const project = await Project.findById(request.params.id);
    if (!project) return response.status(404).send({ message: `No Project found with id: ${request.params.id}` });
    
    const users = await User.find({ "_id": { $in: project?.users } });
    return response.status(200).send(users.map(user => ({ "name": user.name, "email": user.email, "role": user.role })));
  } catch (error) {
    return response.status(500).send(error);
  }
}

export const CreateProject = async (request: Request, response: Response) => {
  try {
    if(!isValidObjectId(request.body.owner)) return response.status(400).send({ message: "Invalid project owner ID." });

    const project = await new Project(request.body);
    project._id = new Types.ObjectId();
    project.users = [request.body.owner]

    const validationError = project.validateSync();
    if(validationError) throw validationError;
    project.save();

    await User.findOneAndUpdate({ _id: request.body.owner }, { $push: { joinedProjects: project._id } })

    return response.status(200).send(project);
  } catch (error) {
    return response.status(500).send(error);
  }
};

export const UpdateProjectById = async (
  request: Request,
  response: Response
) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );

    if(!updatedProject) return response.status(404).send({ message: "No Project found." });

    return response.status(200).send(updatedProject);
  } catch (error) {
    console.log(error);

    return response.status(500).send(error);
  }
};

export const PushProjectTag = async (request: Request, response: Response) => {
  try {
    if(!request.body.tag) return response.status(400).send({ message: "Cannot submit empty tag." });

    const updatedProject = await Project.findOneAndUpdate(
      { _id: request.params.id, tags: { $nin: [ request.body.tag ] } },
      { $push: { tags: request.body.tag } },
      { new: true }
    );

    return response.status(200).send(updatedProject);
  } catch (error) {
    return response.status(500).send(error);
  }
}

export const PullProjectTag = async (request: Request, response: Response) => {
  try {
    //Remove tag from all tasks with it in this project
    await Task.updateMany({ project: request.params.id, tags: request.body.tag }, { $pull: { tags: request.body.tag } });

    const updatedProject = await Project.findByIdAndUpdate(
      request.params.id,
      { $pull: { tags: request.body.tag } },
      { new: true }
    );
    return response.status(200).send(updatedProject);
  } catch (error) {
    return response.status(500).send(error);
  }
}

export const DeleteProjectById = async (
  request: Request,
  response: Response
) => {
  try {
    //Remove project from all users projects arrays
    await User.updateMany({ joinedProjects: request.params.id }, { $pull: { joinedProjects: request.params.id } });

    //Delete all tasks in project
    await Task.deleteMany({
      project: request.params.id
    })

    const deletedProject = await Project.findByIdAndDelete(request.params.id);
    return response.status(200).send(deletedProject);
  } catch (error) {
    return response.status(500).send(error);
  }
};
