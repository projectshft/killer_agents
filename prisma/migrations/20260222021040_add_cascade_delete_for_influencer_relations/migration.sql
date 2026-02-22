-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InfluencerMetadata" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "influencerId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "primaryGenreId" TEXT NOT NULL,
    CONSTRAINT "InfluencerMetadata_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InfluencerMetadata_primaryGenreId_fkey" FOREIGN KEY ("primaryGenreId") REFERENCES "Genre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InfluencerMetadata_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InfluencerMetadata" ("id", "influencerId", "location", "primaryGenreId", "tierId") SELECT "id", "influencerId", "location", "primaryGenreId", "tierId" FROM "InfluencerMetadata";
DROP TABLE "InfluencerMetadata";
ALTER TABLE "new_InfluencerMetadata" RENAME TO "InfluencerMetadata";
CREATE UNIQUE INDEX "InfluencerMetadata_influencerId_key" ON "InfluencerMetadata"("influencerId");
CREATE INDEX "InfluencerMetadata_tierId_idx" ON "InfluencerMetadata"("tierId");
CREATE INDEX "InfluencerMetadata_location_idx" ON "InfluencerMetadata"("location");
CREATE INDEX "InfluencerMetadata_primaryGenreId_idx" ON "InfluencerMetadata"("primaryGenreId");
CREATE TABLE "new_Price" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "influencerId" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "bookingType" TEXT,
    CONSTRAINT "Price_influencerId_fkey" FOREIGN KEY ("influencerId") REFERENCES "Influencer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Price" ("bookingType", "currency", "id", "influencerId", "priceCents") SELECT "bookingType", "currency", "id", "influencerId", "priceCents" FROM "Price";
DROP TABLE "Price";
ALTER TABLE "new_Price" RENAME TO "Price";
CREATE INDEX "Price_influencerId_idx" ON "Price"("influencerId");
CREATE INDEX "Price_priceCents_idx" ON "Price"("priceCents");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
