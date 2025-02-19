import { Request, Response, NextFunction } from "express";

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies || !req.cookies.token) {
        res.status(401).json({ message: "Unauthorized" });
    }
    next();
};
