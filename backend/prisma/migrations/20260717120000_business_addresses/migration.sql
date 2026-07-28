-- CreateTable
CREATE TABLE "Province" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameTk" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Province_slug_key" ON "Province"("slug");

-- Seed Turkmenistan's 5 welayats + the capital.
INSERT INTO "Province" ("id", "slug", "nameTk", "nameEn", "nameRu") VALUES
    ('ashgabat', 'ashgabat', 'Aşgabat', 'Ashgabat', 'Ашхабад'),
    ('ahal',     'ahal',     'Ahal',    'Ahal',     'Ахал'),
    ('balkan',   'balkan',   'Balkan',  'Balkan',   'Балкан'),
    ('dashoguz', 'dashoguz', 'Daşoguz', 'Dashoguz', 'Дашогуз'),
    ('lebap',    'lebap',    'Lebap',   'Lebap',    'Лебап'),
    ('mary',     'mary',     'Mary',    'Mary',     'Мары');

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "line" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Address_businessId_idx" ON "Address"("businessId");

-- CreateIndex
CREATE INDEX "Address_provinceId_idx" ON "Address"("provinceId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Migrate each business's legacy free-text address into its own Address row.
-- Province is unknown for old data, so it defaults to Ashgabat; owners can
-- fix it (and add more addresses) from the dashboard afterwards.
INSERT INTO "Address" ("id", "businessId", "provinceId", "line")
SELECT gen_random_uuid()::text, "id", 'ashgabat', "address"
FROM "Business"
WHERE "address" IS NOT NULL AND btrim("address") <> '';

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "address";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN "addressId" TEXT;

-- CreateIndex
CREATE INDEX "Group_addressId_idx" ON "Group"("addressId");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
