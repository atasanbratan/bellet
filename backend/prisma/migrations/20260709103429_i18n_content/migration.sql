-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "descriptionRu" TEXT,
ADD COLUMN     "descriptionTk" TEXT;

-- AlterTable
ALTER TABLE "Offering" ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "descriptionRu" TEXT,
ADD COLUMN     "descriptionTk" TEXT,
ADD COLUMN     "titleEn" TEXT,
ADD COLUMN     "titleRu" TEXT,
ADD COLUMN     "titleTk" TEXT;
