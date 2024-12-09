import { Request, Response } from 'express';
import { PaymentServices } from './payment.service';

const confirmationController = async (req: Request, res: Response) => {
  const { transactionId, paymentId } = req.query;

  const result = await PaymentServices.confirmationService(
    transactionId as string,
    paymentId as string,
  );
  res.send(result);
};

export const PaymentController = {
  confirmationController,
};
