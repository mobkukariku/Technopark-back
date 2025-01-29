import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import News from "../models/news.model";

export const postNews = async (req: Request, res: Response) => {
    try {
        const { title, content, tags } = req.body;
        const { userId: id } = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as JwtPayload;

        if (!req.file) {
            res.status(400).json({ error: 'Изображение не загружено' });
            return;
        }

        const imageURL = (req.file as any).location;

        const news = new News({
            title,
            content,
            imageURL,
            tags: tags ? tags.split(',') : ['other'],
            authorId: id,
        });

        await news.save();
        res.status(201).json({ message: "Новость успешно добавлена", news });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ошибка при создании новости", err });
    }
};


export const getNews = async(req: Request, res: Response) => {
    try{
        const news = await News.find();
        res.status(200).json({message:"Successfully getting profile", news});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get profile", err});
    }
}

export const getNewsById = async (req: Request, res: Response) => {
    try{
        const news = await News.findById(req.params.id);
        if(!news) {
            res.status(404).json({message:"Not Found",});
            return;
        }
        res.status(200).json({message:"Successfully getting profile", news});
    }catch(err){
        console.log(err);
    }
}

export const deleteNewsById = async (req: Request, res: Response) => {
    try{
        const news = await News.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Successfully deleted profile", news});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to delete profile", err});
    }
}