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
exports.ShopController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const shop_service_1 = require("./shop.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const createShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shop_service_1.ShopServices.createShop(req.user, req.body, req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Shop created successfully!!",
        data: result,
    });
}));
const getAllShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.default)(req.query, ["limit", "page"]);
    const result = yield shop_service_1.ShopServices.getAllShop(options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Shops fetched successfully!!",
        data: result,
    });
}));
const getAllActiveShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const options = (0, pick_1.default)(req.query, ["limit", "page"]);
    const result = yield shop_service_1.ShopServices.getAllActiveShop(options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Shops fetched successfully!!",
        data: result,
    });
}));
const getSingleShopWithId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId } = req.params;
    const result = yield shop_service_1.ShopServices.getSingleShopWithId(shopId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Shop fetched successfully!!",
        data: result,
    });
}));
const getVendorShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield shop_service_1.ShopServices.getVendorShop(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Shop fetched successfully!!",
        data: result,
    });
}));
const updateShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shop_service_1.ShopServices.updateShop(req.user, req.body, req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Shop updated successfully!!",
        data: result,
    });
}));
const deleteShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId } = req.params;
    const result = yield shop_service_1.ShopServices.deleteShop(shopId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Shop deleted successfully!!",
        data: result,
    });
}));
const blacklistShop = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId } = req.params;
    const result = yield shop_service_1.ShopServices.blacklistShop(shopId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Shop blacklisted successfully!!",
        data: result,
    });
}));
exports.ShopController = {
    createShop,
    getAllShop,
    getAllActiveShop,
    getSingleShopWithId,
    getVendorShop,
    updateShop,
    deleteShop,
    blacklistShop,
};
