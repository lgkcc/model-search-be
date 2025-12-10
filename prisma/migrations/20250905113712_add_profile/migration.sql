-- CreateEnum
CREATE TYPE "public"."StatisticsType" AS ENUM ('Telegram', 'WhatsApp', 'Viber', 'Skype', 'Teams', 'Show', 'View');

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "galleryImages" TEXT[],
    "image" TEXT,
    "customLinks" JSONB[],
    "profileName" TEXT,
    "description" TEXT,
    "age" INTEGER,
    "height" INTEGER,
    "width" INTEGER,
    "cupSize" TEXT,
    "cupSizeFloat" DOUBLE PRECISION,
    "bodyTypeId" TEXT,
    "hairColorId" TEXT,
    "hairHeightId" TEXT,
    "startPublishDate" TIMESTAMP(3),
    "endPublishDate" TIMESTAMP(3),
    "upDate" TIMESTAMP(3),
    "remainsTime" TEXT,
    "isFreeze" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "profileId" TEXT,
    "serviceTypeId" TEXT,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServicesTypeDictionary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameFilter" TEXT NOT NULL,

    CONSTRAINT "ServicesTypeDictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CurrencyDictionary" (
    "id" TEXT NOT NULL,
    "alphabeticCode" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,

    CONSTRAINT "CurrencyDictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CurrenciesOnProfiles" (
    "profileId" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "CurrenciesOnProfiles_pkey" PRIMARY KEY ("profileId","currencyId")
);

-- CreateTable
CREATE TABLE "public"."MessengerDictionary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "MessengerDictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MessengersOnProfiles" (
    "profileId" TEXT NOT NULL,
    "messengerId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "MessengersOnProfiles_pkey" PRIMARY KEY ("profileId","messengerId")
);

-- CreateTable
CREATE TABLE "public"."AdditionalServicesDictionary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameFilter" TEXT NOT NULL,

    CONSTRAINT "AdditionalServicesDictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdditionalServicesOnProfiles" (
    "profileId" TEXT NOT NULL,
    "additionalServicesId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "AdditionalServicesOnProfiles_pkey" PRIMARY KEY ("profileId","additionalServicesId")
);

-- CreateTable
CREATE TABLE "public"."BodyTypeDictionary" (
    "id" TEXT NOT NULL,
    "bodyType" TEXT NOT NULL,
    "bodyTypeFilter" TEXT NOT NULL,

    CONSTRAINT "BodyTypeDictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HairColorDictionary" (
    "id" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "colorFilter" TEXT NOT NULL,

    CONSTRAINT "HairColorDictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HairLengthDictionary" (
    "id" TEXT NOT NULL,
    "length" TEXT NOT NULL,
    "lengthFilter" TEXT NOT NULL,

    CONSTRAINT "HairLengthDictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Statistics" (
    "id" TEXT NOT NULL,
    "profileId" TEXT,
    "statisticDate" TIMESTAMP(3),
    "statisticsType" "public"."StatisticsType" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "dayTime" TIMESTAMP(3)[],

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlanUp" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "cost" INTEGER NOT NULL,

    CONSTRAINT "PlanUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "public"."Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ServicesTypeDictionary_name_key" ON "public"."ServicesTypeDictionary"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServicesTypeDictionary_nameFilter_key" ON "public"."ServicesTypeDictionary"("nameFilter");

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyDictionary_alphabeticCode_key" ON "public"."CurrencyDictionary"("alphabeticCode");

-- CreateIndex
CREATE UNIQUE INDEX "CurrencyDictionary_isoCode_key" ON "public"."CurrencyDictionary"("isoCode");

-- CreateIndex
CREATE UNIQUE INDEX "MessengerDictionary_name_key" ON "public"."MessengerDictionary"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MessengerDictionary_link_key" ON "public"."MessengerDictionary"("link");

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalServicesDictionary_name_key" ON "public"."AdditionalServicesDictionary"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalServicesDictionary_nameFilter_key" ON "public"."AdditionalServicesDictionary"("nameFilter");

-- CreateIndex
CREATE UNIQUE INDEX "BodyTypeDictionary_bodyType_key" ON "public"."BodyTypeDictionary"("bodyType");

-- CreateIndex
CREATE UNIQUE INDEX "BodyTypeDictionary_bodyTypeFilter_key" ON "public"."BodyTypeDictionary"("bodyTypeFilter");

-- CreateIndex
CREATE UNIQUE INDEX "HairColorDictionary_color_key" ON "public"."HairColorDictionary"("color");

-- CreateIndex
CREATE UNIQUE INDEX "HairColorDictionary_colorFilter_key" ON "public"."HairColorDictionary"("colorFilter");

-- CreateIndex
CREATE UNIQUE INDEX "HairLengthDictionary_length_key" ON "public"."HairLengthDictionary"("length");

-- CreateIndex
CREATE UNIQUE INDEX "HairLengthDictionary_lengthFilter_key" ON "public"."HairLengthDictionary"("lengthFilter");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_bodyTypeId_fkey" FOREIGN KEY ("bodyTypeId") REFERENCES "public"."BodyTypeDictionary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_hairColorId_fkey" FOREIGN KEY ("hairColorId") REFERENCES "public"."HairColorDictionary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_hairHeightId_fkey" FOREIGN KEY ("hairHeightId") REFERENCES "public"."HairLengthDictionary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "public"."ServicesTypeDictionary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CurrenciesOnProfiles" ADD CONSTRAINT "CurrenciesOnProfiles_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CurrenciesOnProfiles" ADD CONSTRAINT "CurrenciesOnProfiles_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "public"."CurrencyDictionary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessengersOnProfiles" ADD CONSTRAINT "MessengersOnProfiles_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessengersOnProfiles" ADD CONSTRAINT "MessengersOnProfiles_messengerId_fkey" FOREIGN KEY ("messengerId") REFERENCES "public"."MessengerDictionary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdditionalServicesOnProfiles" ADD CONSTRAINT "AdditionalServicesOnProfiles_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdditionalServicesOnProfiles" ADD CONSTRAINT "AdditionalServicesOnProfiles_additionalServicesId_fkey" FOREIGN KEY ("additionalServicesId") REFERENCES "public"."AdditionalServicesDictionary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Statistics" ADD CONSTRAINT "Statistics_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanUp" ADD CONSTRAINT "PlanUp_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
