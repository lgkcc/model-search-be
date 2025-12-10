-- CreateEnum
CREATE TYPE "public"."TgStatus" AS ENUM ('PENDING', 'CONNECTED', 'NOT_CONNECTED');

-- AlterTable
ALTER TABLE "public"."TelegramVerification" ADD COLUMN     "tgStatus" "public"."TgStatus" NOT NULL DEFAULT 'PENDING';
