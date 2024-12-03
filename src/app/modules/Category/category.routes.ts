import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CategoryController } from "./category.controller";

const router = Router();

router.post(
  "/create-category",
  auth(UserRole.ADMIN),
  CategoryController.createCategory
);
router.get("/", CategoryController.getAllCategory);
router.get("/:categoryId", CategoryController.getSingleCategory);
router.put(
  "/:categoryId",
  auth(UserRole.ADMIN),
  CategoryController.updateCategory
);
router.delete(
  "/:categoryId",
  auth(UserRole.ADMIN),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;
