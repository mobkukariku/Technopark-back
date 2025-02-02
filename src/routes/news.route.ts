import express from "express";
import {AuthMiddleware} from "../middlewares/auth.middleware";
import {RoleMiddleware} from "../middlewares/role.middleware";
import {uploadNewsImageMiddleware} from "../middlewares/multer.middleware"
import {postNews, getNews, getNewsById, deleteNewsById} from "../controllers/news.controller";

const router = express.Router();

router.post("/", AuthMiddleware, RoleMiddleware("admin"),uploadNewsImageMiddleware, postNews);
router.get("/",  getNews);
router.get("/:id", getNewsById);
router.delete("/:id", AuthMiddleware, RoleMiddleware("admin"), deleteNewsById);

export default router;