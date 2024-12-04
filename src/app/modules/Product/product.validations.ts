import { z } from "zod";

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    price: z.number(),
    inventoryCount: z.number(),
    description: z.string(),
    categories: z.array(z.string()),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    price: z.number(),
    inventoryCount: z.number(),
    description: z.string(),
    categories: z.array(z.string()),
  }),
});

export const ProductValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
