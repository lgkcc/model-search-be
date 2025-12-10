/*
  Warnings:

  - Added the required column `href` to the `MessengersOnProfiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."MessengersOnProfiles" ADD COLUMN     "href" TEXT NOT NULL;
