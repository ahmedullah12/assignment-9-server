import { z } from "zod";

const createShopValidationSchema = z.object({
    body: z.object({
      name: z.string({
        required_error: "Name is required!",
      }),
      description: z.string({
        required_error: "Description is required!",
      }),
    }),
  });

export const ShopValidations = {
    createShopValidationSchema
}