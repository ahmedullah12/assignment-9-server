import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { ShopRoutes } from "../modules/Shop/shop.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/shop",
    route: ShopRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
