-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "telegramUsername" TEXT;

-- CreateTable
CREATE TABLE "public"."TelegramVerification" (
    "id" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TelegramVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TelegramVerification_userId_key" ON "public"."TelegramVerification"("userId");

-- AddForeignKey
ALTER TABLE "public"."TelegramVerification" ADD CONSTRAINT "TelegramVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
