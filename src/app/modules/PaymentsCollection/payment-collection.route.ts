import { Router } from 'express';
import { PaymentCollectionController } from './payment-collection.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/create-payment',auth(UserRole.CUSTOMER), PaymentCollectionController.createPayment);
router.get('/', auth(UserRole.ADMIN), PaymentCollectionController.getAllPayments);
router.get('/my-payments', auth(UserRole.CUSTOMER), PaymentCollectionController.getUserPayments);
router.get('/shop-payments', auth(UserRole.VENDOR), PaymentCollectionController.getShopPayments);

export const PaymentCollectionRoutes = router;
