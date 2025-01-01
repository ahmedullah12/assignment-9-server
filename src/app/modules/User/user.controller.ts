import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CategoryServices } from "../Category/category.service";
import { UserServices } from "./user.services";
import pick from "../../../shared/pick";

const getAllUsers = catchAsync(async (req, res) => {
  const options = pick(req.query, ["limit", "page"]);

  const result = await UserServices.getAllUsers(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully!!",
    data: result,
  });
});

const getUserWithEmail = catchAsync(async (req, res) => {
  const { email } = req.query;
  const result = await UserServices.getUserWithEmail(email as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully!!",
    data: result,
  });
});

const getUserWithId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getUserWithId(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully!!",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.updateUser(id, req.body, req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully!!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.deleteUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully!!",
    data: result,
  });
});

const suspendUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.suspendUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User suspended successfully!!",
    data: result,
  });
});

const followShop = catchAsync(async (req, res) => {
  const { shopId } = req.params;
  const result = await UserServices.followShop(req.user, shopId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result
  });
});

const userSubscribe = catchAsync(async (req, res) => {
  const result = await UserServices.userSubscribe(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscribed Successfully!!",
    data: result
  });
});

export const UserController = {
  getAllUsers,
  getUserWithEmail,
  getUserWithId,
  updateUser,
  deleteUser,
  suspendUser,
  followShop,
  userSubscribe,
};
