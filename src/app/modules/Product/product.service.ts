import { Request } from "express";
import prisma from "../../../shared/prisma";
import { Prisma, ShopStatus, UserRole, UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { IFile } from "../../interfaces/file";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import { productSearchAbleFields } from "./product.constant";

const createProduct = async (req: Request) => {
  const files = req.files as IFile[];
  const {
    name,
    price,
    inventoryCount,
    description,
    categories,
    isFlashSale,
    discount,
  } = req.body as IProductPayload;
  const user = req.user;

  //check if the user exists and is vendor or not
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
      role: UserRole.VENDOR,
    },
    include: {
      shop: true,
    },
  });

  //check if user has a shop or not
  if (!userData.shop) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please create a shop first!!");
  }

  //check if shop is blacklisted or deleted
  if (
    userData.shop.status === ShopStatus.DELETED ||
    userData.shop.status === ShopStatus.BLACKLISTED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You shop is deleted or blacklisted!!"
    );
  }

  const images = files?.map((file: IFile) => file.path);

  //check if at least one image is there
  if (!images || images.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "At least one product image is required."
    );
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

const getAllProduct = async (
  params: Record<string, unknown>,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, price, category, ...filterData } = params;

  console.log(price);

  const andConditions: Prisma.ProductWhereInput[] = [];

  // Filter for search
  if (searchTerm) {
    andConditions.push({
      OR: productSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  

  // filter for price
  if (price) {
    const [min, max] = (price as string).split("-");

    const minPrice = min ? Number(min) : undefined;
    const maxPrice = max ? Number(max) : undefined;

    const priceCondition: Prisma.ProductWhereInput["price"] = {};

    if (minPrice !== undefined && !isNaN(minPrice)) {
      priceCondition.gte = minPrice;
    }

    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      priceCondition.lte = maxPrice;
    }

    if (Object.keys(priceCondition).length > 0) {
      andConditions.push({ price: priceCondition });
    }
  }

  // Filter by categoryId (supporting multiple categories)
  if (category) {
    const categoryIds = (category as string).split(",").map((id) => id.trim());
    if (categoryIds.length > 0) {
      andConditions.push({
        productCategory: {
          some: {
            categoryId: {
              in: categoryIds,
            },
          },
        },
      });
    }
  }

  // Adding other filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    include: {
      shop: true,
      productCategory: {
        include: {
          category: true,
        },
      },
    },
  });

  const total = await prisma.product.count({
    where: { ...whereConditions, shop: { status: ShopStatus.ACTIVE } },
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

const getVendorsProducts = async (
  shopId: string,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.product.findMany({
    where: {
      shopId,
      shop: {
        status: ShopStatus.ACTIVE,
      },
    },
    skip,
    take: limit,
  });

  const total = await prisma.product.count({
    where: {
      shopId,
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

const getFlashSaleProducts = async (options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const result = await prisma.product.findMany({
    where: {
      isFlashSale: true,
      shop: {
        status: ShopStatus.ACTIVE,
      },
    },
    skip,
    take: limit,
  });

  const total = await prisma.product.count({
    where: {
      isFlashSale: true,
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

const getSingleProduct = async (id: string) => {
  const result = await prisma.product.findUniqueOrThrow({
    where: {
      id,
      shop: {
        status: ShopStatus.ACTIVE,
      },
    },
    include: {
      shop: true,
      productCategory: {
        include: {
          category: true,
        },
      },
      reviews: {
        include: {
          user: true,
        },
      },
    },
  });

  return result;
};

const duplicateProduct = async (id: string) => {
  // get the original product
  const originalProduct = await prisma.product.findUniqueOrThrow({
    where: { id },
    include: {
      productCategory: true,
      shop: true,
    },
  });

  const {
    name,
    description,
    inventoryCount,
    price,
    images,
    discount,
    flashSalePrice,
    isFlashSale,
    shopId,
    shop,
  } = originalProduct;

  //check if shop is blacklisted or deleted
  if (
    shop.status === ShopStatus.DELETED ||
    shop.status === ShopStatus.BLACKLISTED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You shop is deleted or blacklisted!!"
    );
  }

  const newProductData = {
    name,
    description,
    inventoryCount,
    price,
    images,
    discount,
    flashSalePrice,
    isFlashSale,
    shopId,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const newProduct = await transactionClient.product.create({
      data: newProductData,
    });

    // Duplicate categories
    const newCategories = originalProduct.productCategory.map((category) => ({
      productId: newProduct.id,
      categoryId: category.categoryId,
    }));

    await transactionClient.productCategory.createMany({
      data: newCategories,
    });

    return newProduct;
  });

  return result;
};

const updateProduct = async (id: string, payload: IProductUpdate) => {
  const { categories, ...payloadData } = payload;
  const productData = await prisma.product.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      productCategory: true,
    },
  });

  if (
    productData.isFlashSale &&
    productData.discount &&
    productData.price !== payload.price
  ) {
    payloadData.flashSalePrice =
      payload.price - payload.price * (productData.discount / 100);
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    await Promise.all(
      productData.productCategory.map((category) =>
        transactionClient.productCategory.deleteMany({
          where: {
            productId: category.productId,
            categoryId: category.categoryId,
          },
        })
      )
    );

    const categoriesData = categories.map((category: string) => ({
      productId: productData.id,
      categoryId: category,
    }));

    //creating productCategory
    await transactionClient.productCategory.createMany({
      data: categoriesData,
    });

    const result = await prisma.product.update({
      where: {
        id,
      },
      data: payloadData,
    });

    return result;
  });

  return result;
};

const deleteProduct = async (id: string) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.productCategory.deleteMany({
      where: {
        productId: id,
      },
    });
    await transactionClient.review.deleteMany({
      where: {
        productId: id,
      },
    });
    await transactionClient.paymentProduct.deleteMany({
      where: {
        productId: id,
      },
    });
    const result = await transactionClient.product.delete({
      where: {
        id,
      },
    });

    return result;
  });

  return result;
};

export const ProductServices = {
  createProduct,
  getAllProduct,
  getVendorsProducts,
  getFlashSaleProducts,
  getSingleProduct,
  duplicateProduct,
  updateProduct,
  deleteProduct,
};
