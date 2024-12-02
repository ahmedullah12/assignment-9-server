import { Request } from "express";
import bcrypt from "bcrypt";
import config from "../../../config";
import { generateJwtToken } from "../../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { UserStatus } from "@prisma/client";
import { ISignUpPayload } from "./auth.interface";

const signUp = async (req: Request) => {
  const userData: ISignUpPayload = req.body;

  const isUserExists = await prisma.user.findUnique({
    where: {
      email: userData.email,
    }
  })

  if(isUserExists){
    throw new Error("User already exists!!")
  }

  if(req.file){
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
    throw new Error("Password incorrect!");
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

export const AuthServices = {
  signUp,
  login
};
