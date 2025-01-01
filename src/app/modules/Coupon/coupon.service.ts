import httpStatus from "http-status";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { IPaginationOptions } from "../../interfaces/pagination";
import { CouponPayload } from "./coupon.interface";

const createCoupon = async (payload: CouponPayload) => {
  const result = await prisma.coupon.create({
    data: payload,
  });

  return result;
};

const getAllCoupons = async (options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.coupon.findMany({
    skip,
    take: limit,
  });

  const total = await prisma.coupon.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteCoupon = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.userCoupon.deleteMany({
      where: {
        couponId: id,
      },
    });

    const result = await transactionClient.coupon.delete({
      where: {
        id,
      },
    });

    return result;
  });

  return result;
};


const validateCoupon = async (payload: {code: string}) => {
  const coupon = await prisma.coupon.findUnique({
    where: { couponNumber: payload.code },
  });

  if (!coupon || coupon.expiryDate < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired coupon");
  }

  return coupon;
};

export const CouponServices = {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  validateCoupon,
};
