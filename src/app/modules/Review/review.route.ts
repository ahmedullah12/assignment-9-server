import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ReviewController } from "./review.controller";

const router = Router();

router.post("/create-review", auth(UserRole.CUSTOMER), ReviewController.createReview);
router.get("/product-reviews/:productId", ReviewController.getProductReviews);
router.get("/user-reviews",auth(UserRole.CUSTOMER), ReviewController.getUserReviews);
router.put("/:reviewId", ReviewController.updateReview);
router.delete("/:id", ReviewController.deleteReview);

export const ReviewRoutes = router;