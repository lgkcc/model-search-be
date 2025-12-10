/*
  Warnings:

  - You are about to drop the column `cupSizeFloat` on the `Profile` table. All the data in the column will be lost.
  - The `cupSize` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Profile" DROP COLUMN "cupSizeFloat",
DROP COLUMN "cupSize",
ADD COLUMN     "cupSize" DOUBLE PRECISION;
