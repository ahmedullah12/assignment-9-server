import { Request } from "express";
import prisma from "../../../shared/prisma";
import { UserRole, UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { IFile } from "../../interfaces/file";

const createProduct = async (req: Request) => {
  const files = req.files as IFile[];
  const { name, price, inventoryCount, description, categories } =
    req.body as IProductPayload;
  const user = req.user;

  //check if the user exists and is vendor or not
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
      role: UserRole.VENDOR
    },
    include: {
      shop: true,
    },
  });

  //check if user has a shop or not
  if (!userData.shop) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please create a shop first!!");
  }

  const images = files?.map((file: IFile) => file.path);

  //check if at least one image is there
  if (!images || images.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "At least one product image is required.");
  }

  const payloadData = {
    name,
    price,
    inventoryCount,
    description,
    images,
    shopId: userData.shop.id,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    //creating product
    const productData = await transactionClient.product.create({
      data: payloadData,
    });

    const categoriesData = categories.map((category: string) => ({
      productId: productData.id,
      categoryId: category,
    }));

    //creating productCategory
    await transactionClient.productCategory.createMany({
      data: categoriesData,
    });

    return productData;
  });

  return result;
};

const getAllProduct = async () => {
  const result = await prisma.product.findMany({
    include: {
        shop: true,
        productCategory: true
    }
  });

  return result;
};

const getSingleProduct = async (id: string) => {
  const result = await prisma.product.findUniqueOrThrow({
    where: {
        id
    }
  });

  return result;
};

const updateProduct = async (id: string, payload: Partial<IProductPayload>) => {
  const result = await prisma.product.update({
    where: {
        id,
    },
    data: payload
  });

  return result;
};

const deleteProduct = async (id: string) => {
  const result = await prisma.product.delete({
    where: {
        id,
    }
  });

  return result;
};

export const ProductServices = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
