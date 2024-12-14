"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCollectionRoutes = void 0;
const express_1 = require("express");
const payment_collection_controller_1 = require("./payment-collection.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/create-payment', (0, auth_1.default)(client_1.UserRole.CUSTOMER), payment_collection_controller_1.PaymentCollectionController.createPayment);
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN), payment_collection_controller_1.PaymentCollectionController.getAllPayments);
router.get('/my-payments', (0, auth_1.default)(client_1.UserRole.CUSTOMER), payment_collection_controller_1.PaymentCollectionController.getUserPayments);
router.get('/shop-payments', (0, auth_1.default)(client_1.UserRole.VENDOR), payment_collection_controller_1.PaymentCollectionController.getShopPayments);
exports.PaymentCollectionRoutes = router;
