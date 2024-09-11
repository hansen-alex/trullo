import { Request, Response } from "express";
import { Types } from "mongoose";
import { Project } from "../database/models/project";

//TODO: fix same issues with validation & status codes as in user

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

export const CreateProject = async (request: Request, response: Response) => {
  try {
    const project = await new Project(request.body);
    project._id = new Types.ObjectId();
    project.save();

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
      request.body
    );
    return response.status(200).send(updatedProject);
  } catch (error) {
    console.log(error);

    return response.status(500).send(error);
  }
};

export const DeleteProjectById = async (
  request: Request,
  response: Response
) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(request.params.id);
    return response.status(200).send(deletedProject);
  } catch (error) {
    return response.status(500).send(error);
  }
};
