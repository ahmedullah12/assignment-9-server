import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validations";

const router = Router();

router.get("/", auth(UserRole.ADMIN), UserController.getAllUsers);
router.get("/user-email", UserController.getUserWithEmail);
router.post("/subscribe-user", UserController.userSubscribe);
router.get("/:id", UserController.getUserWithId);
router.put(
  "/:id",
  validateRequest(UserValidations.updateUserValidationsSchema),
  UserController.updateUser
);
router.delete("/:id", UserController.deleteUser);
router.delete("/suspend-user/:id", UserController.suspendUser);
router.put(
  "/follow-shop/:shopId",
  UserController.followShop
);

export const UserRoutes = router;
