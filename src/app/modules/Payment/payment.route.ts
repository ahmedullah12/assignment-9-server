import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();

// Route
router.post("/confirmation", PaymentController.confirmationController)


export const PaymentRoutes = router;
