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
router.get("/",auth(UserRole.ADMIN), ShopController.getAllShop);
router.get("/active-shops", ShopController.getAllActiveShop);
router.get(
  "/user-shop",
  auth(UserRole.ADMIN, UserRole.VENDOR),
  ShopController.getVendorShop
);
router.get(
  "/:shopId",
  ShopController.getSingleShopWithId
);
router.put(
  "/",
  auth(UserRole.VENDOR),
  multerUpload.single("logo"),
  parseBody,
  ShopController.updateShop
);
router.put("/blacklist-shop/:shopId", ShopController.blacklistShop);
router.delete("/:shopId", ShopController.deleteShop);

export const ShopRoutes = router;
