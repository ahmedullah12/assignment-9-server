-- CreateEnum
CREATE TYPE "UserCouponStatus" AS ENUM ('USED', 'EXPIRED');

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "couponNumber" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_coupons" (
    "couponId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "UserCouponStatus" NOT NULL,

    CONSTRAINT "user_coupons_pkey" PRIMARY KEY ("couponId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "coupons_couponNumber_key" ON "coupons"("couponNumber");

-- AddForeignKey
ALTER TABLE "user_coupons" ADD CONSTRAINT "user_coupons_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_coupons" ADD CONSTRAINT "user_coupons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
