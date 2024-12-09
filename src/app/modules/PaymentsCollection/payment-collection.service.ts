import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { initiatePayment } from "../Payment/payment.utils";
import { IPaymentPayload } from "./payment-collection.interface";

const createPayment = async (payload: IPaymentPayload, user: JwtPayload) => {
  const {products, ...payloadData} = payload;
  const userData = await prisma.user.findUniqueOrThrow({
    where: { email: user.email },
  });

  const transactionId = `TXN-SS-${Date.now()}`;

  // Create the Payment record
  const payment = await prisma.payment.create({
    data: {
      ...payloadData,
      transactionId,
      userId: userData.id,
    },
  });

  // Create PaymentProduct records for each product
  const paymentProducts = products.map((product: any) => ({
    paymentId: payment.id,
    productId: product.id,
    quantity: product.addedProductQuantity,
    price: product.flashSalePrice ? product.flashSalePrice : product.price,
  }));

  await prisma.paymentProduct.createMany({ data: paymentProducts });

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
