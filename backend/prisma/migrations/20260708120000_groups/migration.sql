-- CreateEnum
CREATE TYPE "TimeOfDay" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_offeringId_fkey";

-- DropForeignKey
ALTER TABLE "_OfferingTeachers" DROP CONSTRAINT "_OfferingTeachers_A_fkey";

-- DropForeignKey
ALTER TABLE "_OfferingTeachers" DROP CONSTRAINT "_OfferingTeachers_B_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "scheduleId",
ADD COLUMN     "groupId" TEXT;

-- DropTable
DROP TABLE "Schedule";

-- DropTable
DROP TABLE "_OfferingTeachers";

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "teacherId" TEXT,
    "days" INTEGER[],
    "timeOfDay" "TimeOfDay" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Group_offeringId_idx" ON "Group"("offeringId");

-- CreateIndex
CREATE INDEX "Group_teacherId_idx" ON "Group"("teacherId");

-- CreateIndex
CREATE INDEX "Booking_groupId_idx" ON "Booking"("groupId");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "Offering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

