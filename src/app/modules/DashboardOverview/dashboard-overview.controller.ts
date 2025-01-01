import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { DashboardOverviewServices } from "./dashboard-overview.services";
import sendResponse from "../../../shared/sendResponse";

const getAllOverviewData = catchAsync(async (req, res) => {
  const result = await DashboardOverviewServices.getAllOverviewData();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All data fetched successfully!!",
    data: result,
  });
});

const getVendorOverviewData = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DashboardOverviewServices.getVendorOverviewData(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All data fetched successfully!!",
    data: result,
  });
});

export const DashboardOverviewController = {
  getAllOverviewData,
  getVendorOverviewData
};
