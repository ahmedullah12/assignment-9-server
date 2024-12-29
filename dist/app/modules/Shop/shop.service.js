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
exports.ShopServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createShop = (user, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    //checking if user is a vendor
    if (user.role !== client_1.UserRole.VENDOR) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User needs to be a vendor to create shop.");
    }
    //making logo upload compulsory
    if (!file) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please upload a logo!!");
    }
    //getting vendor data
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    //check if duplicate shop name
    const isShopNameExists = yield prisma_1.default.shop.findUnique({
        where: {
            name: payload.name,
        },
    });
    if (isShopNameExists) {
        throw new Error("Shop name already exists!!");
    }
    const result = yield prisma_1.default.shop.create({
        data: Object.assign(Object.assign({}, payload), { vendorId: userData.id, logoUrl: file.path }),
    });
    return result;
});
const getAllShop = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const result = yield prisma_1.default.shop.findMany({
        skip,
        take: limit,
        include: {
            vendor: true,
            products: true,
        }
    });
    const total = yield prisma_1.default.shop.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getAllActiveShop = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const result = yield prisma_1.default.shop.findMany({
        where: {
            status: client_1.ShopStatus.ACTIVE,
        },
        skip,
        take: limit,
        include: {
            vendor: true,
            products: true,
        }
    });
    const total = yield prisma_1.default.shop.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleShopWithId = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shop.findUnique({
        where: {
            id: shopId,
            status: client_1.ShopStatus.ACTIVE,
        },
        include: {
            vendor: true,
            products: true,
            followShop: {
                include: {
                    user: true,
                },
            },
        },
    });
    return result;
});
const getVendorShop = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const result = yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            vendorId: userData.id,
        },
        include: {
            vendor: true,
            products: true,
        },
    });
    return result;
});
const updateShop = (user, payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    // Get vendor data
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        include: {
            shop: true,
        },
    });
    // Check if shop exists for the vendor
    const existingShop = userData.shop;
    if (!existingShop) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Shop not found for the vendor.");
    }
    // Check if duplicate shop name only if name is being updated and is different
    if (payload.name && payload.name !== existingShop.name) {
        const isShopNameExists = yield prisma_1.default.shop.findUnique({
            where: {
                name: payload.name,
            },
        });
        if (isShopNameExists) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, "Shop name already exists!");
        }
    }
    // Update logo if provided
    if (file) {
        payload.logoUrl = file.path;
    }
    // Perform the update
    const result = yield prisma_1.default.shop.update({
        where: {
            vendorId: userData.id,
        },
        data: payload,
    });
    return result;
});
const deleteShop = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shop.update({
        where: {
            id: shopId,
        },
        data: {
            status: client_1.ShopStatus.DELETED,
        },
    });
    return result;
});
const blacklistShop = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield prisma_1.default.shop.findUniqueOrThrow({
        where: {
            id: shopId,
        },
        select: {
            status: true,
        },
    });
    const isCurrentlyBlacklisted = shop.status === client_1.ShopStatus.BLACKLISTED;
    const newStatus = isCurrentlyBlacklisted
        ? client_1.ShopStatus.ACTIVE
        : client_1.ShopStatus.BLACKLISTED;
    yield prisma_1.default.shop.update({
        where: {
            id: shopId,
        },
        data: {
            status: newStatus,
        },
    });
    // Return a message based on the new status
    return isCurrentlyBlacklisted
        ? { message: "The shop has been activated and is now active." }
        : { message: "The shop has been blacklisted." };
});
exports.ShopServices = {
    createShop,
    getAllShop,
    getAllActiveShop,
    getSingleShopWithId,
    getVendorShop,
    updateShop,
    deleteShop,
    blacklistShop,
};
