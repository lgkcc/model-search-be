/*
  Warnings:

  - A unique constraint covering the columns `[verificationCode]` on the table `TelegramVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TelegramVerification_verificationCode_key" ON "public"."TelegramVerification"("verificationCode");
