import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { initiatePayment } from "../Payment/payment.utils";
import { IPaymentPayload } from "./payment-collection.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";

const createPayment = async (payload: IPaymentPayload, user: JwtPayload) => {
  const { products, ...payloadData } = payload;
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

const getAllPayments = async (options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.payment.findMany({
    skip,
    take: limit,
    include: {
      user: true,
      products: true,
    },
  });

  const total = await prisma.payment.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getUserPayments = async (
  user: JwtPayload,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const result = await prisma.payment.findMany({
    where: {
      userId: userData.id,
    },
    skip,
    take: limit,
    orderBy: {
      paymentDate: "desc",
    },
    include: {
      user: true,
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  const total = await prisma.payment.count({
    where: {
      userId: userData.id,
    },
  })

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getShopPayments = async (
  user: JwtPayload,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    include: {
      shop: true,
    },
  });

  if (!userData.shop) {
    throw new AppError(httpStatus.BAD_REQUEST, "You don't have a shop.");
  }

  const result = await prisma.payment.findMany({
    where: {
      products: {
        some: {
          product: {
            shopId: userData.shop.id,
          },
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      paymentDate: "desc",
    },
    include: {
      user: true,
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  const total = await prisma.payment.count({
    where: {
      products: {
        some: {
          product: {
            shopId: userData.shop.id,
          },
        },
      },
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const PaymentCollectionService = {
  createPayment,
  getAllPayments,
  getUserPayments,
  getShopPayments,
};
