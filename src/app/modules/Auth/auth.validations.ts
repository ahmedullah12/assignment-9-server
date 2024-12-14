import { UserRole } from "@prisma/client";
import { z } from "zod";

const signUpValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z.string({
      required_error: "Email is required!",
    }),
    password: z.string({
      required_error: "Password is required!",
    }),
    contactNumber: z.string({
      required_error: "Contact Number is required!",
    }),
    role: z.enum([UserRole.CUSTOMER, UserRole.VENDOR]),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required!",
    }),
    password: z.string({
      required_error: "Password is required!",
    }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'New password is required' }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'User email is required!',
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'User id is required!',
    }),
    password: z.string({
      required_error: 'User password is required!',
    }),
  }),
});

export const AuthValidations = {
  signUpValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
