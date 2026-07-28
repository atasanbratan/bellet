-- CreateTable
CREATE TABLE "SavedCenter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedCenter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedCenter_userId_idx" ON "SavedCenter"("userId");

-- CreateIndex
CREATE INDEX "SavedCenter_businessId_idx" ON "SavedCenter"("businessId");

-- CreateIndex: saving the same centre twice is a no-op, not a duplicate row.
CREATE UNIQUE INDEX "SavedCenter_userId_businessId_key" ON "SavedCenter"("userId", "businessId");

-- AddForeignKey
ALTER TABLE "SavedCenter" ADD CONSTRAINT "SavedCenter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCenter" ADD CONSTRAINT "SavedCenter_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
