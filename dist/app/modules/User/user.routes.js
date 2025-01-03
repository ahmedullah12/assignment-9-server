"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_validations_1 = require("./user.validations");
const multer_config_1 = require("../../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserController.getAllUsers);
router.get("/subscribe-users", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserController.getAllSubscribeUsers);
router.get("/user-email", user_controller_1.UserController.getUserWithEmail);
router.post("/subscribe-user", user_controller_1.UserController.userSubscribe);
router.get("/:id", user_controller_1.UserController.getUserWithId);
router.put("/:id", multer_config_1.multerUpload.single("image"), bodyParser_1.parseBody, (0, validateRequest_1.validateRequest)(user_validations_1.UserValidations.updateUserValidationsSchema), user_controller_1.UserController.updateUser);
router.delete("/:id", user_controller_1.UserController.deleteUser);
router.delete("/suspend-user/:id", user_controller_1.UserController.suspendUser);
router.put("/follow-shop/:shopId", user_controller_1.UserController.followShop);
exports.UserRoutes = router;
