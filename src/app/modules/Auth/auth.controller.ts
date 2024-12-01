import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";


const signUp = catchAsync(async(req, res) => {
    const result = await AuthServices.signUp(req);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User signed up successfully!!",
        data: result,
    })
})

export const AuthController = {
    signUp
}