import httpStatus from "http-status";
import prisma from "../../../shared/prisma"
import AppError from "../../errors/AppError";

const createCategory = async(payload: {name: string}) => {
    const isCategoryNameExists = await prisma.category.findUnique({
        where: {
            name: payload.name
        }
    });

    if(isCategoryNameExists){
        throw new AppError(httpStatus.BAD_REQUEST, "Category already exists!!")
    }

    const result = await prisma.category.create({
        data: payload
    });

    return result;
};

const getAllCategory = async() => {
    const result = await prisma.category.findMany();

    return result;
};

const getSingleCategory = async(categoryId: string) => {
    const result = await prisma.category.findUniqueOrThrow({
        where: {
            id: categoryId
        }
    });

    return result;
};

const updateCategory = async(categoryId: string, payload: {name: string}) => {
    const isCategoryNameExists = await prisma.category.findUnique({
        where: {
            name: payload.name
        }
    });

    if(isCategoryNameExists){
        throw new AppError(httpStatus.BAD_REQUEST, "Category already exists!!")
    }

    const result = await prisma.category.update({
        where: {
            id: categoryId
        },
        data: payload
    });

    return result;
};

const deleteCategory = async(categoryId: string) => {
    const result = await prisma.category.delete({
        where: {
            id: categoryId,
        }
    });

    return result;
};

export const CategoryServices = {
    createCategory,
    getAllCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory,
}