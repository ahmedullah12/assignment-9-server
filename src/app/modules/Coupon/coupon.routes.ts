import { Router } from "express";
import { CouponController } from "./coupon.controller";

const router = Router();

router.post("/create-coupon", CouponController.createCoupon);
router.get("/", CouponController.getAllCoupons);
router.delete("/:couponId", CouponController.deleteCoupon);
router.post("/validate-coupon", CouponController.validateCoupon);

export const CouponRoutes = router;