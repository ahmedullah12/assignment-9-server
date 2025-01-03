import { ShopStatus, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IFile } from "../../interfaces/file";

const getAllUsers = async (options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      contactNumber: true,
      address: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      shop: true,
      followShop: true,
      reviews: true,
    },
    skip,
    take: limit,
  });

  const total = await prisma.user.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getUserWithEmail = async (email: string) => {
  const result = await prisma.user.findUnique({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      contactNumber: true,
      address: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      shop: {
        include: {
          products: true,
        },
      },
      followShop: true,
      reviews: true,
    },
  });

  if (!result) {
    return null;
  }

  return result;
};

const getUserWithId = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      contactNumber: true,
      address: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      shop: true,
      followShop: true,
      reviews: true,
    },
  });

  return result;
};

const updateUser = async (
  id: string,
  payload: IUserPayload,
  file: IFile | undefined
) => {
  if (file) {
    payload.profileImage = file.path;
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      contactNumber: true,
      address: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      shop: true,
      followShop: true,
      reviews: true,
    },
  });

  return result;
};

const deleteUser = async (id: string) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: UserStatus.DELETED,
    },
  });

  return result;
};

const suspendUser = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: { status: true },
  });

  const newStatus =
    user.status === UserStatus.SUSPENDED
      ? UserStatus.ACTIVE
      : UserStatus.SUSPENDED;

  const result = await prisma.user.update({
    where: { id },
    data: { status: newStatus },
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
      contactNumber: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    message:
      result.status === UserStatus.SUSPENDED
        ? "User has been suspended!!"
        : "User account has been reactivated!!",
    user: result,
  };
};

const followShop = async (user: JwtPayload, shopId: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  // check if the shop exists
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
  });

  if (!shop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found");
  }

  // Check if the user already follows the shop
  const existingFollow = await prisma.followShop.findUnique({
    where: {
      userId_shopId: { userId: userData.id, shopId }, // Composite primary key
    },
  });

  if (existingFollow) {
    // Unfollow the shop
    await prisma.followShop.delete({
      where: {
        userId_shopId: { userId: userData.id, shopId },
      },
    });
    return { message: "Shop unfollowed successfully", followed: false };
  } else {
    // Follow the shop
    await prisma.followShop.create({
      data: { userId: userData.id, shopId },
    });
    return { message: "Shop followed successfully", followed: true };
  }
};

const userSubscribe = async (payload: { email: string }) => {
  const alreadyUser = await prisma.subscribedUser.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (alreadyUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Already subscribed previously!!"
    );
  }

  const result = await prisma.subscribedUser.create({
    data: payload,
  });

  return result;
};

const getAllSubscribeUsers = async (options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.subscribedUser.findMany({
    skip,
    take: limit,
  });

  const total = await prisma.subscribedUser.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};


export const UserServices = {
  getAllUsers,
  getUserWithEmail,
  getUserWithId,
  updateUser,
  deleteUser,
  suspendUser,
  followShop,
  userSubscribe,
  getAllSubscribeUsers
};
