-- Bellet is education-only for now: other categories will get their own
-- domain tables later (e.g. car wash = time-slot queue), so drop the
-- placeholder categories and any businesses created under them.
DELETE FROM "Booking" WHERE "offeringId" IN (
  SELECT o."id" FROM "Offering" o
  JOIN "Business" b ON o."businessId" = b."id"
  JOIN "Category" c ON b."categoryId" = c."id"
  WHERE c."slug" <> 'education'
);
DELETE FROM "Business" WHERE "categoryId" IN (
  SELECT "id" FROM "Category" WHERE "slug" <> 'education'
);
DELETE FROM "Category" WHERE "slug" <> 'education';

-- One business per owner: keep each owner's oldest business, drop the rest.
DELETE FROM "Booking" WHERE "offeringId" IN (
  SELECT o."id" FROM "Offering" o WHERE o."businessId" NOT IN (
    SELECT DISTINCT ON ("ownerId") "id" FROM "Business"
    ORDER BY "ownerId", "createdAt" ASC
  )
);
DELETE FROM "Business" WHERE "id" NOT IN (
  SELECT DISTINCT ON ("ownerId") "id" FROM "Business"
  ORDER BY "ownerId", "createdAt" ASC
);

-- DropIndex
DROP INDEX "Business_ownerId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Business_ownerId_key" ON "Business"("ownerId");
