import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ShopServices } from "./shop.service";

const createShop = catchAsync(async (req, res) => {
  const result = await ShopServices.createShop(req.user, req.body, req.file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Shop created successfully!!",
    data: result,
  });
});

const getAllShop = catchAsync(async (req, res) => {
  const result = await ShopServices.getAllShop();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shops fetched successfully!!",
    data: result,
  });
});

const getSingleShop = catchAsync(async (req, res) => {
  const { shopId } = req.params;

  const result = await ShopServices.getSingleShop(shopId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shop fetched successfully!!",
    data: result,
  });
});

const updateShop = catchAsync(async (req, res) => {

  const result = await ShopServices.updateShop(req.user, req.body, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shop updated successfully!!",
    data: result,
  });
});

const deleteShop = catchAsync(async (req, res) => {
  const { shopId } = req.params;

  const result = await ShopServices.deleteShop(shopId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shop deleted successfully!!",
    data: result,
  });
});

export const ShopController = {
    createShop,
    getAllShop,
    getSingleShop,
    updateShop,
    deleteShop,
}