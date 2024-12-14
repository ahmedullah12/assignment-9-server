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
exports.CategoryServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryNameExists = yield prisma_1.default.category.findUnique({
        where: {
            name: payload.name
        }
    });
    if (isCategoryNameExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Category already exists!!");
    }
    const result = yield prisma_1.default.category.create({
        data: payload
    });
    return result;
});
const getAllCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany();
    return result;
});
const getSingleCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findUniqueOrThrow({
        where: {
            id: categoryId
        }
    });
    return result;
});
const updateCategory = (categoryId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryNameExists = yield prisma_1.default.category.findUnique({
        where: {
            name: payload.name
        }
    });
    if (isCategoryNameExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Category already exists!!");
    }
    const result = yield prisma_1.default.category.update({
        where: {
            id: categoryId
        },
        data: payload
    });
    return result;
});
const deleteCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.delete({
        where: {
            id: categoryId,
        }
    });
    return result;
});
exports.CategoryServices = {
    createCategory,
    getAllCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
