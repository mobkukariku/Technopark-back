import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import News from "../models/news.model";
import {deleteImageFromS3} from "../services/s3Service";

export const postNews = async (req: Request, res: Response) => {
    try {
        const { title, content, tags } = req.body;
        const { userId: id } = jwt.verify(req.cookies.token, process.env.JWT_SECRET!) as JwtPayload;

        if (!req.file) {
            res.status(400).json({ error: 'Изображение не загружено' });
            return;
        }

        const imageURL = (req.file as any).location;

        const formattedTags = Array.isArray(tags) ? tags : tags.split(",").map((tag: string) => tag.trim());

        const news = new News({
            title,
            content,
            imageURL,
            tags: formattedTags,
            authorId: id,
        });

        await news.save();
        res.status(201).json({ message: "Новость успешно добавлена" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ошибка при создании новости", err });
    }
};



export const getNews = async(req: Request, res: Response) => {
    try{
        const { tags, sort, search, page, limit} = req.query;

        let filter: any = {};
        if (tags) {
            filter.tags = { $in: (tags as string).split(",") };
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }
        let sortOption = {};
        if (sort === "newest") {
            sortOption = { createdAt: -1 };
        } else if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        }


        const pageNumber = parseInt(page as string) || 1;
        const pageSize = parseInt(limit as string) || 10;
        const skip = (pageNumber - 1) * pageSize;

        const news = await News.find(filter)
            .select("-authorId")
            .sort(sortOption)
            .skip(skip)
            .limit(pageSize);

        if (news.length === 0) {
            res.status(200).json({ message: "No news found with the given criteria", news: [] });
            return;
        }

        const totalCount = await News.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / pageSize);

        res.status(200).json({
            message: "Successfully filtered news",
            news,
            currentPage: pageNumber,
            totalPages,
            totalCount,
        });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get news", err});
    }
}

export const getNewsById = async (req: Request, res: Response) => {
    try{
        const news = await News.findById(req.params.id).select("-authorId");
        if(!news) {
            res.status(404).json({message:"Not Found",});
            return;
        }
        res.status(200).json({message:"Successfully getting profile", news});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get news", err});
    }
}

export const getNewsSidebar = async (req: Request, res: Response) => {
    try{
        const { exceptId } = req.query;
        const news = await News.find({_id:{$ne: exceptId}}).limit(3).select("title createdAt content");
        if(!news) {
            res.status(404).json({message:"Not Found",});
            return;
        }
        res.status(200).json(news);
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get news", err});
    }
}

export const deleteNewsById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{

        const post = await News.findById(id);
        if(!post) {
            res.status(404).json({message:"News Not Found"});
            return;
        }

        await deleteImageFromS3(post.imageURL.toString());

        await News.findByIdAndDelete(id);
        res.status(200).json({message:"Successfully deleted News"});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to delete News", err});
    }
}