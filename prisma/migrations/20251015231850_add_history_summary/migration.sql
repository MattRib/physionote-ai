-- CreateTable
CREATE TABLE "HistorySummary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "aiModel" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "sessionsIds" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HistorySummary_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "HistorySummary_patientId_key" ON "HistorySummary"("patientId");
