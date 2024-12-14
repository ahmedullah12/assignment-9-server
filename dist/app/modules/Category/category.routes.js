"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const category_controller_1 = require("./category.controller");
const router = (0, express_1.Router)();
router.post("/create-category", (0, auth_1.default)(client_1.UserRole.ADMIN), category_controller_1.CategoryController.createCategory);
router.get("/", category_controller_1.CategoryController.getAllCategory);
router.get("/:categoryId", category_controller_1.CategoryController.getSingleCategory);
router.put("/:categoryId", (0, auth_1.default)(client_1.UserRole.ADMIN), category_controller_1.CategoryController.updateCategory);
router.delete("/:categoryId", (0, auth_1.default)(client_1.UserRole.ADMIN), category_controller_1.CategoryController.deleteCategory);
exports.CategoryRoutes = router;
