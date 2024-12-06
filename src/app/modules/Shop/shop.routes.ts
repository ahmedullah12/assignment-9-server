import { Router } from "express";
import { ShopController } from "./shop.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { multerUpload } from "../../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";
import { validateRequest } from "../../middlewares/validateRequest";
import { ShopValidations } from "./shop.validations";

const router = Router();

router.post(
  "/create-shop",
  auth(UserRole.VENDOR),
  multerUpload.single("logo"),
  parseBody,
  validateRequest(ShopValidations.createShopValidationSchema),
  ShopController.createShop
);
router.get("/", auth(UserRole.ADMIN), ShopController.getAllShop);
router.get(
  "/:shopId",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  ShopController.getSingleShop
);
router.put(
  "/",
  auth(UserRole.VENDOR),
  multerUpload.single("logo"),
  parseBody,
  ShopController.updateShop
);
router.delete("/:shopId", ShopController.deleteShop);

export const ShopRoutes = router;
