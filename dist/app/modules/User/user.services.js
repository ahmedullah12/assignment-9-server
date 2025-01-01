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
exports.UserServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const getAllUsers = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const result = yield prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            contactNumber: true,
            address: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            shop: true,
            followShop: true,
            reviews: true,
        },
        skip,
        take: limit,
    });
    const total = yield prisma_1.default.user.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getUserWithEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            contactNumber: true,
            address: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            shop: {
                include: {
                    products: true,
                },
            },
            followShop: true,
            reviews: true,
        },
    });
    if (!result) {
        return null;
    }
    return result;
});
const getUserWithId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            contactNumber: true,
            address: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            shop: true,
            followShop: true,
            reviews: true,
        },
    });
    return result;
});
const updateUser = (id, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        payload.profileImage = file.path;
    }
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            contactNumber: true,
            address: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            shop: true,
            followShop: true,
            reviews: true,
        },
    });
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            status: client_1.UserStatus.DELETED,
        },
    });
    return result;
});
const suspendUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: { id },
        select: { status: true },
    });
    const newStatus = user.status === client_1.UserStatus.SUSPENDED
        ? client_1.UserStatus.ACTIVE
        : client_1.UserStatus.SUSPENDED;
    const result = yield prisma_1.default.user.update({
        where: { id },
        data: { status: newStatus },
        select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            contactNumber: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return {
        message: result.status === client_1.UserStatus.SUSPENDED
            ? "User has been suspended!!"
            : "User account has been reactivated!!",
        user: result,
    };
});
const followShop = (user, shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    // check if the shop exists
    const shop = yield prisma_1.default.shop.findUnique({
        where: { id: shopId },
    });
    if (!shop) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Shop not found");
    }
    // Check if the user already follows the shop
    const existingFollow = yield prisma_1.default.followShop.findUnique({
        where: {
            userId_shopId: { userId: userData.id, shopId }, // Composite primary key
        },
    });
    if (existingFollow) {
        // Unfollow the shop
        yield prisma_1.default.followShop.delete({
            where: {
                userId_shopId: { userId: userData.id, shopId },
            },
        });
        return { message: "Shop unfollowed successfully", followed: false };
    }
    else {
        // Follow the shop
        yield prisma_1.default.followShop.create({
            data: { userId: userData.id, shopId },
        });
        return { message: "Shop followed successfully", followed: true };
    }
});
const userSubscribe = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const alreadyUser = yield prisma_1.default.subscribedUser.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (alreadyUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Already subscribed previously!!");
    }
    const result = yield prisma_1.default.subscribedUser.create({
        data: payload,
    });
    return result;
});
exports.UserServices = {
    getAllUsers,
    getUserWithEmail,
    getUserWithId,
    updateUser,
    deleteUser,
    suspendUser,
    followShop,
    userSubscribe,
};
