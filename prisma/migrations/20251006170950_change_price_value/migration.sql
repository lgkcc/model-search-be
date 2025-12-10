/*
  Warnings:

  - You are about to alter the column `value` on the `PriceDictionary` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."PriceDictionary" ALTER COLUMN "value" SET DATA TYPE INTEGER;
