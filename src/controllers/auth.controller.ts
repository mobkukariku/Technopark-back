import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import {generateToken} from "../lib/utils";

export const Register = async(req: Request, res: Response) => {
    try{
        const {name, surname, email, password} = req.body;
        const existingUser  = await User.findOne({ email });
        if (existingUser) {
            res.status(401).json({ error: "User already exist" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user =  new User({
            name,
            surname,
            email,
            password: hashedPassword,
            imageURL: "https://steamuserimages-a.akamaihd.net/ugc/958605370499381693/3C16418245B329D07B16E9DBD0D4690C5F207331/?imw=512&amp;imh=512&amp;ima=fit&amp;impolicy=Letterbox&amp;imcolor=%23000000&amp;letterbox=true",
        });
        const token = generateToken(String(user._id), res);

        await user.save();
        res.status(201).json({message: "User created", token})
    }catch(error){
        res.status(500).json({
            message: "An error occurred",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}


export const Login = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: "User does not exist" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            res.status(401).json({ error: "Invalid password" });
            return;
        }
        const token = generateToken(String(user._id), res);
        res.status(200).json({ message: "Login successful", token});
    }catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}

export const Logout = async (req: Request, res: Response) => {
    try {
        if (!req.cookies?.token) {
            return res.status(401).json({ error: "Token not found" });
        }

        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });

        return res.status(200).json({ message: "Вы успешно вышли из системы" });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка при выходе", error });
    }
};
