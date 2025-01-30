import { Request, Response, NextFunction } from "express";
import JoinRequest from "../models/joinRequest.model";
import {saveToGoogleSheets} from "../services/googleSheets.service";

export const joinRequest = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { name, surname, email, message, direction } = req.body;
        if(!name || !surname || !email || !message){
            res.status(400).send({
                error: "Missing required parameter",
            });
            return;
        }
        const newRequest = new JoinRequest({
            name,
            surname,
            email,
            direction,
            message,
        });
        await newRequest.save();
        await saveToGoogleSheets(name, surname, email, direction, message);
        res.status(201).json({ message: "✅ Request sent successfully!" });
    }catch(err){
        res.status(400).send({
            error: err,
        })
        next(err);
    }
}