import { Router } from 'express';
import { PaymentCollectionController } from './payment-collection.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/create-payment',auth(UserRole.CUSTOMER), PaymentCollectionController.createPayment);
router.get('/', auth('ADMIN'), PaymentCollectionController.getPayments);

export const PaymentCollectionRoutes = router;
