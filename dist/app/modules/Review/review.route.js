"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const review_controller_1 = require("./review.controller");
const router = (0, express_1.Router)();
router.post("/create-review", (0, auth_1.default)(client_1.UserRole.CUSTOMER), review_controller_1.ReviewController.createReview);
router.get("/product-reviews/:productId", review_controller_1.ReviewController.getProductReviews);
router.get("/user-reviews", (0, auth_1.default)(client_1.UserRole.CUSTOMER), review_controller_1.ReviewController.getUserReviews);
router.get("/shop-product-reviews", (0, auth_1.default)(client_1.UserRole.VENDOR), review_controller_1.ReviewController.getShopProductReviews);
router.put("/reply-review", review_controller_1.ReviewController.replyReview);
router.put("/:reviewId", review_controller_1.ReviewController.updateReview);
router.delete("/:id", review_controller_1.ReviewController.deleteReview);
exports.ReviewRoutes = router;
