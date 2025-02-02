import express from "express";
import {Register, Login, Logout} from "../controllers/auth.controller"
const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
// @ts-ignore
router.post("/logout", Logout);

export default router;