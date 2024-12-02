import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validations";
import { multerUpload } from "../../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = Router();

router.post(
  "/sign-up",
  multerUpload.single("image"),
  parseBody,
  validateRequest(AuthValidations.signUpValidationSchema),
  AuthController.signUp
);
router.post(
  "/login",
  validateRequest(AuthValidations.loginValidationSchema),
  AuthController.login
);

export const AuthRoutes = router;
