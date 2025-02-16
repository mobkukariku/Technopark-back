import express from "express";
import {uploadMultipleImagesMiddleware} from "../middlewares/multer.middleware";
import {CreateProject, deleteProjectById, getProjects} from "../controllers/project.controller";
import {AuthMiddleware} from "../middlewares/auth.middleware";
import {RoleMiddleware} from "../middlewares/role.middleware";


const router = express.Router();

router.post('/', AuthMiddleware, RoleMiddleware("admin"), uploadMultipleImagesMiddleware, CreateProject);
router.delete('/:id', AuthMiddleware, RoleMiddleware("admin"), deleteProjectById);
router.get('/', getProjects);

export default router;