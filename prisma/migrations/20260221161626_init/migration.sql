-- CreateTable
CREATE TABLE "Influencer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gender" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "InfluencerMetadata" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "influencerId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "primaryGenreId" TEXT NOT NULL,
    CONSTRAINT "InfluencerMetadata_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InfluencerMetadata_primaryGenreId_fkey" FOREIGN KEY ("primaryGenreId") REFERENCES "Genre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InfluencerMetadata_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "influencerId" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "bookingType" TEXT,
    CONSTRAINT "Price_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "InfluencerMetadata_influencerId_key" ON "InfluencerMetadata"("influencerId");

-- CreateIndex
CREATE INDEX "InfluencerMetadata_tierId_idx" ON "InfluencerMetadata"("tierId");

-- CreateIndex
CREATE INDEX "InfluencerMetadata_location_idx" ON "InfluencerMetadata"("location");

-- CreateIndex
CREATE INDEX "InfluencerMetadata_primaryGenreId_idx" ON "InfluencerMetadata"("primaryGenreId");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE INDEX "Price_influencerId_idx" ON "Price"("influencerId");

-- CreateIndex
CREATE INDEX "Price_priceCents_idx" ON "Price"("priceCents");

-- CreateIndex
CREATE UNIQUE INDEX "Tier_name_key" ON "Tier"("name");
