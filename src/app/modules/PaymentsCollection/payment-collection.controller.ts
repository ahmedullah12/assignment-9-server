import httpStatus from 'http-status';
import { PaymentCollectionService } from './payment-collection.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createPayment = catchAsync(async (req, res) => {
  const user = req.user;
  console.log(user);
  const result = await PaymentCollectionService.createPayment(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment started successfully!!',
    data: result,
  });
});
const getPayments = catchAsync(async (req, res) => {
  const result = await PaymentCollectionService.getPayments();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments fetched successfully!!',
    data: result,
  });
});

export const PaymentCollectionController = {
    createPayment,
    getPayments,
}