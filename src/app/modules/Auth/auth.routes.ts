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
router.post('/refresh-token', AuthController.refreshToken);
router.put(
  '/change-password/:userId',
  validateRequest(AuthValidations.changePasswordValidationSchema),
  AuthController.changePassword,
);
router.post(
  '/forget-password',
  validateRequest(AuthValidations.forgetPasswordValidationSchema),
  AuthController.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequest(AuthValidations.forgetPasswordValidationSchema),
  AuthController.resetPassword,
);

export const AuthRoutes = router;
