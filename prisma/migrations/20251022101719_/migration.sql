/*
  Warnings:

  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Service" DROP CONSTRAINT "Service_profileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Service" DROP CONSTRAINT "Service_serviceTypeId_fkey";

-- DropTable
DROP TABLE "public"."Service";

-- CreateTable
CREATE TABLE "public"."ServicesOnProfile" (
    "price" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "serviceTypeId" TEXT NOT NULL,

    CONSTRAINT "ServicesOnProfile_pkey" PRIMARY KEY ("profileId","serviceTypeId")
);

-- AddForeignKey
ALTER TABLE "public"."ServicesOnProfile" ADD CONSTRAINT "ServicesOnProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServicesOnProfile" ADD CONSTRAINT "ServicesOnProfile_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "public"."ServicesTypeDictionary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
