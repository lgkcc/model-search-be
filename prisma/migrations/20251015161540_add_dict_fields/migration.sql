/*
  Warnings:

  - You are about to drop the column `name` on the `AdditionalServicesDictionary` table. All the data in the column will be lost.
  - You are about to drop the column `bodyType` on the `BodyTypeDictionary` table. All the data in the column will be lost.
  - You are about to drop the column `alphabeticCode` on the `CurrencyDictionary` table. All the data in the column will be lost.
  - You are about to drop the column `isoCode` on the `CurrencyDictionary` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `HairColorDictionary` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `HairLengthDictionary` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `MessengerDictionary` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `MessengerDictionary` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ServicesTypeDictionary` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[value]` on the table `AdditionalServicesDictionary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `BodyTypeDictionary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `CurrencyDictionary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `CurrencyDictionary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `HairColorDictionary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `HairLengthDictionary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `MessengerDictionary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `MessengerDictionary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `ServicesTypeDictionary` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `value` to the `AdditionalServicesDictionary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `BodyTypeDictionary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `CurrencyDictionary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `CurrencyDictionary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `HairColorDictionary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `HairLengthDictionary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `MessengerDictionary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `MessengerDictionary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `ServicesTypeDictionary` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."AdditionalServicesDictionary_name_key";

-- DropIndex
DROP INDEX "public"."BodyTypeDictionary_bodyType_key";

-- DropIndex
DROP INDEX "public"."CurrencyDictionary_alphabeticCode_key";

-- DropIndex
DROP INDEX "public"."CurrencyDictionary_isoCode_key";

-- DropIndex
DROP INDEX "public"."HairColorDictionary_color_key";

-- DropIndex
DROP INDEX "public"."HairLengthDictionary_length_key";

-- DropIndex
DROP INDEX "public"."MessengerDictionary_link_key";

-- DropIndex
DROP INDEX "public"."MessengerDictionary_name_key";

-- DropIndex
DROP INDEX "public"."ServicesTypeDictionary_name_key";

-- AlterTable
ALTER TABLE "public"."AdditionalServicesDictionary" DROP COLUMN "name",
ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."BodyTypeDictionary" DROP COLUMN "bodyType",
ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."CurrencyDictionary" DROP COLUMN "alphabeticCode",
DROP COLUMN "isoCode",
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."HairColorDictionary" DROP COLUMN "color",
ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."HairLengthDictionary" DROP COLUMN "length",
ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."MessengerDictionary" DROP COLUMN "link",
DROP COLUMN "name",
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."ServicesTypeDictionary" DROP COLUMN "name",
ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalServicesDictionary_value_key" ON "public"."AdditionalServicesDictionary"("value");

-- CreateIndex
CREATE UNIQUE INDEX "BodyTypeDictionary_value_key" ON "public"."BodyTypeDictionary"("value");

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyDictionary_key_key" ON "public"."CurrencyDictionary"("key");

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyDictionary_value_key" ON "public"."CurrencyDictionary"("value");

-- CreateIndex
CREATE UNIQUE INDEX "HairColorDictionary_value_key" ON "public"."HairColorDictionary"("value");

-- CreateIndex
CREATE UNIQUE INDEX "HairLengthDictionary_value_key" ON "public"."HairLengthDictionary"("value");

-- CreateIndex
CREATE UNIQUE INDEX "MessengerDictionary_key_key" ON "public"."MessengerDictionary"("key");

-- CreateIndex
CREATE UNIQUE INDEX "MessengerDictionary_value_key" ON "public"."MessengerDictionary"("value");

-- CreateIndex
CREATE UNIQUE INDEX "ServicesTypeDictionary_value_key" ON "public"."ServicesTypeDictionary"("value");
