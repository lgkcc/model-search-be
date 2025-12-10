/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `AdditionalServicesOnProfiles` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `AdditionalServicesOnProfiles` table. All the data in the column will be lost.
  - You are about to drop the column `assignedAt` on the `CurrenciesOnProfiles` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `CurrenciesOnProfiles` table. All the data in the column will be lost.
  - You are about to drop the column `assignedAt` on the `MessengersOnProfiles` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `MessengersOnProfiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."AdditionalServicesOnProfiles" DROP COLUMN "assignedAt",
DROP COLUMN "assignedBy";

-- AlterTable
ALTER TABLE "public"."CurrenciesOnProfiles" DROP COLUMN "assignedAt",
DROP COLUMN "assignedBy";

-- AlterTable
ALTER TABLE "public"."MessengersOnProfiles" DROP COLUMN "assignedAt",
DROP COLUMN "assignedBy";
