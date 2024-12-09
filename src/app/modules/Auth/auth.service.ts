import { Request } from "express";
import bcrypt from "bcrypt";
import config from "../../../config";
import { generateJwtToken, verifyToken } from "../../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { UserStatus } from "@prisma/client";
import { ISignUpPayload } from "./auth.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import emailSender from "../../../shared/emailSender";
import jwt, { JwtPayload } from "jsonwebtoken";

const signUp = async (req: Request) => {
  const userData: ISignUpPayload = req.body;

  const isUserExists = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists!!");
  }

  if (req.file) {
    userData.profileImage = req?.file.path;
  }

  const hashedPassword = await bcrypt.hash(
    userData.password,
    Number(config.hash_salt_round)
  );

  const accessToken = generateJwtToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.access_token_secret as Secret,
    config.access_token_expires_in as string
  );

  const refreshToken = generateJwtToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.refresh_token_secret as Secret,
    config.refresh_token_expires_in as string
  );

  await prisma.user.create({
    data: { ...userData, password: hashedPassword },
  });

  return {
    accessToken,
    refreshToken,
  };
};

const login = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.FORBIDDEN, "Password incorrect!");
  }

  const accessToken = generateJwtToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.access_token_secret as Secret,
    config.access_token_expires_in as string
  );

  const refreshToken = generateJwtToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.refresh_token_secret as Secret,
    config.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
      decodedData = verifyToken(token, config.refresh_token_secret as Secret);
  }
  catch (err) {
      throw new Error("You are not authorized!")
  }

  const userData = await prisma.user.findUniqueOrThrow({
      where: {
          email: decodedData.email,
          status: UserStatus.ACTIVE
      }
  });

  const accessToken = generateJwtToken({
      email: userData.email,
      role: userData.role
  },
      config.access_token_secret as Secret,
      config.access_token_expires_in as string
  );

  return {
      accessToken,
  };

};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
      where: {
          email: user.email,
          status: UserStatus.ACTIVE
      }
  });

  const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

  if (!isCorrectPassword) {
      throw new AppError(httpStatus.FORBIDDEN, "Password is incorrect!!")
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
      where: {
          email: userData.email
      },
      data: {
          password: hashedPassword,
      }
  })

  return {
      message: "Password changed successfully!"
  }
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
      where: {
          email: payload.email,
          status: UserStatus.ACTIVE
      }
  });

  const resetPassToken = generateJwtToken(
      { email: userData.email, role: userData.role },
      config.reset_pass_secret as Secret,
      config.reset_pass_token_expires_in as string
  )
  //console.log(resetPassToken)

  const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`

  await emailSender(
      userData.email,
      `
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
      `
  )
  //console.log(resetPassLink)
};

const resetPassword = async (token: string, payload: { id: string, password: string }) => {

  const userData = await prisma.user.findUniqueOrThrow({
      where: {
          id: payload.id,
          status: UserStatus.ACTIVE
      }
  });

  const isValidToken = verifyToken(token, config.reset_pass_secret as Secret)

  if (!isValidToken) {
      throw new AppError(httpStatus.FORBIDDEN, "Forbidden!")
  }

  // hash password
  const password = await bcrypt.hash(payload.password, 12);

  // update into database
  await prisma.user.update({
      where: {
          id: payload.id
      },
      data: {
          password
      }
  })
};

export const AuthServices = {
  signUp,
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
