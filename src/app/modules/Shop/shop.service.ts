import { Shop, ShopStatus, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { IFile } from "../../interfaces/file";
import { ICreateShop, IUpdateShop } from "./shop.interface";

const createShop = async (
  user: JwtPayload,
  payload: ICreateShop,
  file: IFile | undefined
) => {
  //checking if user is a vendor
  if (user.role !== UserRole.VENDOR) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "User needs to be a vendor to create shop."
    );
  }

  //making logo upload compulsory
  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please upload a logo!!");
  }

  //getting vendor data
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  //check if duplicate shop name
  const isShopNameExists = await prisma.shop.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (isShopNameExists) {
    throw new Error("Shop name already exists!!");
  }

  const result = await prisma.shop.create({
    data: { ...payload, vendorId: userData.id, logoUrl: file.path },
  });

  return result;
};

const getAllShop = async () => {
  const result = await prisma.shop.findMany();

  return result;
};

const getSingleShopWithId = async (vendorId: string) => {
  const result = await prisma.shop.findUnique({
    where: {
      vendorId,
      status: ShopStatus.ACTIVE,
    },
  });

  return result;
};

const getVendorShop = async(user: JwtPayload) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email
    }
  });

  const result = await prisma.shop.findUniqueOrThrow({
    where: {
      vendorId: userData.id
    },
    include: {
      vendor: true,
      products: true
    }
  });

  return result;
}

const updateShop = async (
  user: JwtPayload,
  payload: IUpdateShop,
  file: IFile | undefined
) => {
  // Get vendor data
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    include: {
      shop: true,
    },
  });

  // Check if shop exists for the vendor
  const existingShop = userData.shop;
  if (!existingShop) {
    throw new AppError(httpStatus.NOT_FOUND, "Shop not found for the vendor.");
  }

  // Check if duplicate shop name only if name is being updated and is different
  if (payload.name && payload.name !== existingShop.name) {
    const isShopNameExists = await prisma.shop.findUnique({
      where: {
        name: payload.name,
      },
    });

    if (isShopNameExists) {
      throw new AppError(httpStatus.CONFLICT, "Shop name already exists!");
    }
  }

  // Update logo if provided
  if (file) {
    payload.logoUrl = file.path;
  }

  // Perform the update
  const result = await prisma.shop.update({
    where: {
      vendorId: userData.id,
    },
    data: payload,
  });

  return result;
};


const deleteShop = async (shopId: string) => {
  const result = await prisma.shop.update({
    where: {
      id: shopId,
    },
    data: {
      status: UserStatus.DELETED,
    },
  });

  return result;
};

export const ShopServices = {
  createShop,
  getAllShop,
  getSingleShopWithId,
  getVendorShop,
  updateShop,
  deleteShop,
};
