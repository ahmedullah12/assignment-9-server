import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/sign-up", AuthController.signUp);


export const AuthRoutes = router;