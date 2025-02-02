import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userId:string, res:Response) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET!, {
        expiresIn: "2d"
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return token;
}