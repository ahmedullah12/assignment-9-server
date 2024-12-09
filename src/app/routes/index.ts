import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { ShopRoutes } from "../modules/Shop/shop.routes";
import { CategoryRoutes } from "../modules/Category/category.routes";
import { ProductRoutes } from "../modules/Product/product.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { PaymentRoutes } from "../modules/Payment/payment.route";
import { PaymentCollectionRoutes } from "../modules/PaymentsCollection/payment-collection.route";

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
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/payment-collection",
    route: PaymentCollectionRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
