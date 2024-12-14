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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCollectionService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const payment_utils_1 = require("../Payment/payment.utils");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createPayment = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { products } = payload, payloadData = __rest(payload, ["products"]);
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: { email: user.email },
    });
    const transactionId = `TXN-SS-${Date.now()}`;
    // Create the Payment record
    const payment = yield prisma_1.default.payment.create({
        data: Object.assign(Object.assign({}, payloadData), { transactionId, userId: userData.id }),
    });
    // Create PaymentProduct records for each product
    const paymentProducts = products.map((product) => ({
        paymentId: payment.id,
        productId: product.id,
        quantity: product.addedProductQuantity,
        price: product.flashSalePrice ? product.flashSalePrice : product.price,
    }));
    yield prisma_1.default.paymentProduct.createMany({ data: paymentProducts });
    const paymentData = {
        transactionId,
        userId: payment.userId,
        paymentId: payment.id,
        totalAmount: payment === null || payment === void 0 ? void 0 : payment.totalPrice,
        customerName: payment === null || payment === void 0 ? void 0 : payment.customerName,
        customerEmail: payment === null || payment === void 0 ? void 0 : payment.customerEmail,
        customerPhone: payment === null || payment === void 0 ? void 0 : payment.customerPhone,
        customerAddress: payment === null || payment === void 0 ? void 0 : payment.customerAddress,
    };
    const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData);
    return paymentSession;
});
const getAllPayments = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const result = yield prisma_1.default.payment.findMany({
        skip,
        take: limit,
        include: {
            user: true,
            products: true,
        },
    });
    const total = yield prisma_1.default.payment.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getUserPayments = (user, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const result = yield prisma_1.default.payment.findMany({
        where: {
            userId: userData.id,
        },
        skip,
        take: limit,
        orderBy: {
            paymentDate: "desc",
        },
        include: {
            user: true,
            products: {
                include: {
                    product: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.payment.count({
        where: {
            userId: userData.id,
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
const getShopPayments = (user, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
        include: {
            shop: true,
        },
    });
    if (!userData.shop) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You don't have a shop.");
    }
    const result = yield prisma_1.default.payment.findMany({
        where: {
            products: {
                some: {
                    product: {
                        shopId: userData.shop.id,
                    },
                },
            },
        },
        skip,
        take: limit,
        orderBy: {
            paymentDate: "desc",
        },
        include: {
            user: true,
            products: {
                include: {
                    product: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.payment.count({
        where: {
            products: {
                some: {
                    product: {
                        shopId: userData.shop.id,
                    },
                },
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
exports.PaymentCollectionService = {
    createPayment,
    getAllPayments,
    getUserPayments,
    getShopPayments,
};
