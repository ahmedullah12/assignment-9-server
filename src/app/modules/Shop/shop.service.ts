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

const getSingleShop = async (vendorId: string) => {
  const result = await prisma.shop.findUniqueOrThrow({
    where: {
      vendorId,
      status: ShopStatus.ACTIVE,
    },
  });

  return result;
};

const updateShop = async (
  user: JwtPayload,
  payload: IUpdateShop,
  file: IFile | undefined
) => {
    //getting vendor data
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  //check if duplicate shop name
  if(payload.name){
    const isShopNameExists = await prisma.shop.findUnique({
        where: {
          name: payload.name,
        },
      });
    
      if (isShopNameExists) {
        throw new Error("Shop name already exists!!");
      }
  }

  //check if update logo
  if (file) {
    payload.logoUrl = file.path;
  }

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
  getSingleShop,
  updateShop,
  deleteShop,
};
