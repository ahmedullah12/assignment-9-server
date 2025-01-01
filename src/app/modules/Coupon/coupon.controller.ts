import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CouponServices } from "./coupon.service";
import pick from "../../../shared/pick";

const createCoupon = catchAsync(async (req, res) => {
  const result = await CouponServices.createCoupon(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Coupon created successfully!!",
    data: result,
  });
});

const getAllCoupons = catchAsync(async (req, res) => {
  const options = pick(req.query, ["limit", "page"]);

  const result = await CouponServices.getAllCoupons(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All coupons fetched successfully!!",
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req, res) => {
  const { couponId } = req.params;
  const result = await CouponServices.deleteCoupon(couponId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon deleted successfully!!",
    data: result,
  });
});


const validateCoupon = catchAsync(async (req, res) => {
  const result = await CouponServices.validateCoupon(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon used successfully!!",
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  validateCoupon,
};
