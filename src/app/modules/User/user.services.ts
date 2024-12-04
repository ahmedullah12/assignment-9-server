import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";

const getAllUsers = async () => {
  const result = await prisma.user.findMany();

  return result;
};

const getUserWithEmail = async (email: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });

  return result;
};

const getUserWithId = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      status: UserStatus.ACTIVE,
    },
  });

  return result;
};

const updateUser = async (id: string, payload: IUserPayload) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteUser = async (id: string) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: UserStatus.DELETED,
    },
  });

  return result;
};

const suspendUser = async (id: string) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: UserStatus.SUSPENDED,
    },
  });

  return result;
};

export const UserServices = {
    getAllUsers,
    getUserWithEmail,
    getUserWithId,
    updateUser,
    deleteUser,
    suspendUser,
}