/*
  Warnings:

  - You are about to drop the column `tgStatus` on the `TelegramVerification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."TelegramVerification" DROP COLUMN "tgStatus";
