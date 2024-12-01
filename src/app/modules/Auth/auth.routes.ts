import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validations";

const router = Router();

router.post(
  "/sign-up",
  validateRequest(AuthValidations.signUpValidationSchema),
  AuthController.signUp
);
router.post(
  "/login",
  validateRequest(AuthValidations.loginValidationSchema),
  AuthController.login
);

export const AuthRoutes = router;
