import express from "express";
import {getProfile, updateProfile, updatePassword,} from "../controllers/profile.controller";
import {AuthMiddleware} from "../middlewares/auth.middleware";

const router = express.Router();

router.get('/', AuthMiddleware, getProfile);
router.patch('/', AuthMiddleware, updateProfile);
router.post('/change-password', AuthMiddleware, updatePassword);

export default router;
