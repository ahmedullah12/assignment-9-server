"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardOverviewRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const dashboard_overview_controller_1 = require("./dashboard-overview.controller");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), dashboard_overview_controller_1.DashboardOverviewController.getAllOverviewData);
router.get("/vendor-overview/:id", (0, auth_1.default)(client_1.UserRole.VENDOR), dashboard_overview_controller_1.DashboardOverviewController.getVendorOverviewData);
exports.DashboardOverviewRoutes = router;
