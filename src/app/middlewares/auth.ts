import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import { verifyToken } from "../../helpers/jwtHelpers";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      let decoded;
      try {
        decoded = verifyToken(token, config.access_token_secret as Secret);
      } catch (err) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }

      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        throw new Error("Forbidden!");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
