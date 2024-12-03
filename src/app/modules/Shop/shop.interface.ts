import { ShopStatus } from "@prisma/client";

export interface ICreateShop {
    name: string;
    description: string;
}

export interface IUpdateShop {
    name?: string;
    description?: string;
    logoUrl?: string;
    status?: ShopStatus;
}