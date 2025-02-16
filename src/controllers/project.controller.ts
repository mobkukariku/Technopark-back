import { Request, Response } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import Project from "../models/project.model";
import {getQueryOptions} from "../utils/query.helper";
import {deleteImageFromS3} from "../services/s3Service";

export const CreateProject = async (req: Request, res: Response) => {
    try {
        const { title, description, direction } = req.body;

        const { userId: id } = jwt.verify(req.cookies.token, process.env.JWT_SECRET!) as JwtPayload;


        if (!req.files || (req.files as Express.MulterS3.File[]).length === 0) {
            res.status(400).json({ error: "Изображения не загружены" });
            return
        }

        console.log(req.files);



        const imageURLs = (req.files as Express.MulterS3.File[]).map(file => file.location);

        const project = new Project({
            title,
            description,
            imageURLs,
            direction,
            authorId: id,
        });

        await project.save();
        res.status(201).json({ message: "Проект был создан", project });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка при создании проекта", err });
    }
};


export const getProjects = async (req: Request, res: Response) => {
    try {
        const { direction, } = req.query;
        const {  filter, sortOption, skip, pageSize, pageNumber,  } = getQueryOptions(req.query);

        if (direction) {
            filter.direction = direction;
        }

        const projects = await Project.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(pageSize);

        if (projects.length === 0) {
            res.status(200).json({ message: "No projects found with the given criteria", projects: [] });
            return
        }

        const totalCount = await Project.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / pageSize);

        res.status(200).json({
            message: "Success",
            projects,
            currentPage: pageNumber,
            totalPages,
            totalCount,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get projects", err });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) {
            res.status(200).json({
                message: "No project found with the given criteria",
            })
        }
        res.status(200).json({
            message: "Success",
            project,
        })
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Failed to get projects", err });
    }
}

export const deleteProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try{
        const project = await Project.findById(id);
        if (!project) {
            res.status(404).json({message: "No project found with the given criteria",})
            return;
        }

        await Promise.all(project.imageURLs.map(deleteImageFromS3));

        await Project.findByIdAndDelete(id);
        res.status(200).json({message: "Successfully deleted project"});
    }catch (err){
        console.error(err);
        res.status(500).json({ message: "Failed to delete project", err });
    }
}