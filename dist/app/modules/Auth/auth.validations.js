"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const signUpValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required!",
        }),
        email: zod_1.z.string({
            required_error: "Email is required!",
        }),
        password: zod_1.z.string({
            required_error: "Password is required!",
        }),
        contactNumber: zod_1.z.string({
            required_error: "Contact Number is required!",
        }),
        role: zod_1.z.enum([client_1.UserRole.CUSTOMER, client_1.UserRole.VENDOR]),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: "Email is required!",
        }),
        password: zod_1.z.string({
            required_error: "Password is required!",
        }),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: 'Old password is required',
        }),
        newPassword: zod_1.z.string({ required_error: 'New password is required' }),
    }),
});
const forgetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'User email is required!',
        }),
    }),
});
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({
            required_error: 'User id is required!',
        }),
        password: zod_1.z.string({
            required_error: 'User password is required!',
        }),
    }),
});
exports.AuthValidations = {
    signUpValidationSchema,
    loginValidationSchema,
    changePasswordValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
};
