-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "telegramId" TEXT,
ALTER COLUMN "refreshToken" DROP NOT NULL,
ALTER COLUMN "refreshToken" DROP DEFAULT;
