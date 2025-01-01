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
exports.CouponServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createCoupon = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.coupon.create({
        data: payload,
    });
    return result;
});
const getAllCoupons = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const result = yield prisma_1.default.coupon.findMany({
        skip,
        take: limit,
    });
    const total = yield prisma_1.default.coupon.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const deleteCoupon = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.userCoupon.deleteMany({
            where: {
                couponId: id,
            },
        });
        const result = yield transactionClient.coupon.delete({
            where: {
                id,
            },
        });
        return result;
    }));
    return result;
});
const validateCoupon = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findUnique({
        where: { couponNumber: payload.code },
    });
    if (!coupon || coupon.expiryDate < new Date()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid or expired coupon");
    }
    return coupon;
});
exports.CouponServices = {
    createCoupon,
    getAllCoupons,
    deleteCoupon,
    validateCoupon,
};
