import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { initiatePayment } from "../Payment/payment.utils";
import { IPaymentPayload } from "./payment-collection.interface";

const createPayment = async (payload: IPaymentPayload, user: JwtPayload) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });

  console.log(payload);

  const transactionId = `TXN-SS-${Date.now()}`;

  const payment = await prisma.payment.create({
    data: { ...payload, transactionId, userId: userData?.id },
  });

  const paymentData = {
    transactionId,
    userId: payment.userId,
    paymentId: payment.id,
    totalAmount: payment?.totalPrice,
    customerName: payment?.customerName,
    customerEmail: payment?.customerEmail,
    customerPhone: payment?.customerPhone,
    customerAddress: payment?.customerAddress,
  };

  const paymentSession = await initiatePayment(paymentData);

  return paymentSession;
};

const getPayments = async () => {};

export const PaymentCollectionService = {
  createPayment,
  getPayments,
};
