/*
  Warnings:

  - The primary key for the `Service` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Service` table. All the data in the column will be lost.
  - Made the column `profileId` on table `Service` required. This step will fail if there are existing NULL values in that column.
  - Made the column `serviceTypeId` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Service" DROP CONSTRAINT "Service_profileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Service" DROP CONSTRAINT "Service_serviceTypeId_fkey";

-- AlterTable
ALTER TABLE "public"."Service" DROP CONSTRAINT "Service_pkey",
DROP COLUMN "id",
ALTER COLUMN "profileId" SET NOT NULL,
ALTER COLUMN "serviceTypeId" SET NOT NULL,
ADD CONSTRAINT "Service_pkey" PRIMARY KEY ("profileId", "serviceTypeId");

-- AddForeignKey
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "public"."ServicesTypeDictionary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
