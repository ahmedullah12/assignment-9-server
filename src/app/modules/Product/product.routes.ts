import { Router } from "express";
import { ProductController } from "./product.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { ProductValidations } from "./product.validations";
import { parseBody } from "../../middlewares/bodyParser";
import { multerUpload } from "../../../config/multer.config";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/create-product",
  auth(UserRole.VENDOR),
  multerUpload.array("images", 3),
  parseBody,
  validateRequest(ProductValidations.createProductValidationSchema),
  ProductController.createProduct
);
router.get("/", ProductController.getAllProduct);
router.get("/:id", ProductController.getSingleProduct);
router.put(
  "/:id",
  auth(UserRole.VENDOR),
  validateRequest(ProductValidations.updateProductValidationSchema),
  ProductController.updateProduct
);
router.delete("/:id", ProductController.deleteProduct);

export const ProductRoutes = router;
