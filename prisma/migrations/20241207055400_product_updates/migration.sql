-- AlterTable
ALTER TABLE "products" ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "isFlashSale" BOOLEAN NOT NULL DEFAULT false;
