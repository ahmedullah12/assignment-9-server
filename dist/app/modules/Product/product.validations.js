"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidations = void 0;
const zod_1 = require("zod");
const createProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        price: zod_1.z.number(),
        inventoryCount: zod_1.z.number(),
        description: zod_1.z.string(),
        categories: zod_1.z.array(zod_1.z.string()),
    }),
});
const updateProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        price: zod_1.z.number(),
        inventoryCount: zod_1.z.number(),
        description: zod_1.z.string(),
        categories: zod_1.z.array(zod_1.z.string()),
    }),
});
exports.ProductValidations = {
    createProductValidationSchema,
    updateProductValidationSchema,
};
