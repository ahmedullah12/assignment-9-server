import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createReview = async (
  payload: { comment: string; rating: number; productId: string },
  user: JwtPayload
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: { email: user.email },
  });

  const existingReview = await prisma.review.findFirst({
    where: {
      productId: payload.productId,
      userId: userData.id,
    },
  });

  if (existingReview) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already reviewed this product."
    );
  }

  const result = await prisma.review.create({
    data: {
      ...payload,
      userId: userData.id,
    },
  });

  return result;
};

const getProductReviews = async (productId: string) => {
  const result = await prisma.review.findMany({
    where: {
      productId,
    },
    include: {
      user: true,
      product: true,
    }
  });

  return result;
};

const getUserReviews = async (user: JwtPayload) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const result = await prisma.review.findMany({
    where: {
      userId: userData.id,
    },
    include: {
      user: true,
      product: true
    }
  });

  return result;
};

const updateReview = async (
  reviewId: string,
  payload: { comment?: string; rating?: number }
) => {
  const result = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: payload,
  });

  return result;
};

const deleteReview = async (id: string) => {
  const result = await prisma.review.delete({
    where: {
      id,
    },
  });
};

export const ReviewServices = {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
};
