"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/Auth/auth.routes");
const shop_routes_1 = require("../modules/Shop/shop.routes");
const category_routes_1 = require("../modules/Category/category.routes");
const product_routes_1 = require("../modules/Product/product.routes");
const user_routes_1 = require("../modules/User/user.routes");
const payment_route_1 = require("../modules/Payment/payment.route");
const payment_collection_route_1 = require("../modules/PaymentsCollection/payment-collection.route");
const review_route_1 = require("../modules/Review/review.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/shop",
        route: shop_routes_1.ShopRoutes,
    },
    {
        path: "/category",
        route: category_routes_1.CategoryRoutes,
    },
    {
        path: "/products",
        route: product_routes_1.ProductRoutes,
    },
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: "/payment-collection",
        route: payment_collection_route_1.PaymentCollectionRoutes,
    },
    {
        path: "/review",
        route: review_route_1.ReviewRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
