import { z } from "zod";

const updateUserValidationsSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        contactNumber: z.string().optional(),
        address: z.string().optional(),
    })
});

export const UserValidations = {
    updateUserValidationsSchema
}