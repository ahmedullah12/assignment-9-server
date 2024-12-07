import { Request } from "express";
import prisma from "../../../shared/prisma";
import { Prisma, UserRole, UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { IFile } from "../../interfaces/file";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import { productSearchAbleFields } from "./product.constant";

const createProduct = async (req: Request) => {
  const files = req.files as IFile[];
  const { name, price, inventoryCount, description, categories, isFlashSale, discount } =
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

  let flashSalePrice = null;
  if (isFlashSale && discount) {
    flashSalePrice = price - price * (discount / 100);
  }

  const payloadData = {
    name,
    price,
    inventoryCount,
    description,
    images,
    shopId: userData.shop.id,
    isFlashSale: !!isFlashSale,
    discount: isFlashSale ? discount : null,
    flashSalePrice,
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

const getAllProduct = async (params: Record<string, unknown>, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm,price, ...filterData } = params;

  const andConditions: Prisma.ProductWhereInput[] = [];

  //filter for search
  if (params.searchTerm) {
    andConditions.push({
          OR: productSearchAbleFields.map(field => ({
              [field]: {
                  contains: params.searchTerm,
                  mode: 'insensitive'
              }
          }))
      })
  };

  // filter for price range
  if (price) {
    const [minPrice, maxPrice] = (price as string).split('-').map(Number);
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      andConditions.push({
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
      });
    }
  }

  // adding other filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
          AND: Object.keys(filterData).map(key => ({
              [key]: {
                  equals: (filterData as any)[key]
              }
          }))
      })
  };

  const whereConditions: Prisma.ProductWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: options.sortBy && options.sortOrder ? {
        [options.sortBy]: options.sortOrder
    } : {
        createdAt: 'desc'
    },
    select: {
      shop: true,
      productCategory: true
    }
});

const total = await prisma.product.count({
    where: whereConditions
});

return {
    meta: {
        page,
        limit,
        total
    },
    data: result
};

  return result;
};

const getFlashSaleProducts = async() => {
  const result = await prisma.product.findMany({
    where: {
      isFlashSale: true
    }
  });

  return result;
}

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
  getFlashSaleProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
