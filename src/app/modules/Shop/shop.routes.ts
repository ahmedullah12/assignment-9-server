import { Router } from "express";
import { ShopController } from "./shop.controller";

const router = Router();

router.post("/create-shop", ShopController.createShop);
router.get("/", ShopController.getAllShop);
router.get("/:shopId", ShopController.getSingleShop);
router.put("/:shopId", ShopController.updateShop);
router.delete("/:shopId", ShopController.deleteShop);

export const ShopRoutes = router;
