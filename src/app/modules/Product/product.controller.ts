import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ProductServices } from "./product.service";
import pick from "../../../shared/pick";
import { productFilterableFields } from "./product.constant";

const createProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProduct(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully!!",
    data: result,
  });
});

const getAllProduct = catchAsync(async (req, res) => {
  const filters = pick(req.query, productFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await ProductServices.getAllProduct(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products fetched successfully!!",
    data: result,
  });
});

const getFlashSaleProducts = catchAsync(async (req, res) => {
  const options = pick(req.query, ["limit", "page"]);

  const result = await ProductServices.getFlashSaleProducts(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flash Sale products fetched successfully!!",
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.getSingleProduct(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product fetched successfully!!",
    data: result,
  });
});

const duplicateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ProductServices.duplicateProduct(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product duplicated successfully!!",
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.updateProduct(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully!!",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.deleteProduct(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully!!",
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProduct,
  getFlashSaleProducts,
  getSingleProduct,
  duplicateProduct,
  updateProduct,
  deleteProduct,
};
