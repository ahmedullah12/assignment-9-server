-- CreateTable
CREATE TABLE "follow_shops" (
    "userId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,

    CONSTRAINT "follow_shops_pkey" PRIMARY KEY ("userId","shopId")
);

-- AddForeignKey
ALTER TABLE "follow_shops" ADD CONSTRAINT "follow_shops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_shops" ADD CONSTRAINT "follow_shops_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
