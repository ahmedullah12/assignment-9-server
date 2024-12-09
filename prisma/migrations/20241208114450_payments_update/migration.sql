/*
  Warnings:

  - Added the required column `customerAddress` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerEmail` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerPhone` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "customerAddress" TEXT NOT NULL,
ADD COLUMN     "customerEmail" TEXT NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "customerPhone" TEXT NOT NULL,
ADD COLUMN     "status" "PaymentStatus" NOT NULL,
ADD COLUMN     "transactionId" TEXT NOT NULL;
