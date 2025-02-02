import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";

export const RoleMiddleware = (reqRole: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        try {
            const decodedUser = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
            const user = await User.findById(decodedUser.userId).select("role");

            if (!user) {
                res.status(401).json({ message: "User not found" });
                return;
            }

            if (user.role !== reqRole) {
                res.status(403).json({ message: "Forbidden" });
                return;
            }

            next();
        } catch (err) {
            res.status(401).json({ message: "Invalid token" });
        }
    };
};
