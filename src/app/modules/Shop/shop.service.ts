import { Shop, ShopStatus, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma"

const createShop = async(payload: any) => {
    const isShopNameExists = await prisma.shop.findUnique({
        where: {
            name: payload.name,
        }
    });

    if(isShopNameExists){
        throw new Error("Shop name already exists!!")
    }

    const result = await prisma.shop.create({
        data: payload,
    });


    return result;
};


const getAllShop = async() => {
    const result = await prisma.shop.findMany();

    return result;
};

const getSingleShop = async(vendorId: string) => {
    const result = await prisma.shop.findUnique({
        where: {
            vendorId,
        }
    });

    return result;
};

const updateShop = async(shopId: string, payload: Partial<Shop>) => {
    const isShopNameExists = await prisma.shop.findUniqueOrThrow({
        where: {
            name: payload.name,
        }
    });

    if(isShopNameExists){
        throw new Error("Shop name already exists!!")
    }

    const result = await prisma.shop.update({
        where: {
            id: shopId
        },
        data: payload
    });

    return result;
};


const deleteShop = async(shopId: string) => {
    const result = await prisma.shop.update({
        where: {
            id: shopId,
        },
        data: {
            status: UserStatus.DELETED
        }
    });

    return result;
}


export const ShopServices = {
    createShop,
    getAllShop,
    getSingleShop,
    updateShop,
    deleteShop,
}