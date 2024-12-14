"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopValidations = void 0;
const zod_1 = require("zod");
const createShopValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required!",
        }),
        description: zod_1.z.string({
            required_error: "Description is required!",
        }),
    }),
});
exports.ShopValidations = {
    createShopValidationSchema
};
