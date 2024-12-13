import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewServices } from "../Review/review.service";

const createReview = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await ReviewServices.createReview(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review added successfully!!",
    data: result,
  });
});

const getProductReviews = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ReviewServices.getProductReviews(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews fetched successfully!!",
    data: result,
  });
});

const getUserReviews = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await ReviewServices.getUserReviews(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews fetched successfully!!",
    data: result,
  });
});

const getShopProductReviews = catchAsync(async (req, res) => {
  const { shopId } = req.query;

  const result = await ReviewServices.getShopProductReviews(shopId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews fetched successfully!!",
    data: result,
  });
});

const updateReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const result = await ReviewServices.updateReview(reviewId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfully!!",
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ReviewServices.deleteReview(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully!!",
    data: result,
  });
});

const replyReview = catchAsync(async (req, res) => {
  const { reviewId } = req.query;

  const result = await ReviewServices.replyReview(reviewId as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review replied successfully!!",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getProductReviews,
  getUserReviews,
  getShopProductReviews,
  updateReview,
  deleteReview,
  replyReview,
};
