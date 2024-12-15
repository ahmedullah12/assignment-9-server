import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ShopServices } from "./shop.service";
import pick from "../../../shared/pick";

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
  const options = pick(req.query, ["limit", "page"]);

  const result = await ShopServices.getAllShop(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shops fetched successfully!!",
    data: result,
  });
});

const getSingleShopWithId = catchAsync(async (req, res) => {
  const { shopId } = req.params;

  const result = await ShopServices.getSingleShopWithId(shopId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shop fetched successfully!!",
    data: result,
  });
});

const getVendorShop = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await ShopServices.getVendorShop(user);

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

const blacklistShop = catchAsync(async (req, res) => {
  const { shopId } = req.params;

  const result = await ShopServices.blacklistShop(shopId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shop blacklisted successfully!!",
    data: result,
  });
});

export const ShopController = {
    createShop,
    getAllShop,
    getSingleShopWithId,
    getVendorShop,
    updateShop,
    deleteShop,
    blacklistShop,
}