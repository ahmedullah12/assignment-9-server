import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";

const createCategory = async (payload: { name: string }) => {
  const isCategoryNameExists = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (isCategoryNameExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category already exists!!");
  }

  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getAllCategory = async (options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.category.findMany({
    skip,
    take: limit,
  });

  const total = await prisma.category.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCategory = async (categoryId: string) => {
  const result = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  return result;
};

const updateCategory = async (
  categoryId: string,
  payload: { name: string }
) => {
  const isCategoryNameExists = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (isCategoryNameExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category already exists!!");
  }

  const result = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: payload,
  });

  return result;
};

const deleteCategory = async (categoryId: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.productCategory.deleteMany({
      where: {
        categoryId,
      },
    });

    const result = await transactionClient.category.delete({
      where: {
        id: categoryId,
      },
    });

    return result;
  });

  return result;
};

export const CategoryServices = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
