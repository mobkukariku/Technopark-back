import express from "express";
import { joinRequest } from "../controllers/joinRequests.controller";

const router = express.Router();

router.post("/", joinRequest);

export default router;
