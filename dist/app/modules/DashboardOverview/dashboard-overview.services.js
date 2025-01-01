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
exports.DashboardOverviewServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllOverviewData = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const totalUsers = yield transactionClient.user.count();
        const totalShops = yield transactionClient.shop.count();
        const totalProducts = yield transactionClient.product.count();
        const totalOrders = yield transactionClient.payment.count();
        // Get monthly sales data for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlySales = yield transactionClient.paymentProduct.groupBy({
            by: ["paymentId"],
            where: {
                payment: {
                    paymentDate: {
                        gte: sixMonthsAgo,
                    },
                    status: "COMPLETED",
                },
            },
            _sum: {
                quantity: true,
            },
            orderBy: {
                paymentId: "asc",
            },
        });
        // Transform the data into monthly totals
        const salesByMonth = yield transactionClient.payment.findMany({
            where: {
                paymentDate: {
                    gte: sixMonthsAgo,
                },
                status: "COMPLETED",
            },
            select: {
                paymentDate: true,
                id: true,
            },
        });
        const monthlyData = {};
        salesByMonth.forEach((payment) => {
            var _a;
            const month = payment.paymentDate.toLocaleString("default", {
                month: "short",
            });
            const quantity = ((_a = monthlySales.find((sale) => sale.paymentId === payment.id)) === null || _a === void 0 ? void 0 : _a._sum.quantity) || 0;
            if (!monthlyData[month]) {
                monthlyData[month] = 0;
            }
            monthlyData[month] += quantity;
        });
        const salesData = Object.entries(monthlyData).map(([month, total]) => ({
            month,
            sales: total,
        }));
        const recentProducts = yield transactionClient.product.findMany({
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
        });
        console.log(salesData);
        return {
            totalUsers,
            totalShops,
            totalProducts,
            totalOrders,
            recentProducts,
            salesData,
        };
    }));
    return result;
});
const getVendorOverviewData = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const shop = yield transactionClient.shop.findUnique({
            where: { vendorId },
        });
        if (!shop)
            throw new Error("Shop not found");
        const totalProducts = yield transactionClient.product.count({
            where: { shopId: shop.id },
        });
        const totalOrders = yield transactionClient.paymentProduct.count({
            where: {
                product: { shopId: shop.id },
                payment: { status: "COMPLETED" },
            },
        });
        const totalReviews = yield transactionClient.review.count({
            where: {
                product: { shopId: shop.id },
            },
        });
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlySales = yield transactionClient.paymentProduct.groupBy({
            by: ["paymentId"],
            where: {
                product: { shopId: shop.id },
                payment: {
                    paymentDate: { gte: sixMonthsAgo },
                    status: "COMPLETED",
                },
            },
            _sum: { quantity: true },
            orderBy: { paymentId: "asc" },
        });
        const salesByMonth = yield transactionClient.payment.findMany({
            where: {
                paymentDate: { gte: sixMonthsAgo },
                status: "COMPLETED",
                products: { some: { product: { shopId: shop.id } } },
            },
            select: { paymentDate: true, id: true },
        });
        const monthlyData = {};
        salesByMonth.forEach((payment) => {
            var _a;
            const month = payment.paymentDate.toLocaleString("default", {
                month: "short",
            });
            const quantity = ((_a = monthlySales.find((sale) => sale.paymentId === payment.id)) === null || _a === void 0 ? void 0 : _a._sum.quantity) || 0;
            monthlyData[month] = (monthlyData[month] || 0) + quantity;
        });
        const salesData = Object.entries(monthlyData).map(([month, sales]) => ({
            month,
            sales,
        }));
        const recentProducts = yield transactionClient.product.findMany({
            where: { shopId: shop.id },
            take: 5,
            orderBy: { createdAt: "desc" },
        });
        return {
            totalProducts,
            totalOrders,
            totalReviews,
            recentProducts,
            salesData,
        };
    }));
    return result;
});
exports.DashboardOverviewServices = {
    getAllOverviewData,
    getVendorOverviewData,
};
