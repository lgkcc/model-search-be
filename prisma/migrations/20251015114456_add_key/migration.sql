/*
  Warnings:

  - You are about to drop the column `nameFilter` on the `AdditionalServicesDictionary` table. All the data in the column will be lost.
  - You are about to drop the column `bodyTypeFilter` on the `BodyTypeDictionary` table. All the data in the column will be lost.
  - You are about to drop the column `colorFilter` on the `HairColorDictionary` table. All the data in the column will be lost.
  - You are about to drop the column `lengthFilter` on the `HairLengthDictionary` table. All the data in the column will be lost.
  - You are about to drop the column `nameFilter` on the `ServicesTypeDictionary` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `AdditionalServicesDictionary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `BodyTypeDictionary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `HairColorDictionary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `HairLengthDictionary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `ServicesTypeDictionary` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `AdditionalServicesDictionary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `BodyTypeDictionary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `HairColorDictionary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `HairLengthDictionary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `ServicesTypeDictionary` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."AdditionalServicesDictionary_nameFilter_key";

-- DropIndex
DROP INDEX "public"."BodyTypeDictionary_bodyTypeFilter_key";

-- DropIndex
DROP INDEX "public"."HairColorDictionary_colorFilter_key";

-- DropIndex
DROP INDEX "public"."HairLengthDictionary_lengthFilter_key";

-- DropIndex
DROP INDEX "public"."ServicesTypeDictionary_nameFilter_key";

-- AlterTable
ALTER TABLE "public"."AdditionalServicesDictionary" DROP COLUMN "nameFilter",
ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."BodyTypeDictionary" DROP COLUMN "bodyTypeFilter",
ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."HairColorDictionary" DROP COLUMN "colorFilter",
ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."HairLengthDictionary" DROP COLUMN "lengthFilter",
ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ServicesTypeDictionary" DROP COLUMN "nameFilter",
ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalServicesDictionary_key_key" ON "public"."AdditionalServicesDictionary"("key");

-- CreateIndex
CREATE UNIQUE INDEX "BodyTypeDictionary_key_key" ON "public"."BodyTypeDictionary"("key");

-- CreateIndex
CREATE UNIQUE INDEX "HairColorDictionary_key_key" ON "public"."HairColorDictionary"("key");

-- CreateIndex
CREATE UNIQUE INDEX "HairLengthDictionary_key_key" ON "public"."HairLengthDictionary"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ServicesTypeDictionary_key_key" ON "public"."ServicesTypeDictionary"("key");
