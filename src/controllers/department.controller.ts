import { Request, Response } from "express";
import Department from "../models/department.model";
import Member from "../models/member.model";

export const createDepartment = async (req: Request, res: Response) => {
    try{
        const {
            name,
            headId,
            parentDepartmentId,
            subDepartments
        } = req.body;

        const department = await Department.create({
            name,
            headId,
            parentDepartmentId,
            subDepartments
        });

        if(department.headId){
            await Member.findOneAndUpdate(
                department.headId,
                {$set: {isHead: true}},
                { new: true }
            )
        }
        if(department.parentDepartmentId){
            await Department.findOneAndUpdate(
                department.parentDepartmentId,
                {$push: {subDepartments:department._id}},
                { new: true }
            )
        }

        res.status(200).json({
            success: true,
            message: "Department created successfully",
        });
    }catch(err){
        res.status(500).json({ message: err });
    }
}

export const getDepartmentById = async (req: Request, res: Response) => {
    try {
        const department = await Department.findById(req.params.id).populate("headId members parentDepartment");
        if (!department) {
            res.status(404).json({ message: "Department not found" });
            return;
        }
        res.json(department);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const getDepartmentsHierarchy = async (req: Request, res: Response) => {
    try {
        const getHierarchy = async (parentId: string | null) => {
            const departments = await Department.find({ parentDepartmentId: parentId })
                .populate("headId", "name surname")
                .populate({
                    path: "members",
                    select: "name surname",
                })
                .lean();

            for (let department of departments) {
                department.subDepartments = (await getHierarchy(department._id.toString()))
            }

            return departments;
        };

        const hierarchy = await getHierarchy(null);

        res.status(200).json(hierarchy);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


