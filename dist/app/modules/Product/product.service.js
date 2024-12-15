"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const product_constant_1 = require("./product.constant");
const createProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const { name, price, inventoryCount, description, categories, isFlashSale, discount, } = req.body;
    const user = req.user;
    //check if the user exists and is vendor or not
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE,
            role: client_1.UserRole.VENDOR,
        },
        include: {
            shop: true,
        },
    });
    //check if user has a shop or not
    if (!userData.shop) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Please create a shop first!!");
    }
    //check if shop is blacklisted or deleted
    if (userData.shop.status === client_1.ShopStatus.DELETED ||
        userData.shop.status === client_1.ShopStatus.BLACKLISTED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You shop is deleted or blacklisted!!");
    }
    const images = files === null || files === void 0 ? void 0 : files.map((file) => file.path);
    //check if at least one image is there
    if (!images || images.length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "At least one product image is required.");
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
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        //creating product
        const productData = yield transactionClient.product.create({
            data: payloadData,
        });
        const categoriesData = categories.map((category) => ({
            productId: productData.id,
            categoryId: category,
        }));
        //creating productCategory
        yield transactionClient.productCategory.createMany({
            data: categoriesData,
        });
        return productData;
    }));
    return result;
});
const getAllProduct = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, price, category } = params, filterData = __rest(params, ["searchTerm", "price", "category"]);
    const andConditions = [];
    // Filter for search
    if (searchTerm) {
        andConditions.push({
            OR: product_constant_1.productSearchAbleFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    // Filter for price range
    if (price) {
        const [minPrice, maxPrice] = price.split("-").map(Number);
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            andConditions.push({
                price: {
                    gte: minPrice,
                    lte: maxPrice,
                },
            });
        }
    }
    // Filter by categoryId (supporting multiple categories)
    if (category) {
        const categoryIds = category.split(",").map((id) => id.trim());
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
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.product.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
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
    const total = yield prisma_1.default.product.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getVendorsProducts = (shopId, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const result = yield prisma_1.default.product.findMany({
        where: {
            shopId,
            shop: {
                status: client_1.ShopStatus.ACTIVE
            }
        },
        skip,
        take: limit,
    });
    const total = yield prisma_1.default.product.count({
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
});
const getFlashSaleProducts = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const result = yield prisma_1.default.product.findMany({
        where: {
            isFlashSale: true,
            shop: {
                status: client_1.ShopStatus.ACTIVE
            }
        },
        skip,
        take: limit,
    });
    const total = yield prisma_1.default.product.count({
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
});
const getSingleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id,
            shop: {
                status: client_1.ShopStatus.ACTIVE
            }
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
});
const duplicateProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // get the original product
    const originalProduct = yield prisma_1.default.product.findUniqueOrThrow({
        where: { id },
        include: {
            productCategory: true,
        },
    });
    const { name, description, inventoryCount, price, images, discount, flashSalePrice, isFlashSale, shopId, } = originalProduct;
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
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const newProduct = yield transactionClient.product.create({
            data: newProductData,
        });
        // Duplicate categories
        const newCategories = originalProduct.productCategory.map((category) => ({
            productId: newProduct.id,
            categoryId: category.categoryId,
        }));
        yield transactionClient.productCategory.createMany({
            data: newCategories,
        });
        return newProduct;
    }));
    return result;
});
const updateProduct = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { categories } = payload, payloadData = __rest(payload, ["categories"]);
    const productData = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            productCategory: true,
        },
    });
    if (productData.isFlashSale &&
        productData.discount &&
        productData.price !== payload.price) {
        payloadData.flashSalePrice =
            payload.price - payload.price * (productData.discount / 100);
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(productData.productCategory.map((category) => transactionClient.productCategory.deleteMany({
            where: {
                productId: category.productId,
                categoryId: category.categoryId,
            },
        })));
        const categoriesData = categories.map((category) => ({
            productId: productData.id,
            categoryId: category,
        }));
        //creating productCategory
        yield transactionClient.productCategory.createMany({
            data: categoriesData,
        });
        const result = yield prisma_1.default.product.update({
            where: {
                id,
            },
            data: payloadData,
        });
        return result;
    }));
    return result;
});
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.productCategory.deleteMany({
            where: {
                productId: id,
            },
        });
        yield transactionClient.review.deleteMany({
            where: {
                productId: id,
            },
        });
        yield transactionClient.paymentProduct.deleteMany({
            where: {
                productId: id,
            },
        });
        const result = yield transactionClient.product.delete({
            where: {
                id,
            },
        });
        return result;
    }));
    return result;
});
exports.ProductServices = {
    createProduct,
    getAllProduct,
    getVendorsProducts,
    getFlashSaleProducts,
    getSingleProduct,
    duplicateProduct,
    updateProduct,
    deleteProduct,
};
