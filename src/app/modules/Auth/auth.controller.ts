import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";


const signUp = catchAsync(async(req, res) => {
    const result = await AuthServices.signUp(req);

    const { refreshToken, accessToken } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User signed up successfully!!",
        data: {
            accessToken,
        },
    })
})

const login = catchAsync(async(req, res) => {
    const result = await AuthServices.login(req.body);

    const { refreshToken, accessToken } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User logged in successfully!!",
        data: {
            accessToken,
        },
    })
})

export const AuthController = {
    signUp,
    login
}