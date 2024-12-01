import { Request } from "express";
import bcrypt from "bcrypt";
import config from "../../../config";
import { generateJwtToken } from "../../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { UserStatus } from "@prisma/client";

const signUp = async (req: Request) => {
  const userData = req.body;

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
    console.log(payload);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
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
