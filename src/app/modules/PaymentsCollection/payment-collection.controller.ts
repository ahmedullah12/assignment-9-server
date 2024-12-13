import httpStatus from "http-status";
import { PaymentCollectionService } from "./payment-collection.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";

const createPayment = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await PaymentCollectionService.createPayment(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment started successfully!!",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const options = pick(req.query, ["limit", "page"]);

  const result = await PaymentCollectionService.getAllPayments(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments fetched successfully!!",
    data: result,
  });
});

const getUserPayments = catchAsync(async (req, res) => {
  const user = req.user;
  const options = pick(req.query, ["limit", "page"]);

  const result = await PaymentCollectionService.getUserPayments(user, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments fetched successfully!!",
    data: result,
  });
});

const getShopPayments = catchAsync(async (req, res) => {
  const user = req.user;
  const options = pick(req.query, ["limit", "page"]);

  const result = await PaymentCollectionService.getShopPayments(user, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments fetched successfully!!",
    data: result,
  });
});

export const PaymentCollectionController = {
  createPayment,
  getAllPayments,
  getUserPayments,
  getShopPayments,
};
