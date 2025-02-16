import express from "express";
import {AuthMiddleware} from "../middlewares/auth.middleware";
import {RoleMiddleware} from "../middlewares/role.middleware";
import {
    createMember,
    deleteMember,
    getAllMembers,
    getAllMembersToUsers,
    getMemberById,
    updateMember
} from "../controllers/member.controller";

const router = express.Router();

router.post("/", AuthMiddleware, RoleMiddleware("admin"), createMember);
router.get("/", getAllMembersToUsers);
router.get("/all",AuthMiddleware, RoleMiddleware("admin"), getAllMembers);
router.get("/:id",getMemberById);
router.put("/:id", AuthMiddleware, RoleMiddleware("admin"), updateMember);
router.delete("/:id", AuthMiddleware, RoleMiddleware("admin"), deleteMember);


export default router;