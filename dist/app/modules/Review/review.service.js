"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createReview = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: { email: user.email },
    });
    const existingReview = yield prisma_1.default.review.findFirst({
        where: {
            productId: payload.productId,
            userId: userData.id,
        },
    });
    if (existingReview) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You have already reviewed this product.");
    }
    const result = yield prisma_1.default.review.create({
        data: Object.assign(Object.assign({}, payload), { userId: userData.id }),
    });
    return result;
});
const getProductReviews = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.findMany({
        where: {
            productId,
        },
        include: {
            user: true,
            product: true,
        },
    });
    return result;
});
const getUserReviews = (user, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const result = yield prisma_1.default.review.findMany({
        where: {
            userId: userData.id,
        },
        skip,
        take: limit,
        include: {
            user: true,
            product: true,
        },
    });
    const total = yield prisma_1.default.review.count({
        where: {
            userId: userData.id,
        }
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getShopProductReviews = (shopId, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const result = yield prisma_1.default.review.findMany({
        where: {
            product: {
                shopId,
            },
        },
        skip,
        take: limit,
        include: {
            user: true,
            product: true,
        },
    });
    const total = yield prisma_1.default.review.count({
        where: {
            product: {
                shopId,
            },
        },
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateReview = (reviewId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.update({
        where: {
            id: reviewId,
        },
        data: payload,
    });
    return result;
});
const deleteReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.delete({
        where: {
            id,
        },
    });
    return result;
});
const replyReview = (reviewId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.update({
        where: {
            id: reviewId,
        },
        data: {
            reply: payload.reply,
        },
    });
    return result;
});
exports.ReviewServices = {
    createReview,
    getProductReviews,
    getUserReviews,
    getShopProductReviews,
    updateReview,
    deleteReview,
    replyReview,
};
