import { Request, Response } from "express";
import Member from "../models/member.model";
import Department from "../models/department.model";

export const createMember = async (req: Request, res: Response) => {
    try {
        const member = await Member.create(req.body);

        if (member.departmentId) {
            await Department.findByIdAndUpdate(
                member.departmentId,
                { $push: { members: member._id } },
                { new: true }
            );
        }

        res.status(201).json(member);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllMembers = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;

        let filter: any = {};

        if (search) {
            const searchWords = (search as string).trim().split(/\s+/); // Разбиваем по пробелам

            filter.$and = searchWords.map(word => ({
                $or: [
                    { studentId: { $regex: word, $options: "i" } },
                    { name: { $regex: word, $options: "i" } },
                    { surname: { $regex: word, $options: "i" } },
                    { email: { $regex: word, $options: "i" } },
                    { position: { $regex: word, $options: "i" } },
                    { telegram: { $regex: word, $options: "i" } },
                    { linkedinURL: { $regex: word, $options: "i" } },
                    { githubURL: { $regex: word, $options: "i" } },
                ]
            }));
        }

        const members = await Member.find(filter).populate({
            path: "departmentId",
            select: "name headId"
        });

        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const getAllMembersToUsers = async (req: Request, res: Response) => {
    try{
        const { search } = req.query;

        let filter: any = {};

        if (search) {
            const searchWords = (search as string).trim().split(/\s+/); // Разбиваем по пробелам

            filter.$and = searchWords.map(word => ({
                $or: [
                    { studentId: { $regex: word, $options: "i" } },
                    { name: { $regex: word, $options: "i" } },
                    { surname: { $regex: word, $options: "i" } },
                    { email: { $regex: word, $options: "i" } },
                    { position: { $regex: word, $options: "i" } },
                    { telegram: { $regex: word, $options: "i" } },
                    { linkedinURL: { $regex: word, $options: "i" } },
                    { githubURL: { $regex: word, $options: "i" } },
                ]
            }));
        }

        const members = await Member.find(filter).select("name surname position").populate({
            path: "departmentId",
            select: "name"
        });
        res.status(200).json(members);
    }catch(error){
        res.status(500).json({ message: error });
    }
}



export const getMemberById = async (req: Request, res: Response) => {
    try{
        const member = await Member.findById(req.params.id).populate({
            path: "departmentId",
            select: "name headId"
        });
        res.status(200).json(member);
    }catch(error){
        res.status(500).json({ message: error });
    }
}

export const updateMember = async (req: Request, res: Response) => {
    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!member) {
            res.status(404).json({ message: "Member not found" });
            return;
        }
        res.json(member);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMember = async (req: Request, res: Response) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) {
            res.status(404).json({ message: "Member not found" });
            return;
        }


        if (member.departmentId) {
            await Department.findByIdAndUpdate(
                member.departmentId,
                { $pull: { members: member._id } },
                { new: true }
            );
        }

        res.json({ message: "Member deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
