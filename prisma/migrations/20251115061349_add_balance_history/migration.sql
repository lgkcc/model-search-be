-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('INCOME', 'OUTCOME');

-- CreateTable
CREATE TABLE "public"."BalanceHistory" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "public"."TransactionStatus" NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BalanceHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."BalanceHistory" ADD CONSTRAINT "BalanceHistory_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
