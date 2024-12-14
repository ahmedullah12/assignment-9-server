"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const emailSender_1 = __importDefault(require("../../../shared/emailSender"));
const signUp = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const isUserExists = yield prisma_1.default.user.findUnique({
        where: {
            email: userData.email,
        },
    });
    if (isUserExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already exists!!");
    }
    if (req.file) {
        userData.profileImage = req === null || req === void 0 ? void 0 : req.file.path;
    }
    const hashedPassword = yield bcrypt_1.default.hash(userData.password, Number(config_1.default.hash_salt_round));
    const accessToken = (0, jwtHelpers_1.generateJwtToken)({
        email: userData.email,
        role: userData.role,
    }, config_1.default.access_token_secret, config_1.default.access_token_expires_in);
    const refreshToken = (0, jwtHelpers_1.generateJwtToken)({
        email: userData.email,
        role: userData.role,
    }, config_1.default.refresh_token_secret, config_1.default.refresh_token_expires_in);
    yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, userData), { password: hashedPassword }),
    });
    return {
        accessToken,
        refreshToken,
    };
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isPasswordCorrect = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isPasswordCorrect) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password incorrect!");
    }
    const accessToken = (0, jwtHelpers_1.generateJwtToken)({
        email: userData.email,
        role: userData.role,
    }, config_1.default.access_token_secret, config_1.default.access_token_expires_in);
    const refreshToken = (0, jwtHelpers_1.generateJwtToken)({
        email: userData.email,
        role: userData.role,
    }, config_1.default.refresh_token_secret, config_1.default.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = (0, jwtHelpers_1.verifyToken)(token, config_1.default.refresh_token_secret);
    }
    catch (err) {
        throw new Error("You are not authorized!");
    }
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const accessToken = (0, jwtHelpers_1.generateJwtToken)({
        email: userData.email,
        role: userData.role
    }, config_1.default.access_token_secret, config_1.default.access_token_expires_in);
    return {
        accessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password is incorrect!!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
        }
    });
    return {
        message: "Password changed successfully!"
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const resetPassToken = (0, jwtHelpers_1.generateJwtToken)({ email: userData.email, role: userData.role }, config_1.default.reset_pass_secret, config_1.default.reset_pass_token_expires_in);
    const resetPassLink = config_1.default.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;
    yield (0, emailSender_1.default)(userData.email, `
      <div>
          <p>Dear User,</p>
          <p>Your password reset link 
              <a href=${resetPassLink}>
                  <button>
                      Reset Password
                  </button>
              </a>
          </p>

      </div>
      `);
    //console.log(resetPassLink)
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const isValidToken = (0, jwtHelpers_1.verifyToken)(token, config_1.default.reset_pass_secret);
    if (!isValidToken) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Forbidden!");
    }
    // hash password
    const password = yield bcrypt_1.default.hash(payload.password, 12);
    // update into database
    yield prisma_1.default.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    });
});
exports.AuthServices = {
    signUp,
    login,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
