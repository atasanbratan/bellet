-- CreateTable
CREATE TABLE "SmsGateway" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmsGateway_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SmsGateway_phoneNumber_key" ON "SmsGateway"("phoneNumber");
