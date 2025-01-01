import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DashboardOverviewController } from "./dashboard-overview.controller";



const router = Router();

router.get("/", auth(UserRole.ADMIN), DashboardOverviewController.getAllOverviewData);
router.get("/vendor-overview/:id", auth(UserRole.VENDOR), DashboardOverviewController.getVendorOverviewData);

export const DashboardOverviewRoutes = router;