import express from "express";
import {
    createDepartment,
    getDepartmentById,
    getDepartmentsHierarchy
} from "../controllers/department.controller";
import {AuthMiddleware} from "../middlewares/auth.middleware";
import {RoleMiddleware} from "../middlewares/role.middleware";

const router = express.Router();

router.post("/", AuthMiddleware, RoleMiddleware("admin"), createDepartment);
router.get("/hierarchy", getDepartmentsHierarchy);
router.get("/:id", getDepartmentById);


export default  router;