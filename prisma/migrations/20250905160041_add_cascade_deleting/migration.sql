-- DropForeignKey
ALTER TABLE "public"."CurrenciesOnProfiles" DROP CONSTRAINT "CurrenciesOnProfiles_currencyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CurrenciesOnProfiles" DROP CONSTRAINT "CurrenciesOnProfiles_profileId_fkey";

-- AddForeignKey
ALTER TABLE "public"."CurrenciesOnProfiles" ADD CONSTRAINT "CurrenciesOnProfiles_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CurrenciesOnProfiles" ADD CONSTRAINT "CurrenciesOnProfiles_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "public"."CurrencyDictionary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
