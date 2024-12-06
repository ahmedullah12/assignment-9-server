import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";

const signUp = catchAsync(async (req, res) => {
  const result = await AuthServices.signUp(req);

  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
    sameSite: "lax"
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User signed up successfully!!",
    data: {
      accessToken,
    },
  });
});

const login = catchAsync(async (req, res) => {
  const result = await AuthServices.login(req.body);

  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully!!",
    data: {
      accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token retrieved successfully!",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await AuthServices.changePassword(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Changed Successfully!",
    data: {},
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reset link is generated successfully!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization || "";

  await AuthServices.resetPassword(token, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Reset!",
  });
});

export const AuthController = {
  signUp,
  login,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
